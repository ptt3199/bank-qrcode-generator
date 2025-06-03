import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

// Main App component
const App = () => {
  // State variables for form inputs
  const [bankBinCode, setBankBinCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  // State for the generated QR code data string
  const [qrCodeData, setQrCodeData] = useState('');
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');

  // Ref for the canvas element
  const canvasRef = useRef(null);

  // Sample bank data (Vietnamese banks)
  const banks = [
    { name: 'Select Bank', bin: '' },
    { name: 'Vietcombank (VCB)', bin: '970436' },
    { name: 'Techcombank (TCB)', bin: '970407' },
    { name: 'BIDV', bin: '970418' },
    { name: 'Agribank', bin: '970405' },
    { name: 'MB Bank', bin: '970422' },
    { name: 'ACB', bin: '970416' },
    { name: 'Sacombank', bin: '970403' },
    { name: 'VPBank', bin: '970432' },
    { name: 'VietinBank', bin: '970415' },
  ];

  // Function to handle QR code generation
  const generateQRCode = async () => {
    setError(''); // Clear previous errors
    setIsLoading(true); // Set loading state

    // Basic validation
    if (!bankBinCode || !bankAccount || !amount) {
      setError('Please fill in Bank, Bank Account, and Amount.');
      setIsLoading(false);
      return;
    }

    try {
      // Make a POST request to the Go serverless function (faster performance)
      // Using Go endpoint for better cold start times and lower memory usage
      const response = await fetch(`${window.location.origin}/api/generate-qr.go`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankBinCode,
          bankAccount,
          amount,
          message,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR code.');
      }

      // Parse the JSON response
      const data = await response.json();
      setQrCodeData(data.qrCodeString); // Update state with the generated QR string
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError(`Error: ${err.message}`); // Display error message to the user
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Generate real QR code using qrcode library
  useEffect(() => {
    if (qrCodeData && canvasRef.current) {
      const canvas = canvasRef.current;
      
      // QR code options
      const qrOptions = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      };

      // Generate real QR code
      QRCode.toCanvas(canvas, qrCodeData, qrOptions, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
          setError('Failed to generate QR code visualization');
        }
      });
    }
  }, [qrCodeData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Money Transfer QR Code Generator
        </h1>

        {/* Performance Badge */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ⚡ Powered by Go - Ultra Fast Performance
          </span>
        </div>

        {/* Input form */}
        <div className="space-y-6">
          {/* Bank Selection */}
          <div>
            <label htmlFor="bank" className="block text-gray-700 text-sm font-medium mb-2">
              Bank
            </label>
            <select
              id="bank"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={bankBinCode}
              onChange={(e) => setBankBinCode(e.target.value)}
            >
              {banks.map((bank) => (
                <option key={bank.bin} value={bank.bin}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Account Input */}
          <div>
            <label htmlFor="account" className="block text-gray-700 text-sm font-medium mb-2">
              Bank Account Number
            </label>
            <input
              type="text"
              id="account"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., 1234567890"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-gray-700 text-sm font-medium mb-2">
              Amount (VND)
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., 100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
              Message (Optional)
            </label>
            <input
              type="text"
              id="message"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., Payment for services"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQRCode}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            } shadow-md`}
          >
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </button>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
        </div>

        {/* QR Code Display Area */}
        {qrCodeData && (
          <div className="mt-8 text-center bg-gray-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Scannable QR Code</h2>
            <div className="flex justify-center mb-4">
              {/* Canvas element for the real QR code */}
              <canvas 
                ref={canvasRef} 
                className="border border-gray-300 rounded-lg shadow-sm bg-white p-2"
              />
            </div>
            <div className="text-xs text-green-600 mb-2 font-medium">
              ✅ Ready to scan with any banking app
            </div>
            <p className="text-sm text-gray-600 break-all">
              <span className="font-semibold">QR Data:</span> {qrCodeData}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 