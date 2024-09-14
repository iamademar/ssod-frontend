'use client';

import { useMediaQuery } from 'react-responsive';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_KEY } from '../../config';

interface ReadingLog {
  id: number;
  room_name: string;
  sensor_name: string;
  reading: string;
  datetime_recorded_by_sensor: string;
  created_at: string;
}

const ReadingLogsPage: React.FC = () => {
  const [tableData, setTableData] = useState<ReadingLog[]>([]);

  useEffect(() => {
    fetchReadingLogs();
    const intervalId = setInterval(fetchReadingLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchReadingLogs = async () => {
    try {
      // console.log('API_BASE_URL:', API_BASE_URL);
      // const url = new URL('api/reading/latest', API_BASE_URL).toString();
      // console.log('Fetching from:', url);
      const response = await axios.get<{ logs: ReadingLog[] }>('http://3.27.174.228/backend/api/reading/latest', {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': API_KEY
        },
        withCredentials: true
      });
      console.log(response.data);
      const logs = Array.isArray(response.data) ? response.data : [];
      setTableData(logs.map((log: ReadingLog) => ({
        ...log,
        datetime_recorded_by_sensor: new Date(log.datetime_recorded_by_sensor).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true,
          timeZone: 'Pacific/Auckland'
        })
      })));
    } catch (error) {
      console.error('Error fetching reading logs:', error);
      setTableData([]);
    }
  };

  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (tableData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow w-full px-2 py-4 mx-auto sm:px-4 md:max-w-5xl md:pt-20 md:pb-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reading Logs</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isDesktop ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reading</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time recorded by sensor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.room_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sensor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reading}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.datetime_recorded_by_sensor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tableData.map((row) => (
              <div key={row.id} className="p-3 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 text-lg">ID: {row.id}</span>
                  <span className="text-sm text-gray-500">{row.datetime_recorded_by_sensor}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-700">Room: {row.room_name}</div>
                  <div className="text-gray-700">Sensor: {row.sensor_name}</div>
                  <div className="text-gray-700">Reading: {row.reading}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingLogsPage;