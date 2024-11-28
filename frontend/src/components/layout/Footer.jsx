import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white rounded-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm mx-auto">
            &copy; {new Date().getFullYear()} HotelBooking. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
