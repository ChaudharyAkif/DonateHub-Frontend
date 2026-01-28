"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const CampaignManagement = ({ campaigns, onCampaignUpdate }) => {
  const [loading, setLoading] = useState(false)

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

  const handleStatusToggle = async (campaignId, currentStatus) => {
    setLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active"
      await axios.put(`https://donate-hub-backend11.vercel.app/api/campaigns/${campaignId}`, {
        status: newStatus,
      })
      onCampaignUpdate()
    } catch (error) {
      console.error("Error updating campaign status:", error)
      alert("Failed to update campaign status")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCampaign = async (campaignId, campaignTitle) => {
    if (window.confirm(`Are you sure you want to delete "${campaignTitle}"? This action cannot be undone.`)) {
      setLoading(true)
      try {
        await axios.delete(`https://donate-hub-backend11.vercel.app/api/campaigns/${campaignId}`)
        onCampaignUpdate()
      } catch (error) {
        console.error("Error deleting campaign:", error)
        alert("Failed to delete campaign")
      } finally {
        setLoading(false)
      }
    }
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first campaign.</p>
        <div className="mt-6">
          <Link
            to="/create-campaign"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Campaign
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Your Campaigns</h3>
        <Link
          to="/create-campaign"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => {
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>
                      <p className="text-lg font-semibold text-green-600">{formatAmount(campaign.raisedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Goal</p>
                      <p className="text-lg font-semibold text-gray-900">{formatAmount(campaign.goalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <p className="text-lg font-semibold text-blue-600">{progressPercentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Created on {formatDate(campaign.createdAt)}</p>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleStatusToggle(campaign._id, campaign.status)}
                    disabled={loading}
                    className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white ${
                      campaign.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    } disabled:opacity-50`}
                  >
                    {campaign.status === "active" ? "Close" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign._id, campaign.title)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CampaignManagement
