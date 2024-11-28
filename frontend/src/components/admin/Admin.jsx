import React from "react"
import { Link } from "react-router-dom"
import { Building2, CalendarCheck, ChevronRight } from "lucide-react"

const Admin = () => {
    const adminCards = [
        {
            title: "Manage Rooms",
            description: "View, add, edit, and delete hotel rooms",
            icon: <Building2 className="w-12 h-12 text-purple-600" />,
            link: "/manage-rooms"
        },
        {
            title: "Manage Bookings",
            description: "Track and manage all hotel bookings",
            icon: <CalendarCheck className="w-12 h-12 text-green-600" />,
            link: "/bookings"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mt-32">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-purple-600 text-white p-6">
                        <h2 className="text-3xl font-extrabold flex items-center gap-4">
                            <span>Admin Dashboard</span>
                        </h2>
                        <p className="mt-2 text-purple-100">
                            Manage your hotel's rooms and bookings with ease
                        </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {adminCards.map((card, index) => (
                            <Link 
                                key={index} 
                                to={card.link} 
                                className="block hover:bg-gray-50 transition-colors duration-300 rounded-lg"
                            >
                                <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-6">
                                        {card.icon}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {card.title}
                                            </h3>
                                            <p className="text-gray-500">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-8 h-8 text-gray-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin