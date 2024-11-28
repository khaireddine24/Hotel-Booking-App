import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:9090"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

export async function addRoom(photo, roomType, roomPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);

    const res = await api.post("/rooms/add/new-room", formData);
    if (res.status === 200) {
        return true;
    } else {
        return false;
    };
}

export async function getAllRooms() {
    try {
        const res = await api.get("/rooms/all-rooms");
        return res.data;
    } catch (err) {
        throw new Error("Error fetching rooms");
    }
}

export async function getRoomTypes() {
    try {
        const res = await api.get("/rooms/room/types");
        return res.data;
    } catch (err) {
        throw new Error("Error fetching room types");
    }
}

export async function deleteRoom(roomId) {
    try {
        const res = await api.delete(`/rooms/delete/room/${roomId}`);
        return res.data;
    } catch (err) {
        throw new Error("Error deleting room");
    }
}

export async function updateRoom(roomId, roomData) {
    try {
        const formData = new FormData();
        formData.append("roomType", roomData.roomType);
        formData.append("roomPrice", roomData.roomPrice);
        if (roomData.photo) {
            formData.append("photo", roomData.photo);
        }
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const res = await api.put(`/rooms/update/${roomId}`, formData, config);
        return res;
    } catch (err) {
        console.error("Error updating room:", err);
        throw new Error(err.response?.data?.message || "Error updating room");
    }
}

export async function getRoomById(roomId) {
    try {
        const res = await api.get(`/rooms/room/${roomId}`);
        return res.data;
    } catch (err) {
        throw new Error("Error fetching the Room");
    }
}

export async function bookRoom(roomId,booking){
    try{
        const res=await api.post(`/bookings/room/${roomId}/booking`,booking);
        return res.data;
    }catch(err){
        if(err.response && err.response.data){
            throw new Error(err.response.data);
        }
        else{
            throw new Error(`Error booking room : ${err}`);
        }
    }
}


export async function getAllBookings(){
    try{
        const res=await api.get("/bookings/all-bookings");
        return res.data;
    }catch(err){
        throw new Error(`Error fetching bookings : ${err}`);
    }
}

export async function getBookingByConfirmationCode(confirmationCode){
    try{
        const res=await api.get(`/bookings/confirmation/${confirmationCode}`);
        return res.data;
    }catch(err){
        if(err.response && err.response.data){
            throw new Error(err.response.data);
        }
        else{
            throw new Error(`Error fetching booking by confirmation code : ${err}`);
        }
    }
}

export async function cancelBooking(bookingId){
    try{
        const res=api.delete(`/bookings/booking/${bookingId}/delete`);
        return res.data;
    }catch(err){
        throw new Error(`Error cancelling booking : ${err.message}`);
    }
}

export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}