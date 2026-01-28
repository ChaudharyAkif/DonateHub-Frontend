"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import CampaignCard from "../components/campaigns/CampaignCard"
import CampaignFilters from "../components/campaigns/CampaignFilters"

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
  })

  useEffect(() => {
    fetchCampaigns()
  }, [filters])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.category !== "all") params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)

      const response = await axios.get(`https://donate-hub-backend11.vercel.app/api/campaigns?${params}`)
      setCampaigns(response.data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Active Campaigns</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover meaningful causes and make a difference today
          </p>
        </div>

        <CampaignFilters filters={filters} onFilterChange={handleFilterChange} />

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Campaigns
