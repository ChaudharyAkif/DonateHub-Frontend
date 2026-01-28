"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "AUTH_ERROR":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set up axios interceptor
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await axios.get("https://donate-hub-backend11.vercel.app/api/auth/me")
          console.log("[v0] Auth check response:", response.data)
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data.user,
              token,
            },
          })
        } catch (error) {
          console.error("[v0] Auth check failed:", error)
          localStorage.removeItem("token")
          dispatch({ type: "AUTH_ERROR", payload: "Token invalid" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post("https://donate-hub-backend11.vercel.app/api/auth/login", {
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Login failed",
      })
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const register = async (name, email, password, role) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post("https://donate-hub-backend11.vercel.app/api/auth/register", {
        name,
        email,
        password,
        role,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Registration failed",
      })
      return { success: false, error: error.response?.data?.message || "Registration failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
