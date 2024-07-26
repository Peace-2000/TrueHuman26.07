'use client'

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function Result() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  const parsedData = data ? JSON.parse(data) : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analysis Result</h1>
      {parsedData ? (
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(parsedData).map((key) => (
            <div key={key} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{key}</h2>
              <div className="mt-2">
                {Array.isArray(parsedData[key]) ? (
                  <ul className="list-disc list-inside">
                    {parsedData[key].map((item, index) => (
                      <li key={index} className="bg-gray-100 p-2 rounded mt-1">
                        {JSON.stringify(item, null, 2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(parsedData[key], null, 2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
