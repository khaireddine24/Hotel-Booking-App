import React, { useEffect, useState } from "react"
import BookingForm from './BookingForm'
import {
	Utensils,
  Wifi,
	Tv,
	Wine,
	CircleParking ,
	Car,
	Shirt
} from "lucide-react"
import { useParams } from "react-router-dom"
import { getRoomById } from "../utils/api"
import RoomCarousel from "../common/RoomCarousel"

const Checkout = () => {
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [roomInfo, setRoomInfo] = useState({
		photo: "",
		roomType: "",
		roomPrice: ""
	})
	const { roomId } = useParams()

	useEffect(() => {
		setTimeout(() => {
			getRoomById(roomId)
				.then((response) => {
					setRoomInfo(response)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error)
					setIsLoading(false)
				})
		}, 1000)
	}, [roomId])

	const RoomServiceIcon = ({ icon: Icon, text }) => (
		<div className="flex items-center space-x-2 text-gray-700">
			<Icon className="text-blue-500" />
			<span>{text}</span>
		</div>
	)

	return (
		<div className="bg-gray-50 min-h-screen py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-12 gap-8">
					{/* Room Information Section */}
					<div className="md:col-span-4 bg-white shadow-lg rounded-lg overflow-hidden">
						{isLoading ? (
							<div className="flex justify-center items-center h-full p-6">
								<p className="text-gray-600 animate-pulse">Loading room information...</p>
							</div>
						) : error ? (
							<div className="p-6 text-red-500">{error}</div>
						) : (
							<div className="p-6">
								<div className="mb-6">
									<img
										src={`data:image/png;base64,${roomInfo.photo}`}
										alt="Room photo"
										className="w-full h-48 object-cover rounded-lg"
									/>
								</div>
								
								<div className="space-y-4">
									<div className="border-b pb-2">
										<h2 className="text-xl font-semibold text-gray-800">Room Details</h2>
									</div>
									
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">Room Type:</span>
											<span className="text-gray-800">{roomInfo.roomType}</span>
										</div>
										
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">Price per night:</span>
											<span className="text-green-600 font-bold">{roomInfo.roomPrice} TND</span>
										</div>
									</div>
									
									<div className="border-t pt-4">
										<h3 className="text-lg font-semibold text-gray-800 mb-3">Room Services</h3>
										<div className="grid grid-cols-2 gap-2">
											<RoomServiceIcon icon={Wifi} text="Wifi" />
											<RoomServiceIcon icon={Tv} text="Netflix Premium" />
											<RoomServiceIcon icon={Utensils} text="Breakfast" />
											<RoomServiceIcon icon={Wine} text="Mini Bar" />
											<RoomServiceIcon icon={Car} text="Car Service" />
											<RoomServiceIcon icon={CircleParking } text="Parking" />
											<RoomServiceIcon icon={Shirt} text="Laundry" />
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Booking Form Section */}
					<div className="md:col-span-8 bg-white shadow-lg rounded-lg p-6">
						<BookingForm />
					</div>
				</div>

				{/* Room Carousel */}
				<div className="mt-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Other Rooms</h2>
					<RoomCarousel />
				</div>
			</div>
		</div>
	)
}

export default Checkout