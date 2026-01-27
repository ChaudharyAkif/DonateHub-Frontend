"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import DonationHistory from "../components/donations/DonationHistory"
import SupportedCampaigns from "../components/campaigns/SupportedCampaigns"

const DonorDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    campaignsSupported: 0,
  })
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch donation history
      const donationResponse = await axios.get("http://localhost:5000/api/donations/donor", { headers })
      const donations = donationResponse.data

      // Calculate stats
      const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)
      const uniqueCampaigns = new Set(donations.map((d) => d.campaignId._id)).size

      setStats({
        totalDonated,
        totalDonations: donations.length,
        campaignsSupported: uniqueCampaigns,
      })

      // Fetch recent campaigns
      const campaignResponse = await axios.get("http://localhost:5000/api/campaigns?limit=6")
      setRecentCampaigns(campaignResponse.data.slice(0, 6))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "history", name: "Donation History" },
    { id: "supported", name: "Supported Campaigns" },
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
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Welcome back, {user.name}! Track your impact and discover new causes to support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalDonated)}</p>
                <p className="text-xs text-green-600 mt-1">Making a difference</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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
                <p className="text-xs text-blue-600 mt-1">Acts of kindness</p>
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
                <p className="text-sm font-medium text-gray-600">Campaigns Supported</p>
                <p className="text-2xl font-bold text-gray-900">{stats.campaignsSupported}</p>
                <p className="text-xs text-purple-600 mt-1">Lives touched</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {stats.totalDonated > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8 text-white fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h3 className="text-xl font-bold mb-1">Thank you for your generosity!</h3>
                <p className="text-green-100">
                  Your {formatAmount(stats.totalDonated)} in donations across {stats.campaignsSupported} campaigns is
                  creating real, lasting change in communities around the world.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/campaigns" className="btn-primary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Discover Campaigns
            </Link>
            <Link to="/campaigns?category=health" className="btn-secondary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Health Campaigns
            </Link>
            <Link to="/campaigns?category=education" className="btn-secondary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Education
            </Link>
            <Link to="/campaigns?category=environment" className="btn-secondary text-center">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                />
              </svg>
              Environment
            </Link>
          </div>
        </div>

        {recentCampaigns.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Campaigns You Might Like</h2>
              <Link to="/campaigns" className="text-green-600 hover:text-green-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCampaigns.map((campaign) => {
                const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
                return (
                  <div key={campaign._id} className="card p-4 hover:shadow-lg transition-all">
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full mb-2">
                        {campaign.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{progressPercentage.toFixed(1)}% funded</span>
                        <span>{formatAmount(campaign.raisedAmount)} raised</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>
                    <Link to={`/campaigns/${campaign._id}`} className="btn-primary w-full text-center">
                      Support This Cause
                    </Link>
                  </div>
                )
              })}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact Overview</h3>
                  <DonationHistory />
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <DonationHistory />
              </div>
            )}

            {activeTab === "supported" && (
              <div>
                <SupportedCampaigns />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
