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

	// Format the VietQR string according to the standard
	qrString := fmt.Sprintf("%s|%s|%.0f", req.BankBinCode, req.BankAccount, numericAmount)

	// Add message if provided
	if req.Message != "" {
		// Remove special characters and limit message length
		cleanMessage := strings.ReplaceAll(strings.TrimSpace(req.Message), "|", "")
		if len(cleanMessage) > 100 {
			cleanMessage = cleanMessage[:100]
		}
		if cleanMessage != "" {
			qrString += "|" + cleanMessage
		}
	}

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
