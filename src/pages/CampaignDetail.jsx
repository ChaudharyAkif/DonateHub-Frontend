"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import DonationForm from "../components/donations/DonationForm"

const CampaignDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [campaign, setCampaign] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDonationForm, setShowDonationForm] = useState(false)

  useEffect(() => {
    fetchCampaignDetails()
    fetchCampaignDonations()
  }, [id])

  const fetchCampaignDetails = async () => {
    try {
      const response = await axios.get(`https://donate-hub-backend11.vercel.app/api/campaigns/${id}`)
      setCampaign(response.data)
    } catch (error) {
      console.error("Error fetching campaign:", error)
      navigate("/campaigns")
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaignDonations = async () => {
    try {
      const response = await axios.get(`https://donate-hub-backend11.vercel.app/api/donations/campaign/${id}`)
      setDonations(response.data)
    } catch (error) {
      console.error("Error fetching donations:", error)
    }
  }

  const handleDonationSuccess = () => {
    setShowDonationForm(false)
    fetchCampaignDetails()
    fetchCampaignDonations()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Campaign not found</h2>
          <button
            onClick={() => navigate("/campaigns")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    )
  }

  const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)

  const getCategoryColor = (category) => {
    const colors = {
      health: "bg-red-100 text-red-800",
      education: "bg-blue-100 text-blue-800",
      disaster: "bg-yellow-100 text-yellow-800",
      others: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.others
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/campaigns")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Campaigns
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(campaign.category)}`}
              >
                {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>

            <div className="flex items-center text-gray-600 mb-6">
              <span>Created by {campaign.createdBy.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(campaign.createdAt)}</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {progressPercentage.toFixed(1)}%</span>
                <span>
                  {formatAmount(campaign.raisedAmount)} of {formatAmount(campaign.goalAmount)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About this campaign</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
            </div>

            {isAuthenticated && user.role === "donor" && campaign.status === "active" && (
              <div className="border-t pt-6">
                {!showDonationForm ? (
                  <button
                    onClick={() => setShowDonationForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg font-medium transition-colors duration-200"
                  >
                    Donate Now
                  </button>
                ) : (
                  <DonationForm
                    campaignId={campaign._id}
                    onSuccess={handleDonationSuccess}
                    onCancel={() => setShowDonationForm(false)}
                  />
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="border-t pt-6 text-center">
                <p className="text-gray-600 mb-4">Please log in to make a donation</p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        {donations.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
              <div className="space-y-3">
                {donations.slice(0, 10).map((donation) => (
                  <div
                    key={donation._id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{donation.donorId.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{formatDate(donation.donatedAt)}</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatAmount(donation.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignDetail
