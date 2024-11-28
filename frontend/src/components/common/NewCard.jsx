
import React from 'react';

const NewsCard = ({ title, description, imageUrl, url }) => (
  <div className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    {imageUrl && (
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
    )}
    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
    >
      Lire la suite →
    </a>
  </div>
);

export default NewsCard;
