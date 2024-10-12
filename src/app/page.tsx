'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL, API_KEY } from '../config';

const fetchRoomAvailability = async (roomId: string) => {
  const headers = {
    'X-API-KEY': API_KEY
  } as const;

  const response = await fetch(`${API_BASE_URL}api/check_occupancy/${roomId}/`, {
    headers: headers as HeadersInit
  });
  const data = await response.json();
  console.log('fetched data:', data);
  return !data.occupied;
};

const listings = [
  {
    id: 1,
    roomName: "WZ320",
    title: "WZ 320",
    isAvailable: true,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 320"
  },
  {
    id: 2,
    roomName: "WZ321",
    title: "WZ 321",
    isAvailable: false,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 321"
  },
];

export default function Home() {
  const [updatedListings, setUpdatedListings] = useState(listings);

  const fetchUpdatedListings = async () => {
    const newListings = await Promise.all(
      listings.map(async (listing) => {
        const availability = await fetchRoomAvailability(listing.roomName);
        return {
          ...listing,
          isAvailable: availability
        };
      })
    );
    setUpdatedListings(newListings);
  };

  useEffect(() => {
    fetchUpdatedListings(); // Fetch immediately on mount

    const intervalId = setInterval(fetchUpdatedListings, 60000); // Refresh every 60 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {updatedListings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={listing.imageUrl}
              alt={listing.imageAlt}
              className="w-full h-full object-cover"
            />
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