import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import GetAllRooms from "./components/Room/GetAllRooms";
import Sidebar from "./components/layout/SideBar";
import ListingRooms from "./components/Room/ListingRooms";
import Checkout from "./components/Booking/Checkout";
import BookingSuccess from "./components/Booking/BookingSuccess";
import Bookings from "./components/Booking/Bookings";
import Admin from "./components/admin/Admin";
import FindBooking from "./components/Booking/FindBooking";
import Profile from "./auth/Profile";
import { AuthProvider } from "./auth/AuthProvider";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
                <Route path="/manage-rooms" element={<RequireAuth><GetAllRooms /></RequireAuth>} />
                <Route path="/book-room/:roomId" element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="/all-rooms" element={<ListingRooms />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/find-booking" element={<RequireAuth><FindBooking /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              </Routes>
            </main>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
