"use client"

const CampaignFilters = ({ filters, onFilterChange }) => {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "disaster", label: "Disaster Relief" },
    { value: "others", label: "Others" },
  ]

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    })
  }

  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filters,
      category: e.target.value,
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Campaigns
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by title or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.category}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default CampaignFilters
