import React from 'react';

const TruckOverview = ({ trucks, consignments }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🚛 Truck Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.length === 0 ? (
          <p className="text-gray-500 italic">No trucks found.</p>
        ) : (
          trucks.map(truck => {
            const assignedCount = consignments?.filter(c => c.truck?._id === truck._id).length || 0;

            return (
              <div
                key={truck._id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-blue-700 mb-2">{truck.number || 'Unnamed Truck'}</h3>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Location:</span> {truck.location || '—'}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      truck.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                      truck.status === 'in-transit' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {truck.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Assigned Volume:</span> {truck.assignedVolume}
                  </p>
                  <p>
                    <span className="font-medium">Assigned Consignments:</span> {assignedCount}
                  </p>
                  <p>
                    <span className="font-medium">Last Used:</span>{' '}
                    {truck.lastUsed ? new Date(truck.lastUsed).toLocaleString() : '—'}
                  </p>
                  <p>
                    <span className="font-medium">Driver:</span>{' '}
                    {truck.assignedDriver?.name || 'Unassigned'}
                  </p>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition">
                  View Route
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TruckOverview;
