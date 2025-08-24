# Loan Sizer - Professional Loan Calculator

A modern, fully functional loan sizing tool built with Next.js 15 that allows users to input deal details and automatically generate professional term sheets based on preset formulas.

## 🚀 Features

### Core Functionality
- **Loan Calculation Engine**: Real-time calculation of loan terms based on borrower profile and property details
- **Dynamic Formulas**: Configurable loan formulas managed through admin dashboard
- **Validation System**: Smart input validation with real-time feedback
- **Professional Term Sheets**: PDF generation with company branding
- **E-Signature Integration**: Ready for Dotloop or similar e-signature services

### User Interface
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Real-time Updates**: Instant calculation results as users input data
- **Validation Feedback**: Clear error messages and approval status indicators

### Admin Dashboard
- **Formula Management**: Easy-to-use interface for updating loan calculation formulas
- **Validation Rules**: Configure approval criteria and input limits
- **Term Sheet Tracking**: View and manage all generated term sheets
- **No Coding Required**: Admin can update all settings without developer intervention

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loan-sizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
loan-sizer/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main loan sizer interface
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin dashboard
│   │   ├── layout.tsx            # Root layout with navigation
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── Navigation.tsx        # Navigation component
│   └── lib/
│       └── termSheetService.ts   # PDF generation and email services
├── public/                       # Static assets
└── package.json
```

## 🔧 Configuration

### Loan Formulas
The application uses configurable formulas for loan calculations. These can be updated through the admin dashboard:

- **Interest Rate Calculation**: Base rate with FICO and experience discounts
- **LTV Ratios**: Different loan-to-value ratios based on borrower experience
- **Closing Costs**: Percentage-based calculations
- **Origination Fees**: Configurable fee structures

### Validation Rules
Set approval criteria and input limits:

- **Minimum FICO Score**: Required credit score for approval
- **Rehab Budget Limits**: Maximum rehab budget as percentage of purchase price
- **ARV Ratios**: Minimum after-repair value to purchase price ratios

## 📧 Email Integration

The application is prepared for email service integration. To set up email functionality:

1. **Choose an email service** (SendGrid, AWS SES, EmailJS, etc.)
2. **Update the `termSheetService.ts` file** with your service credentials
3. **Configure email templates** for term sheet delivery

### Example EmailJS Setup
```typescript
// In termSheetService.ts
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('YOUR_PUBLIC_KEY');

// Send email with PDF
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  {
    to_email: email,
    to_name: borrowerName,
    message: 'Your loan term sheet is attached.',
  }
);
```

## 🔐 E-Signature Integration

The application is ready for Dotloop integration. To set up e-signature functionality:

1. **Obtain Dotloop API credentials**
2. **Update the `initiateESignature` method** in `termSheetService.ts`
3. **Configure webhook endpoints** for signature status updates

### Example Dotloop Integration
```typescript
// In termSheetService.ts
const response = await fetch('https://api.dotloop.com/v2/loops', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_DOTLOOP_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Dotloop API payload
  }),
});
```

## 🎨 Customization

### Branding
- Update company logo and colors in the navigation component
- Modify PDF template in `termSheetService.ts`
- Customize email templates for your brand

### Styling
- All styling is done with Tailwind CSS classes
- Modify `globals.css` for custom CSS
- Update component styles for brand-specific design

### Formulas
- All loan calculation formulas are in the main page component
- Move to backend API for production use
- Update admin dashboard to manage formulas dynamically

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 📊 Production Considerations

### Backend Integration
For production use, consider:
- Moving formulas to a backend API
- Implementing user authentication
- Adding database storage for term sheets
- Setting up proper email service integration

### Security
- Implement proper authentication for admin access
- Secure API endpoints
- Validate all user inputs
- Use environment variables for sensitive data

### Performance
- Optimize images and assets
- Implement caching strategies
- Use CDN for static assets
- Monitor application performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates and Maintenance

### Regular Maintenance
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update formulas and validation rules as needed
- Backup term sheet data regularly

### Feature Updates
- Add new loan types
- Implement additional validation rules
- Enhance PDF templates
- Add new integration options

---

**Built with ❤️ using Next.js 15**
