const LoadingSpinner = ({ size = "md", color = "green" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      case "xl":
        return "w-12 h-12"
      default:
        return "w-6 h-6"
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "border-blue-600"
      case "red":
        return "border-red-600"
      case "yellow":
        return "border-yellow-600"
      default:
        return "border-green-600"
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-transparent ${getSizeClasses()} ${getColorClasses()}`}
      ></div>
    </div>
  )
}

export default LoadingSpinner
