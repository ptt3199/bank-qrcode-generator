module.exports = (req, res) => {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bankBinCode, bankAccount, amount, message } = req.body;

    // Validate required fields
    if (!bankBinCode || !bankAccount || !amount) {
      return res.status(400).json({ error: 'Missing required fields: bankBinCode, bankAccount, and amount are required.' });
    }

    // Validate amount is a positive number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    // Format the VietQR string according to the standard
    // VietQR format: Bank BIN + Account Number + Amount + Message (optional)
    // This follows the standard format for Vietnamese QR code payments
    let qrString = `${bankBinCode}|${bankAccount}|${numericAmount}`;
    
    if (message && message.trim()) {
      // Remove special characters and limit message length
      const cleanMessage = message.trim().replace(/[|]/g, '').substring(0, 100);
      qrString += `|${cleanMessage}`;
    }

    // Add additional VietQR metadata for compatibility
    const timestamp = new Date().toISOString();
    const vietQrData = {
      version: '1.0',
      bankBin: bankBinCode,
      accountNumber: bankAccount,
      amount: numericAmount,
      message: message || '',
      timestamp: timestamp,
      qrString: qrString
    };

    // Return the QR code data
    res.status(200).json({
      success: true,
      qrCodeString: qrString,
      data: vietQrData,
      message: 'QR code generated successfully'
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating QR code',
      details: error.message 
    });
  }
}; 