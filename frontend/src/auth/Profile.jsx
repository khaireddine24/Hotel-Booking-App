import React, { useEffect, useState } from "react"
import { deleteUser, getAllBookings, getUser } from "../components/utils/api"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import { User } from "lucide-react"

const Profile = () => {
	const [user, setUser] = useState({
		id: "",
		email: "",
		firstName: "",
		lastName: "",
		roles: [{ id: "", name: "" }]
	})

	const [bookings, setBookings] = useState([])
	const [filteredBookings, setFilteredBookings] = useState([])
	const [message, setMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const userId = localStorage.getItem("userId")
	const token = localStorage.getItem("token")

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUser(userId, token)
				setUser(userData)
			} catch (error) {
				console.error(error)
			}
		}

		fetchUser()
	}, [userId, token])

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await getAllBookings()
				setBookings(response)
				const filtered = response.filter(
					booking => booking.guestEmail === user.email
				)
				setFilteredBookings(filtered)
				
				console.log("Tous les bookings:", response)
				console.log("Bookings filtrés:", filtered)
			} catch (error) {
				console.error("Error fetching bookings:", error.message)
				setErrorMessage(error.message)
			}
		}
		if (user.email) {
			fetchBookings()
		}
	}, [user])

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		)
		if (confirmed) {
			try {
				const response = await deleteUser(userId)
				setMessage(response.data)
				localStorage.removeItem("token")
				localStorage.removeItem("userId")
				localStorage.removeItem("userRole")
				navigate("/")
				window.location.reload()
			} catch (error) {
				setErrorMessage(error.data)
			}
		}
	}
	const formatDate = (dateInput) => {
		if (Array.isArray(dateInput) && dateInput.length === 3) {
			return moment([dateInput[0], dateInput[1] - 1, dateInput[2]]).format("MMM Do, YYYY")
		}
		return moment(dateInput).format("MMM Do, YYYY")
	}

	return (
		<div className="container mx-auto px-4 py-8 mt-10">
			{/* Error and Success Messages */}
			{(errorMessage || message) && (
				<div className={`
					mb-6 p-4 rounded-lg 
					${errorMessage ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
				`}>
					{errorMessage || message}
				</div>
			)}

			{user ? (
				<div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl mx-auto">
					{/* User Information Section */}
					<div className="p-6 bg-gray-50">
						<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
							User Information
						</h2>

						<div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-8">
							{/* Profile Image */}
							<div className="mb-6 md:mb-0">
								<User className='w-48 h-48'/>
							</div>

							{/* User Details */}
							<div className="flex-grow w-full">
								<div className="space-y-4">
									{[
										{ label: "ID", value: user.id },
										{ label: "First Name", value: user.firstName },
										{ label: "Last Name", value: user.lastName },
										{ label: "Email", value: user.email }
									].map(({ label, value }) => (
										<div key={label} className="border-b pb-2">
											<span className="font-semibold text-gray-600 mr-2">{label}:</span>
											<span className="text-gray-800">{value}</span>
										</div>
									))}

									<div>
										<span className="font-semibold text-gray-600 mr-2">Roles:</span>
										<ul className="list-disc list-inside text-gray-800">
											{user.roles.map((role) => (
												<li key={role.id}>{role.name}</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Booking History Section */}
					<div className="p-6">
						<h3 className="text-xl font-bold text-center text-gray-800 mb-6">
							Booking History
						</h3>

						{filteredBookings.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full bg-white shadow rounded-lg overflow-hidden">
									<thead className="bg-gray-100">
										<tr>
											{[
												"Booking ID", "Room ID", "Room Type", 
												"Check In Date", "Check Out Date", 
												"Confirmation Code", "Status"
											].map(header => (
												<th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													{header}
												</th>
											))}
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredBookings.map((booking, index) => (
											<tr key={index} className="hover:bg-gray-50 transition-colors">
												<td className="px-4 py-3">{booking.bookingId}</td>
												<td className="px-4 py-3">{booking.room.id}</td>
												<td className="px-4 py-3">{booking.room.roomType}</td>
												<td className="px-4 py-3">
													{formatDate(booking.checkInDate)}
												</td>
												<td className="px-4 py-3">
													{formatDate(booking.checkOutDate)}
												</td>
												<td className="px-4 py-3">{booking.bookingConfirmationCode}</td>
												<td className="px-4 py-3 text-green-600 font-semibold">On-going</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-center text-gray-500 italic">
								You have not made any bookings yet.
							</p>
						)}
					</div>

					{/* Delete Account Section */}
					<div className="p-6 bg-gray-50 flex justify-center">
						<button 
							onClick={handleDeleteAccount}
							className="
								bg-red-500 text-white 
								px-6 py-2 rounded-lg 
								hover:bg-red-600 
								transition-colors 
								focus:outline-none 
								focus:ring-2 
								focus:ring-red-500 
								focus:ring-opacity-50
							"
						>
							Delete Account
						</button>
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center h-64">
					<p className="text-gray-500 text-xl">Loading user data...</p>
				</div>
			)}
		</div>
	)
}

export default Profile