import { Link } from "react-router-dom"

const CampaignCard = ({ campaign }) => {
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

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg card">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}
          >
            {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
          </span>
          <span className="text-sm text-gray-500">by {campaign.createdBy.name}</span>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Raised</p>
            <p className="text-lg font-semibold text-gray-900">{formatAmount(campaign.raisedAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Goal</p>
            <p className="text-lg font-semibold text-gray-900">{formatAmount(campaign.goalAmount)}</p>
          </div>
        </div>

        <Link
          to={`/campaigns/${campaign._id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard
