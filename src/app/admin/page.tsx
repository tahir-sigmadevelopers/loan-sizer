'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Save, Eye, Download, Calculator, AlertTriangle } from 'lucide-react';

// Admin form schemas
const formulaSchema = z.object({
  baseInterestRate: z.number().min(0).max(20),
  ficoDiscount750: z.number().min(0).max(5),
  ficoDiscount700: z.number().min(0).max(5),
  ficoDiscount650: z.number().min(0).max(5),
  experienceDiscountProfessional: z.number().min(0).max(2),
  experienceDiscountExperienced: z.number().min(0).max(2),
  minInterestRate: z.number().min(0).max(10),
  ltvBeginner: z.number().min(50).max(90),
  ltvIntermediate: z.number().min(50).max(90),
  ltvExperienced: z.number().min(50).max(90),
  ltvProfessional: z.number().min(50).max(90),
  closingCostsPercentage: z.number().min(0).max(10),
  originationFeePercentage: z.number().min(0).max(5),
});

const validationSchema = z.object({
  minFico: z.number().min(300).max(850),
  maxRehabBudgetPercentage: z.number().min(0).max(100),
  minArvToPurchaseRatio: z.number().min(1).max(3),
});

type FormulaForm = z.infer<typeof formulaSchema>;
type ValidationForm = z.infer<typeof validationSchema>;

// Mock data for saved term sheets
const mockTermSheets = [
  {
    id: 1,
    address: '123 Main St, Anytown, USA',
    borrowerName: 'John Doe',
    loanAmount: 250000,
    interestRate: 7.5,
    status: 'Signed',
    date: '2024-01-15',
  },
  {
    id: 2,
    address: '456 Oak Ave, Somewhere, USA',
    borrowerName: 'Jane Smith',
    loanAmount: 180000,
    interestRate: 8.2,
    status: 'Pending',
    date: '2024-01-14',
  },
  {
    id: 3,
    address: '789 Pine Rd, Elsewhere, USA',
    borrowerName: 'Bob Johnson',
    loanAmount: 320000,
    interestRate: 7.8,
    status: 'Downloaded',
    date: '2024-01-13',
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('formulas');
  const [isSaving, setIsSaving] = useState(false);

  const formulaForm = useForm<FormulaForm>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      baseInterestRate: 8.5,
      ficoDiscount750: 1.5,
      ficoDiscount700: 1.0,
      ficoDiscount650: 0.5,
      experienceDiscountProfessional: 0.5,
      experienceDiscountExperienced: 0.25,
      minInterestRate: 6.0,
      ltvBeginner: 70,
      ltvIntermediate: 75,
      ltvExperienced: 80,
      ltvProfessional: 85,
      closingCostsPercentage: 3.0,
      originationFeePercentage: 1.0,
    },
  });

  const validationForm = useForm<ValidationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      minFico: 650,
      maxRehabBudgetPercentage: 50,
      minArvToPurchaseRatio: 1.2,
    },
  });

  const onFormulaSubmit = async (data: FormulaForm) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving formulas:', data);
    setIsSaving(false);
    alert('Formulas updated successfully!');
  };

  const onValidationSubmit = async (data: ValidationForm) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving validation rules:', data);
    setIsSaving(false);
    alert('Validation rules updated successfully!');
  };

  const tabs = [
    { id: 'formulas', name: 'Loan Formulas', icon: Calculator },
    { id: 'validation', name: 'Validation Rules', icon: AlertTriangle },
    { id: 'termsheets', name: 'Term Sheets', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Settings className="inline-block w-8 h-8 mr-2 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage loan formulas, validation rules, and view term sheets</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'formulas' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Loan Calculation Formulas</h2>
              
              <form onSubmit={formulaForm.handleSubmit(onFormulaSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Interest Rate Calculations</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('baseInterestRate', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FICO 750+ Discount (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('ficoDiscount750', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FICO 700+ Discount (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('ficoDiscount700', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FICO 650+ Discount (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('ficoDiscount650', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Experience Discount (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('experienceDiscountProfessional', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experienced Borrower Discount (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('experienceDiscountExperienced', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('minInterestRate', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">LTV & Fee Calculations</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTV - Beginner (%)
                        </label>
                        <input
                          type="number"
                          {...formulaForm.register('ltvBeginner', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTV - Intermediate (%)
                        </label>
                        <input
                          type="number"
                          {...formulaForm.register('ltvIntermediate', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTV - Experienced (%)
                        </label>
                        <input
                          type="number"
                          {...formulaForm.register('ltvExperienced', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTV - Professional (%)
                        </label>
                        <input
                          type="number"
                          {...formulaForm.register('ltvProfessional', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Closing Costs (% of loan amount)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('closingCostsPercentage', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Origination Fee (% of loan amount)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...formulaForm.register('originationFeePercentage', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Formulas'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Validation Rules</h2>
              
              <form onSubmit={validationForm.handleSubmit(onValidationSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum FICO Score
                    </label>
                    <input
                      type="number"
                      {...validationForm.register('minFico', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum FICO score required for approval</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Rehab Budget (% of purchase price)
                    </label>
                    <input
                      type="number"
                      {...validationForm.register('maxRehabBudgetPercentage', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Maximum rehab budget as percentage of purchase price</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum ARV to Purchase Ratio
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...validationForm.register('minArvToPurchaseRatio', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum ARV to purchase price ratio for optimal financing</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Validation Rules'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'termsheets' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Term Sheets</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrower
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTermSheets.map((termSheet) => (
                      <tr key={termSheet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {termSheet.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {termSheet.borrowerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${termSheet.loanAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {termSheet.interestRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            termSheet.status === 'Signed' 
                              ? 'bg-green-100 text-green-800'
                              : termSheet.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {termSheet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {termSheet.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 