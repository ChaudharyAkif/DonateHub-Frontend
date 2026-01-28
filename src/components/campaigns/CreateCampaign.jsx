"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const CreateCampaign = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "health",
    goalAmount: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "disaster", label: "Disaster Relief" },
    { value: "others", label: "Others" },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("https://donate-hub-backend11.vercel.app/api/campaigns", {
        ...formData,
        goalAmount: Number.parseFloat(formData.goalAmount),
      })

      navigate(`/campaigns/${response.data._id}`)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="mt-1 text-sm text-gray-600">Share your cause and start raising funds for your organization</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a compelling title for your campaign"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Fundraising Goal (USD) *
              </label>
              <input
                type="number"
                id="goalAmount"
                name="goalAmount"
                required
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your fundraising goal"
                value={formData.goalAmount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your campaign, its goals, and how the funds will be used..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
