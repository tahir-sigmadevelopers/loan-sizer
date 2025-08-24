import jsPDF from 'jspdf';

export interface TermSheetData {
  address: string;
  transactionType: string;
  purchasePrice: number;
  rehabBudget: number;
  arv: number;
  borrowerFico: number;
  borrowerExperience: string;
  maxLoanAmount: number;
  interestRate: number;
  ltv: number;
  downPayment: number;
  closingCosts: number;
  originationFee: number;
  monthlyPayment: number;
  totalProjectCost: number;
  approvalStatus: string;
  borrowerName?: string;
  borrowerEmail?: string;
}

export class TermSheetService {
  static generatePDF(termSheetData: TermSheetData): jsPDF {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LOAN TERM SHEET', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 35);
    
    // Property Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Property Information', 20, 50);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Address: ${termSheetData.address}`, 20, 60);
    doc.text(`Transaction Type: ${termSheetData.transactionType}`, 20, 70);
    doc.text(`Purchase Price: $${termSheetData.purchasePrice.toLocaleString()}`, 20, 80);
    doc.text(`Rehab Budget: $${termSheetData.rehabBudget.toLocaleString()}`, 20, 90);
    doc.text(`ARV: $${termSheetData.arv.toLocaleString()}`, 20, 100);
    
    // Borrower Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Borrower Information', 20, 120);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`FICO Score: ${termSheetData.borrowerFico}`, 20, 130);
    doc.text(`Experience Level: ${termSheetData.borrowerExperience}`, 20, 140);
    
    // Loan Terms
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Loan Terms', 20, 160);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Maximum Loan Amount: $${termSheetData.maxLoanAmount.toLocaleString()}`, 20, 170);
    doc.text(`Interest Rate: ${termSheetData.interestRate}%`, 20, 180);
    doc.text(`LTV Ratio: ${termSheetData.ltv}%`, 20, 190);
    doc.text(`Down Payment: $${termSheetData.downPayment.toLocaleString()}`, 20, 200);
    doc.text(`Monthly Payment: $${termSheetData.monthlyPayment.toLocaleString()}`, 20, 210);
    
    // Closing Costs
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Closing Costs Breakdown', 20, 230);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Origination Fee: $${termSheetData.originationFee.toLocaleString()}`, 20, 240);
    doc.text(`Other Closing Costs: $${termSheetData.closingCosts.toLocaleString()}`, 20, 250);
    doc.text(`Total Closing Costs: $${(termSheetData.originationFee + termSheetData.closingCosts).toLocaleString()}`, 20, 260);
    
    // Approval Status
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Status', 20, 280);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Approval Status: ${termSheetData.approvalStatus}`, 20, 290);
    
    return doc;
  }
  
  static downloadPDF(termSheetData: TermSheetData): void {
    const doc = this.generatePDF(termSheetData);
    const fileName = `term-sheet-${termSheetData.address.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;
    doc.save(fileName);
  }
  
  static async sendEmailWithPDF(termSheetData: TermSheetData, email: string): Promise<boolean> {
    try {
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      const doc = this.generatePDF(termSheetData);
      // const pdfBlob = doc.output('blob'); // Will be used when implementing actual email service
      
      // Mock email sending - replace with actual email service integration
      console.log('Sending email to:', email);
      console.log('PDF generated for term sheet');
      
      // Example with EmailJS (you would need to set up EmailJS)
      // const emailjs = require('@emailjs/browser');
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   {
      //     to_email: email,
      //     to_name: termSheetData.borrowerName || 'Borrower',
      //     message: 'Your loan term sheet is attached.',
      //   },
      //   'YOUR_PUBLIC_KEY'
      // );
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  static async initiateESignature(termSheetData: TermSheetData, email: string): Promise<boolean> {
    try {
      // This would integrate with Dotloop or similar e-signature service
      console.log('Initiating e-signature process for:', email);
      console.log('Term sheet data:', termSheetData);
      
      // Mock e-signature initiation - replace with actual Dotloop integration
      // Example Dotloop API call:
      // const response = await fetch('https://api.dotloop.com/v2/loops', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer YOUR_DOTLOOP_TOKEN',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     // Dotloop API payload
      //   }),
      // });
      
      return true;
    } catch (error) {
      console.error('Error initiating e-signature:', error);
      return false;
    }
  }
} 