import React from 'react';
import Image from 'next/image';
import { Thermometer, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL, API_KEY } from '../config';

const getTemperature = async (roomId: string): Promise<string> => {
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('API_KEY:', API_KEY);
  try {
    const headers = {
      'Accept': 'application/json',
      'X-API-KEY': API_KEY
    } as const;

    const response = await fetch(`${API_BASE_URL}api/temperature/${roomId}`, {
      headers: headers as HeadersInit
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch temperature');
    }

    const data = await response.json();
    return data.temperature.toFixed(1);
  } catch (error) {
    console.error('Error fetching temperature:', error);
    return '20.0'; // Return a default value in case of an error
  }
};

const fetchRoomAvailability = async (roomId: string) => {
  const headers = {
    'X-API-KEY': API_KEY
  } as const;

  const response = await fetch(`${API_BASE_URL}api/check_occupancy/${roomId}/`, {
    headers: headers as HeadersInit
  });
  const data = await response.json();
  console.log(data);
  return !data.occupied;
};

const listings = [
  {
    id: 1,
    roomName: "WZ320",
    title: "WZ 320",
    isAvailable: true,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 320",
    temperature: '20.0'
  },
  {
    id: 2,
    roomName: "WZ321",
    title: "WZ 321",
    isAvailable: false,
    imageUrl: "/images/WZ320.png",
    imageAlt: "Meeting Room WZ 321",
    temperature: '20.0'
  },
];

export default async function Home() {
  const updatedListings = await Promise.all(
    listings.map(async (listing) => {
      const [availability, temperature] = await Promise.all([
        fetchRoomAvailability(listing.roomName),
        getTemperature(listing.roomName)
      ]);
      console.log(`Room ${listing.roomName} availability:`, availability);
      console.log(`Room ${listing.roomName} temperature:`, temperature);
      return {
        ...listing,
        isAvailable: availability,
        temperature: temperature
      };
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {updatedListings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-w-16 aspect-h-9">
            <Image
              src={listing.imageUrl}
              alt={listing.imageAlt}
              layout="fill"
              objectFit="cover"
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