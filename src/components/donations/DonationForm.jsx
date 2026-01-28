"use client"

import { useState } from "react"
import axios from "axios"

const DonationForm = ({ campaignId, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const predefinedAmounts = [25, 50, 100, 250, 500]

  const handleAmountClick = (value) => {
    setAmount(value.toString())
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    const donationAmount = Number.parseFloat(amount)
    if (donationAmount <= 0) {
      setError("Please enter a valid donation amount")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to make a donation")
        setLoading(false)
        return
      }

      console.log("[v0] Making donation request:", { campaignId, amount: donationAmount })

      const response = await axios.post(
        "https://donate-hub-backend11.vercel.app/api/donations",
        {
          campaignId,
          amount: donationAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("[v0] Donation successful:", response.data)

      setSuccess(true)
      setAmount("")

      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error) {
      console.log("[v0] Donation error:", error.response?.data || error.message)
      setError(error.response?.data?.message || "Failed to process donation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Thank You!</h3>
          <p className="text-green-700">Your donation of ${amount} has been processed successfully.</p>
          <p className="text-sm text-green-600 mt-2">Your contribution makes a real difference!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Make a Donation</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount (USD)</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAmountClick(value)}
                className={`py-3 px-4 border rounded-lg text-sm font-semibold transition-all ${
                  amount === value.toString()
                    ? "bg-green-600 text-white border-green-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter custom amount"
              className="form-input pl-8"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed. Your donation will
              be recorded in the system for testing purposes.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !amount}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Donate Now"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DonationForm
