"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import DonationStats from "../components/donations/DonationStats"
import CampaignManagement from "../components/campaigns/CampaignManagement"

const NGODashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
  })
  const [campaigns, setCampaigns] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("[v0] No authentication token found")
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      const userId = user?._id || user?.id
      console.log("[v0] Fetching NGO dashboard data for user:", userId)
      console.log("[v0] User object:", user)
      console.log("[v0] Token exists:", !!token)

      if (!user || !userId) {
        console.error("[v0] User not properly loaded, waiting...")
        setTimeout(() => {
          const retryUserId = user?._id || user?.id
          if (user && retryUserId) {
            fetchDashboardData()
          }
        }, 1000)
        return
      }

      console.log("[v0] Making API calls with user ID:", userId)

      try {
        const donationResponse = await axios.get("https://donate-hub-backend11.vercel.app/api/donations/ngo/stats", { headers })
        console.log("[v0] Donation response:", donationResponse.data)

        const campaignResponse = await axios.get(`https://donate-hub-backend11.vercel.app/api/campaigns/ngo/${userId}`, { headers })
        console.log("[v0] Campaign response:", campaignResponse.data)

        const donationData = donationResponse.data
        const campaignData = campaignResponse.data

        const newStats = {
          totalRaised: donationData.totalRaised || 0,
          totalDonations: donationData.totalDonations || 0,
          totalCampaigns: Array.isArray(campaignData) ? campaignData.length : 0,
          activeCampaigns: Array.isArray(campaignData) ? campaignData.filter((c) => c.status === "active").length : 0,
        }

        console.log("[v0] Setting stats:", newStats)
        setStats(newStats)

        setCampaigns(Array.isArray(campaignData) ? campaignData : [])
        setRecentDonations(donationData.donations?.slice(0, 5) || [])
      } catch (apiError) {
        console.error("[v0] API call failed:", apiError)

        try {
          console.log("[v0] Trying individual API calls...")

          const donationResponse = await axios.get("https://donate-hub-backend11.vercel.app/api/donations/ngo/stats", { headers })
          console.log("[v0] Individual donation response:", donationResponse.data)

          const donationData = donationResponse.data
          setStats((prev) => ({
            ...prev,
            totalRaised: donationData.totalRaised || 0,
            totalDonations: donationData.totalDonations || 0,
          }))
          setRecentDonations(donationData.donations?.slice(0, 5) || [])
        } catch (donationError) {
          console.error("[v0] Donation API failed:", donationError)
        }

        try {
          const campaignResponse = await axios.get(`https://donate-hub-backend11.vercel.app/api/campaigns/ngo/${userId}`, { headers })
          console.log("[v0] Individual campaign response:", campaignResponse.data)

          const campaignData = campaignResponse.data
          setCampaigns(Array.isArray(campaignData) ? campaignData : [])
          setStats((prev) => ({
            ...prev,
            totalCampaigns: Array.isArray(campaignData) ? campaignData.length : 0,
            activeCampaigns: Array.isArray(campaignData) ? campaignData.filter((c) => c.status === "active").length : 0,
          }))
        } catch (campaignError) {
          console.error("[v0] Campaign API failed:", campaignError)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
      if (error.response) {
        console.error("[v0] Response error:", error.response.data)
        console.error("[v0] Status:", error.response.status)
      }

      console.log("[v0] Keeping previous stats due to error")
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "campaigns", name: "My Campaigns" },
    { id: "donations", name: "Donations" },
    { id: "analytics", name: "Analytics" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user.name}! Manage your campaigns and track your impact.</p>
          {user.verificationStatus === "pending" && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-sm text-yellow-800">
                  Your NGO verification is pending. Some features may be limited until verification is complete.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalRaised)}</p>
                <p className="text-xs text-green-600 mt-1">Funds collected</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                <p className="text-xs text-blue-600 mt-1">Individual contributions</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                <p className="text-xs text-purple-600 mt-1">All campaigns</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
                <p className="text-xs text-orange-600 mt-1">Currently running</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/create-campaign" className="btn-primary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Campaign
            </Link>
            <Link to="/campaigns" className="btn-secondary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View All Campaigns
            </Link>
            <Link to="/ngo/profile" className="btn-secondary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Update Profile
            </Link>
          </div>
        </div>

        {recentDonations.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
              <Link
                to="#"
                onClick={() => setActiveTab("donations")}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentDonations.map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{donation.donorId?.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-600">{donation.campaignId?.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatAmount(donation.amount)}</p>
                    <p className="text-xs text-gray-500">{new Date(donation.donatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Overview</h3>
                  {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {campaigns.slice(0, 4).map((campaign) => {
                        const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
                        return (
                          <div key={campaign._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-900 line-clamp-1">{campaign.title}</h4>
                              <span className={`status-${campaign.status}`}>{campaign.status}</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{progressPercentage.toFixed(1)}% of goal</span>
                                <span>
                                  {formatAmount(campaign.raisedAmount)} / {formatAmount(campaign.goalAmount)}
                                </span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                              </div>
                            </div>
                            <Link
                              to={`/campaigns/${campaign._id}`}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              View Details →
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                      <p className="text-gray-600 mb-4">
                        Create your first campaign to start raising funds for your cause.
                      </p>
                      <Link to="/create-campaign" className="btn-primary">
                        Create Your First Campaign
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div>
                <CampaignManagement campaigns={campaigns} onCampaignUpdate={fetchDashboardData} />
              </div>
            )}

            {activeTab === "donations" && (
              <div>
                <DonationStats />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Analytics & Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Donation Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Donation</span>
                        <span className="text-sm font-medium">
                          {stats.totalDonations > 0 ? formatAmount(stats.totalRaised / stats.totalDonations) : "$0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Largest Donation</span>
                        <span className="text-sm font-medium">
                          {recentDonations.length > 0
                            ? formatAmount(Math.max(...recentDonations.map((d) => d.amount)))
                            : "$0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Campaign Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-medium">
                          {campaigns.length > 0
                            ? Math.round(
                                (campaigns.filter((c) => c.raisedAmount >= c.goalAmount).length / campaigns.length) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Campaign Goal</span>
                        <span className="text-sm font-medium">
                          {campaigns.length > 0
                            ? formatAmount(campaigns.reduce((sum, c) => sum + c.goalAmount, 0) / campaigns.length)
                            : "$0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NGODashboard
