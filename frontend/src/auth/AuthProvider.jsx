import React, { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
	user: null,
	handleLogin: (token) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const token = localStorage.getItem("token")
        console.log('token provider',token)
		if (token) {
			try {
				return jwtDecode(token)
			} catch (error) {
				localStorage.removeItem("token")
				localStorage.removeItem("userId")
				localStorage.removeItem("userRole")
				return null
			}
		}
		return null
	})

	const handleLogin = (token) => {
		try {
			const decodedUser = jwtDecode(token)
            console.log('loginn',decodedUser);
			localStorage.setItem("userId", decodedUser.sub)
			localStorage.setItem("userRole", decodedUser.roles)
			localStorage.setItem("token", token)
			setUser(decodedUser)
		} catch (error) {
			console.error("Invalid token", error)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userRole")
		localStorage.removeItem("token")
		setUser(null)
	}

	// Optional: Add token validation on app startup
	useEffect(() => {
		const token = localStorage.getItem("token")
		if (token) {
			try {
				const decodedUser = jwtDecode(token)
				// Check if token is expired
				if (decodedUser.exp * 1000 < Date.now()) {
					handleLogout()
				}
			} catch (error) {
				handleLogout()
			}
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}