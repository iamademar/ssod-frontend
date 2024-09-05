import React from 'react';
import { Thermometer, CheckCircle, XCircle } from 'lucide-react';

const getRandomTemperature = () => {
  return (Math.random() * (25 - 18) + 18).toFixed(1);
};

const listings = [
  {
    id: 1,
    title: "WZ 320",
    isAvailable: true,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 320",
    temperature: getRandomTemperature()
  },
  {
    id: 2,
    title: "WZ 321",
    isAvailable: false,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 321",
    temperature: getRandomTemperature()
  },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={listing.imageUrl}
              alt={listing.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md flex items-center">
              <Thermometer className="text-rose-500 mr-1" size={16} />
              <span className="text-sm font-medium text-gray-600">{listing.temperature}°C</span>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h2>
            <div className="flex items-center">
              {listing.isAvailable ? (
                <CheckCircle className="text-green-500 mr-2" size={20} />
              ) : (
                <XCircle className="text-rose-500 mr-2" size={20} />
              )}
              <p className="text-sm text-gray-600">
                {listing.isAvailable ? 'Available' : 'Unavailable'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}