'use client';

import React, { useState, useEffect } from 'react';
import { Thermometer, CheckCircle, XCircle } from 'lucide-react';

interface TableRow {
  id: number;
  roomName: string;
  presenceDetected: boolean;
  temperature: string;
  timestamp: string;
}

const SensorLogsPage = () => {
  const getRandomTemperature = () => {
    return (Math.random() * (25 - 18) + 18).toFixed(1);
  };

  const getRandomTimestamp = () => {
    const now = new Date();
    const randomMinutes = Math.floor(Math.random() * 60);
    now.setMinutes(now.getMinutes() - randomMinutes);
    return now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    });
  };

  const [tableData, setTableData] = useState<TableRow[]>(() => []);

  useEffect(() => {
    setTableData(generateTableData());
  }, []);

  const generateTableData = (): TableRow[] => {
    return [
      { id: 1, roomName: "WZ301", presenceDetected: false, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 2, roomName: "LB102", presenceDetected: true, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 3, roomName: "CR205", presenceDetected: false, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 4, roomName: "OF401", presenceDetected: true, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 5, roomName: "MR103", presenceDetected: false, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 6, roomName: "KT501", presenceDetected: true, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 7, roomName: "BR202", presenceDetected: false, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
      { id: 8, roomName: "LG001", presenceDetected: true, temperature: getRandomTemperature(), timestamp: getRandomTimestamp() },
    ];
  };

  if (tableData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sensor Logs</h2>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presence Detected</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.roomName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.presenceDetected ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="mr-1" size={16} />
                        Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-rose-500">
                        <XCircle className="mr-1" size={16} />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <Thermometer className="mr-1 text-rose-500" size={16} />
                      {row.temperature}°C
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SensorLogsPage;