import React, { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Link, useNavigate } from "react-router-dom"
import { LogOutIcon, User } from "lucide-react"

const Logout = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        auth.handleLogout()
        navigate("/", { state: { message: " You have been logged out!" } })
    }

    return (
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-2">
                <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                >
                    <div className="flex items-center">
                        <User className='h-8 w-8'/>
                        Profile
                    </div>
                </Link>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md flex items-center"
                >
                    <LogOutIcon className='h-8 w-8'/>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Logout