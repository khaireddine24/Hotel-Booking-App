// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import NewsCard from '../common/NewCard';

const Sidebar = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=hotels&language=en&sortBy=publishedAt&pageSize=20`,
          {
            headers: {
              'Authorization': '091f660a25a24e5a9234cfa36c1b0903'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error retrieving news');
        }

        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const demoNews = [
    {
      title: "New luxury hotel complex in Paris",
      description: "A new 5-star hotel complex opens its doors in the 8th arrondissement of Paris.",
      imageUrl: "/api/placeholder/400/200",
      url: "#"
    },
    {
      title: "Ecological innovations in the hotel industry",
      description: "Large hotel groups are committing to an ecological approach.",
      imageUrl: "/api/placeholder/400/200",
      url: "#"
    },
  ];

  const displayNews = news.length > 0 ? news : demoNews;

  return (
    <div className="fixed right-0 top-16 h-full w-72 bg-gray-50 shadow-xl transform transition-transform duration-300 ease-in-out z-30 md:block">
      <div className="p-4">
        <h2 className="text-xl text-center font-bold text-gray-800 mb-6">News</h2>
        
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {displayNews.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              description={item.description}
              imageUrl={item.urlToImage || item.imageUrl}
              url={item.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
