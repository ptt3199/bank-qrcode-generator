package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Request represents the incoming request structure
type Request struct {
	BankBinCode string `json:"bankBinCode"`
	BankAccount string `json:"bankAccount"`
	Amount      string `json:"amount"`
	Message     string `json:"message"`
}

// VietQRData represents the response data structure
type VietQRData struct {
	Version       string  `json:"version"`
	BankBin       string  `json:"bankBin"`
	AccountNumber string  `json:"accountNumber"`
	Amount        float64 `json:"amount"`
	Message       string  `json:"message"`
	Timestamp     string  `json:"timestamp"`
	QRString      string  `json:"qrString"`
}

// Response represents the API response structure
type Response struct {
	Success      bool       `json:"success"`
	QRCodeString string     `json:"qrCodeString"`
	Data         VietQRData `json:"data"`
	Message      string     `json:"message"`
	Error        string     `json:"error,omitempty"`
}

// generateCheckSum calculates CRC-16 checksum for EMV QR Code
func generateCheckSum(text string) string {
	crc := 0xFFFF
	polynomial := 0x1021

	for _, b := range []byte(text) {
		for i := 0; i < 8; i++ {
			bit := ((int(b) >> (7 - i)) & 1) == 1
			c15 := ((crc >> 15) & 1) == 1
			crc <<= 1
			if c15 != bit {
				crc ^= polynomial
			}
		}
	}

	crc &= 0xFFFF
	return strings.ToUpper(fmt.Sprintf("%04X", crc))
}

// Handler is the main function that handles HTTP requests
func Handler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for all requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// Handle preflight OPTIONS requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST requests
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Error:   "Method not allowed",
		})
		return
	}

	// Parse request body
	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Error:   "Invalid JSON in request body",
		})
		return
	}

	// Validate required fields
	if req.BankBinCode == "" || req.BankAccount == "" || req.Amount == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Error:   "Missing required fields: bankBinCode, bankAccount, and amount are required",
		})
		return
	}

	// Parse and validate amount
	numericAmount, err := strconv.ParseFloat(req.Amount, 64)
	if err != nil || numericAmount <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Error:   "Amount must be a positive number",
		})
		return
	}

	// Clean inputs
	inputBankCode := strings.TrimSpace(req.BankBinCode)
	inputBankAccount := strings.TrimSpace(req.BankAccount)
	inputAmount := strings.TrimSpace(req.Amount)
	inputMessage := strings.TrimSpace(req.Message)

	// Build part12 (bank account info) - nested inside part11
	part12Builder := fmt.Sprintf("00%02d%s01%02d%s", len(inputBankCode), inputBankCode, len(inputBankAccount), inputBankAccount)

	// Build part11 (NAPAS info) - contains part12 nested inside
	part11Builder := fmt.Sprintf("0010A00000072701%02d%s0208QRIBFTTA", len(part12Builder), part12Builder)

	// Build part1 (main merchant info)
	part1Builder := fmt.Sprintf("38%02d%s", len(part11Builder), part11Builder)

	// Build part21 (additional message if provided)
	var part21Builder string
	if inputMessage != "" {
		if len(inputMessage) > 50 {
			inputMessage = inputMessage[:50]
		}
		part21Builder = fmt.Sprintf("08%02d%s", len(inputMessage), inputMessage)
	}

	// Build part2 (transaction info)
	part2 := "5303704" + "54" + fmt.Sprintf("%02d", len(inputAmount)) + inputAmount + "5802VN"
	if part21Builder != "" {
		part2 += "62" + fmt.Sprintf("%02d", len(part21Builder)) + part21Builder
	}

	// Build main QR string without checksum
	builder := "000201" + "010212" + part1Builder + part2 + "6304"

	// Calculate checksum
	checksum := generateCheckSum(builder)

	// Pad checksum to 4 characters if needed
	for len(checksum) < 4 {
		checksum = "0" + checksum
	}

	// Final QR string
	qrString := builder + checksum

	// Create VietQR metadata
	vietQrData := VietQRData{
		Version:       "1.0",
		BankBin:       req.BankBinCode,
		AccountNumber: req.BankAccount,
		Amount:        numericAmount,
		Message:       req.Message,
		Timestamp:     time.Now().Format(time.RFC3339),
		QRString:      qrString,
	}

	// Send successful response
	response := Response{
		Success:      true,
		QRCodeString: qrString,
		Data:         vietQrData,
		Message:      "QR code generated successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
