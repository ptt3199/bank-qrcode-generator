# QR Code Generator for Vietnamese Bank Transfers

A modern React application for generating QR codes for money transfers to Vietnamese banks. This application supports all major Vietnamese banks and generates VietQR-compatible codes.

## Features

- 🏦 Support for major Vietnamese banks (VCB, TCB, BIDV, Agribank, etc.)
- 💰 Easy money transfer QR code generation
- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 Serverless API with Vercel
- 📱 Mobile-friendly design
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with Inter font

## Supported Banks

- Vietcombank (VCB) - 970436
- Techcombank (TCB) - 970407
- BIDV - 970418
- Agribank - 970405
- MB Bank - 970422
- ACB - 970416
- Sacombank - 970403
- VPBank - 970432
- VietinBank - 970415

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd qrcode-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
qrcode-generator/
├── api/
│   └── generate-qr.js      # Vercel serverless function
├── src/
│   ├── App.jsx             # Main React component
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind CSS imports
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your deployment

### Environment Setup

No environment variables are required for basic functionality. The application works out of the box.

## API Endpoints

### POST `/api/generate-qr`

Generates a QR code string for Vietnamese bank transfers.

**Request Body:**
```json
{
  "bankBinCode": "970436",
  "bankAccount": "1234567890",
  "amount": "100000",
  "message": "Payment for services"
}
```

**Response:**
```json
{
  "success": true,
  "qrCodeString": "970436|1234567890|100000|Payment for services",
  "data": {
    "version": "1.0",
    "bankBin": "970436",
    "accountNumber": "1234567890",
    "amount": 100000,
    "message": "Payment for services",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "qrString": "970436|1234567890|100000|Payment for services"
  },
  "message": "QR code generated successfully"
}
```

## How It Works

1. **User Input**: Users select a bank, enter account details, amount, and optional message
2. **API Call**: Frontend sends data to the serverless API endpoint
3. **QR Generation**: API formats the data according to VietQR standards
4. **Display**: QR code data is visualized using HTML5 Canvas

## VietQR Format

The application generates QR codes in the standard VietQR format:
```
{bankBin}|{accountNumber}|{amount}|{message}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for the Vietnamese developer community 