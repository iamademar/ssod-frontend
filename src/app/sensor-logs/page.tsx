'use client';

import { useMediaQuery } from 'react-responsive';
import React, { useState, useEffect } from 'react';
import { Thermometer, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, API_KEY } from '../../config';

interface TableRow {
  id: number;
  roomName: string;
  sensorName: string;
  presenceDetected: boolean;
  temperature: string;
  timestamp: string;
}

const SensorLogsPage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);

  useEffect(() => {
    fetchSensorLogs();
    const intervalId = setInterval(fetchSensorLogs, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchSensorLogs = async () => {
    try {
      const response = await axios.get<{ logs: TableRow[] }>(`${API_BASE_URL}api/sensor/logs`, {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': API_KEY
        },
        withCredentials: true
      });
      
      const logs = response.data.logs;
      setTableData(logs.map((log: TableRow) => ({
        id: log.id,
        roomName: log.room_name,
        sensorName: log.sensor_name,
        presenceDetected: log.presence_detected,
        temperature: log.temperature,
        timestamp: new Date(log.timestamp).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true 
        })
      })));
    } catch (error) {
      console.error('Error fetching sensor logs:', error);
      setTableData([]);
    }
  };

  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (tableData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow w-full px-2 py-4 mx-auto sm:px-4 md:max-w-5xl md:pt-20 md:pb-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sensor Logs</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isDesktop ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sensorName}</td>
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
        ) : (
          <div className="divide-y divide-gray-200">
            {tableData.map((row) => (
              <div key={row.id} className="p-3 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 text-lg">ID: {row.id}</span>
                  <span className="text-sm text-gray-500">{row.timestamp}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-700">Room: {row.roomName}</div>
                  <div className="text-gray-700">Sensor: {row.sensorName}</div>
                  <div className="text-gray-700 flex items-center">
                    Presence: 
                    {row.presenceDetected ? (
                      <span className="flex items-center text-green-500 ml-1">
                        <CheckCircle className="mr-1" size={16} />
                        Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-rose-500 ml-1">
                        <XCircle className="mr-1" size={16} />
                        No
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 flex items-center">
                    Temperature: 
                    <span className="flex items-center ml-1">
                      <Thermometer className="mr-1 text-rose-500" size={16} />
                      {row.temperature}°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorLogsPage;