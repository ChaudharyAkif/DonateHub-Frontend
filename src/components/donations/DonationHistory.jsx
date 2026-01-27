"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const DonationHistory = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    campaignsSupported: 0,
  })

  useEffect(() => {
    fetchDonationHistory()
  }, [])

  const fetchDonationHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/donations/donor")
      setDonations(response.data)

      // Calculate stats
      const totalDonated = response.data.reduce((sum, donation) => sum + donation.amount, 0)
      const uniqueCampaigns = new Set(response.data.map((d) => d.campaignId._id)).size

      setStats({
        totalDonated,
        totalDonations: response.data.length,
        campaignsSupported: uniqueCampaigns,
      })
    } catch (error) {
      console.error("Error fetching donation history:", error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donated</p>
              <p className="text-2xl font-semibold text-gray-900">{formatAmount(stats.totalDonated)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10v16l-5-2-5 2V4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Campaigns Supported</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.campaignsSupported}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Donation History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {donations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start making a difference by supporting a campaign.</p>
              <div className="mt-6">
                <Link
                  to="/campaigns"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Campaigns
                </Link>
              </div>
            </div>
          ) : (
            donations.map((donation) => (
              <div key={donation._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/campaigns/${donation.campaignId._id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                      >
                        {donation.campaignId.title}
                      </Link>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(donation.campaignId.category)}`}
                      >
                        {donation.campaignId.category.charAt(0).toUpperCase() + donation.campaignId.category.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(donation.donatedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{formatAmount(donation.amount)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationHistory
