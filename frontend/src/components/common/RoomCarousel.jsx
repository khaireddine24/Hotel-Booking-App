import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getAllRooms } from '../utils/api';
import { Link } from 'react-router-dom';

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const loadRooms = async () => {
      const fetchedRooms = await getAllRooms();
      if (fetchedRooms && fetchedRooms.length > 0) {
        setRooms(fetchedRooms);
      }
    };
    loadRooms();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= rooms.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? rooms.length - itemsPerPage : prevIndex - 1
    );
  };

  const visibleRooms = rooms.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="py-16 bg-white mr-64">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Rooms
        </h2>
        
        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            {visibleRooms.map((room) => (
              <div 
                key={room.id}
                className="flex-none w-1/3 bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={`data:image/png;base64,${room.photo}`}
                  alt={room.roomType}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {room.roomType}
                  </h3>
                  <p className="text-amber-600 font-medium mb-4">
                    {room.roomPrice} TND/night
                  </p>
                  <Link to={'/all-rooms'}>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCarousel;
