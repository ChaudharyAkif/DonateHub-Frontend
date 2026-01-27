"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Campaigns from "./pages/Campaigns"
import CampaignDetail  from "./pages/CampaignDetail"
import CreateCampaign from "./components/campaigns/CreateCampaign"
import NGODashboard from "./pages/NGODashboard"
import DonorDashboard from "./pages/DonorDashboard"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./App.css"

// Dashboard router component to handle role-based dashboard routing
const DashboardRouter = () => {
  const { user } = useAuth()

  if (user.role === "ngo") {
    return <NGODashboard />
  } else {
    return <DonorDashboard />
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route
              path="/create-campaign"
              element={
                <ProtectedRoute requiredRole="ngo">
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
