import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Wifi, Coffee, Shirt, Wine, Car, Snowflake } from 'lucide-react';
import RoomCarousel from '../common/RoomCarousel';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: "/chamb_img.jpg",
      title: "Panoramic View",
      description: "Enjoy breathtaking views of the lake from our hotel"
    },
    {
      url: "/vue_img.png",
      title: "Luxurious Rooms",
      description: "Modern and comfortable rooms for your stay"
    },
    {
      url: "/restau_img.jpg",
      title: "Gastronomic Restaurant",
      description: "Savor fine cuisine in our restaurant"
    }
  ];

  const services = [
    { icon: <Wifi className="w-8 h-8" />, title: "WiFi", description: "Stay connected with high-speed internet access." },
    { icon: <Coffee className="w-8 h-8" />, title: "Breakfast", description: "Start your day with a delicious breakfast buffet." },
    { icon: <Shirt className="w-8 h-8" />, title: "Laundry", description: "Keep your clothes clean and fresh with our laundry service." },
    { icon: <Wine className="w-8 h-8" />, title: "Mini-bar", description: "Enjoy a refreshing drink or snack from our in-room mini-bar." },
    { icon: <Car className="w-8 h-8" />, title: "Parking", description: "Park your car conveniently in our on-site parking lot." },
    { icon: <Snowflake className="w-8 h-8" />, title: "Air conditioning", description: "Stay cool and comfortable with our air conditioning system." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen max-w-screen bg-gray-50 ">
      {/* Hero Section with Carousel */}
      <div className="relative h-[600px] overflow-hidden mr-8">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="container mx-auto px-6 h-full flex items-center">
                <div className="text-white max-w-lg">
                  <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl">{slide.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Welcome Section */}
      <div className="text-center py-16 bg-white mr-36">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to HotelBooking</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-6">
          We offer the best services for all your needs. Experience luxury and comfort with our premium amenities and exceptional service.
        </p>
      </div>
      <RoomCarousel/>

      {/* Services Section */}
      <div className="py-16 bg-gray-50 mr-8 pr-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:bg-purple-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold ml-4 text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-purple-700 text-white py-16 mb-8 mr-2">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="mb-8 text-lg">Book your stay now and enjoy our premium services.</p>
          <Link to={'/all-rooms'}>
            <button className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;