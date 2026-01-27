"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const SupportedCampaigns = () => {
  const [supportedCampaigns, setSupportedCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupportedCampaigns()
  }, [])

  const fetchSupportedCampaigns = async () => {
    try {
      // Get donation history to find supported campaigns
      const donationResponse = await axios.get("http://localhost:5000/api/donations/donor")
      const donations = donationResponse.data

      // Group donations by campaign and calculate totals
      const campaignMap = new Map()
      donations.forEach((donation) => {
        const campaignId = donation.campaignId._id
        if (campaignMap.has(campaignId)) {
          const existing = campaignMap.get(campaignId)
          existing.totalDonated += donation.amount
          existing.donationCount += 1
          existing.lastDonation =
            new Date(donation.donatedAt) > new Date(existing.lastDonation) ? donation.donatedAt : existing.lastDonation
        } else {
          campaignMap.set(campaignId, {
            campaign: donation.campaignId,
            totalDonated: donation.amount,
            donationCount: 1,
            lastDonation: donation.donatedAt,
          })
        }
      })

      // Fetch full campaign details for each supported campaign
      const campaignPromises = Array.from(campaignMap.keys()).map(async (campaignId) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/campaigns/${campaignId}`)
          return {
            ...campaignMap.get(campaignId),
            campaign: response.data,
          }
        } catch (error) {
          console.error(`Error fetching campaign ${campaignId}:`, error)
          return campaignMap.get(campaignId)
        }
      })

      const campaigns = await Promise.all(campaignPromises)
      setSupportedCampaigns(campaigns.sort((a, b) => new Date(b.lastDonation) - new Date(a.lastDonation)))
    } catch (error) {
      console.error("Error fetching supported campaigns:", error)
    } finally {
      setLoading(false)
    }
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
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      health: "bg-red-100 text-red-800",
      education: "bg-blue-100 text-blue-800",
      disaster: "bg-yellow-100 text-yellow-800",
      others: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.others
  }

  const getStatusColor = (status) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (supportedCampaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No supported campaigns yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start supporting causes you care about by making your first donation.
        </p>
        <div className="mt-6">
          <Link
            to="/campaigns"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Campaigns
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Campaigns You've Supported</h3>
        <p className="text-sm text-gray-500">{supportedCampaigns.length} campaigns</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {supportedCampaigns.map((item) => {
          const { campaign, totalDonated, donationCount, lastDonation } = item
          const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)

          return (
            <div key={campaign._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {campaign.title}
                    </Link>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}
                    >
                      {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Your Contribution</p>
                      <p className="text-lg font-semibold text-green-600">{formatAmount(totalDonated)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Your Donations</p>
                      <p className="text-lg font-semibold text-blue-600">{donationCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Campaign Progress</p>
                      <p className="text-lg font-semibold text-gray-900">{progressPercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Donation</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(lastDonation)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Campaign Progress</span>
                      <span>
                        {formatAmount(campaign.raisedAmount)} of {formatAmount(campaign.goalAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Created by {campaign.createdBy.name}</p>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Campaign
                  </Link>
                  {campaign.status === "active" && (
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Donate Again
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SupportedCampaigns
