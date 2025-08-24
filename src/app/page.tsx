'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, Download, FileSignature, AlertTriangle, CheckCircle } from 'lucide-react';
import { TermSheetService } from '@/lib/termSheetService';

// Validation schema for the loan sizer form
const loanSizerSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  transactionType: z.enum(['Purchase', 'Refinance', 'Cash-Out Refinance']),
  purchasePrice: z.number().min(1000, 'Purchase price must be at least $1,000'),
  rehabBudget: z.number().min(0, 'Rehab budget cannot be negative'),
  arv: z.number().min(1000, 'ARV must be at least $1,000'),
  borrowerFico: z.number().min(300).max(850, 'FICO score must be between 300-850'),
  borrowerExperience: z.enum(['Beginner', 'Intermediate', 'Experienced', 'Professional']),
});

type LoanSizerForm = z.infer<typeof loanSizerSchema>;

// Loan calculation formulas (these would be managed in the backend)
const loanFormulas = {
  maxLoanAmount: (arv: number, ltv: number) => arv * (ltv / 100),
  interestRate: (fico: number, experience: string) => {
    let baseRate = 8.5;
    if (fico >= 750) baseRate -= 1.5;
    else if (fico >= 700) baseRate -= 1.0;
    else if (fico >= 650) baseRate -= 0.5;
    
    if (experience === 'Professional') baseRate -= 0.5;
    else if (experience === 'Experienced') baseRate -= 0.25;
    
    return Math.max(baseRate, 6.0);
  },
  ltvByExperience: (experience: string) => {
    switch (experience) {
      case 'Professional': return 85;
      case 'Experienced': return 80;
      case 'Intermediate': return 75;
      case 'Beginner': return 70;
      default: return 70;
    }
  },
  closingCosts: (loanAmount: number) => loanAmount * 0.03,
  originationFee: (loanAmount: number) => loanAmount * 0.01,
};

// Validation rules (these would be managed in the backend)
const validationRules = {
  minFico: 650,
  maxRehabBudget: (purchasePrice: number) => purchasePrice * 0.5,
  minArvToPurchaseRatio: 1.2,
};

export default function LoanSizerPage() {
  const [calculatedLoan, setCalculatedLoan] = useState<{
    maxLoanAmount: number;
    interestRate: number;
    ltv: number;
    downPayment: number;
    closingCosts: number;
    originationFee: number;
    monthlyPayment: number;
    totalProjectCost: number;
    approvalStatus: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoanSizerForm>({
    resolver: zodResolver(loanSizerSchema),
  });

  // 
  const watchedValues = watch();

  const validateInputs = (data: LoanSizerForm): string[] => {
    const errors: string[] = [];

    if (data.borrowerFico < validationRules.minFico) {
      errors.push(`FICO score must be at least ${validationRules.minFico} for approval`);
    }

    if (data.rehabBudget > validationRules.maxRehabBudget(data.purchasePrice)) {
      errors.push(`Rehab budget cannot exceed 50% of purchase price`);
    }

    if (data.arv / data.purchasePrice < validationRules.minArvToPurchaseRatio) {
      errors.push(`ARV should be at least 120% of purchase price for optimal financing`);
    }

    return errors;
  };

  const calculateLoan = (data: LoanSizerForm) => {
    setIsCalculating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const ltv = loanFormulas.ltvByExperience(data.borrowerExperience);
      const maxLoanAmount = loanFormulas.maxLoanAmount(data.arv, ltv);
      const interestRate = loanFormulas.interestRate(data.borrowerFico, data.borrowerExperience);
      const closingCosts = loanFormulas.closingCosts(maxLoanAmount);
      const originationFee = loanFormulas.originationFee(maxLoanAmount);
      
      const totalProjectCost = data.purchasePrice + data.rehabBudget;
      const downPayment = totalProjectCost - maxLoanAmount;
      
      const monthlyPayment = (maxLoanAmount * (interestRate / 100) / 12) / 
        (1 - Math.pow(1 + (interestRate / 100) / 12, -360));

      setCalculatedLoan({
        maxLoanAmount: Math.round(maxLoanAmount),
        interestRate: Math.round(interestRate * 100) / 100,
        ltv,
        downPayment: Math.round(downPayment),
        closingCosts: Math.round(closingCosts),
        originationFee: Math.round(originationFee),
        monthlyPayment: Math.round(monthlyPayment),
        totalProjectCost: Math.round(totalProjectCost),
        approvalStatus: data.borrowerFico >= validationRules.minFico ? 'Approved' : 'Pending Review',
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  const onSubmit = (data: LoanSizerForm) => {
    const validationErrors = validateInputs(data);
    setValidationErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      calculateLoan(data);
    }
  };

  const handleDownloadTermSheet = () => {
    if (calculatedLoan) {
      const termSheetData = {
        address: watchedValues.address,
        transactionType: watchedValues.transactionType,
        purchasePrice: watchedValues.purchasePrice,
        rehabBudget: watchedValues.rehabBudget,
        arv: watchedValues.arv,
        borrowerFico: watchedValues.borrowerFico,
        borrowerExperience: watchedValues.borrowerExperience,
        ...calculatedLoan,
      };
      
      // Download PDF directly
      TermSheetService.downloadPDF(termSheetData);
    }
  };

  const handleSignTermSheet = async () => {
    if (calculatedLoan) {
      const email = prompt('Please enter your email address for e-signature:');
      if (email) {
        const termSheetData = {
          address: watchedValues.address,
          transactionType: watchedValues.transactionType,
          purchasePrice: watchedValues.purchasePrice,
          rehabBudget: watchedValues.rehabBudget,
          arv: watchedValues.arv,
          borrowerFico: watchedValues.borrowerFico,
          borrowerExperience: watchedValues.borrowerExperience,
          borrowerEmail: email,
          ...calculatedLoan,
        };
        
        const success = await TermSheetService.initiateESignature(termSheetData, email);
        if (success) {
          alert('E-signature process initiated! You will receive an email to sign the term sheet.');
        } else {
          alert('There was an error initiating the e-signature process. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Calculator className="inline-block w-8 h-8 mr-2 text-blue-600" />
            Loan Sizer
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your loan terms and generate a professional term sheet
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Deal Details</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  {...register('transactionType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Purchase">Purchase</option>
                  <option value="Refinance">Refinance</option>
                  <option value="Cash-Out Refinance">Cash-Out Refinance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price / As-Is Value
                  </label>
                  <input
                    type="number"
                    {...register('purchasePrice', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="$"
                  />
                  {errors.purchasePrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.purchasePrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rehab Budget
                  </label>
                  <input
                    type="number"
                    {...register('rehabBudget', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="$"
                  />
                  {errors.rehabBudget && (
                    <p className="text-red-500 text-sm mt-1">{errors.rehabBudget.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ARV (After Repair Value)
                </label>
                <input
                  type="number"
                  {...register('arv', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$"
                />
                {errors.arv && (
                  <p className="text-red-500 text-sm mt-1">{errors.arv.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Borrower FICO
                  </label>
                  <input
                    type="number"
                    {...register('borrowerFico', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="300-850"
                  />
                  {errors.borrowerFico && (
                    <p className="text-red-500 text-sm mt-1">{errors.borrowerFico.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Borrower Experience
                  </label>
                  <select
                    {...register('borrowerExperience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Please review the following:
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
        </div>
              )}

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Loan Terms'}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Loan Terms</h2>
            
            {calculatedLoan ? (
              <div className="space-y-6">
                {/* Approval Status */}
                <div className={`p-4 rounded-md ${
                  calculatedLoan.approvalStatus === 'Approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    {calculatedLoan.approvalStatus === 'Approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                    <span className={`ml-2 font-medium ${
                      calculatedLoan.approvalStatus === 'Approved' ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      Status: {calculatedLoan.approvalStatus}
                    </span>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Maximum Loan Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${calculatedLoan.maxLoanAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{calculatedLoan.interestRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">LTV Ratio</p>
                    <p className="text-2xl font-bold text-gray-900">{calculatedLoan.ltv}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Down Payment</p>
                    <p className="text-2xl font-bold text-gray-900">${calculatedLoan.downPayment.toLocaleString()}</p>
                  </div>
                </div>

                {/* Monthly Payment */}
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-600">Estimated Monthly Payment</p>
                  <p className="text-3xl font-bold text-blue-900">${calculatedLoan.monthlyPayment.toLocaleString()}</p>
                </div>

                {/* Closing Costs Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Closing Costs Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origination Fee</span>
                      <span className="font-medium">${calculatedLoan.originationFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Closing Costs</span>
                      <span className="font-medium">${calculatedLoan.closingCosts.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Closing Costs</span>
                      <span>${(calculatedLoan.originationFee + calculatedLoan.closingCosts).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadTermSheet}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Term Sheet
                  </button>
                  <button
                    onClick={handleSignTermSheet}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <FileSignature className="w-5 h-5 mr-2" />
                    Sign Term Sheet to Get Started
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No calculation yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fill out the form and click &quot;Calculate Loan Terms&quot; to see your results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
