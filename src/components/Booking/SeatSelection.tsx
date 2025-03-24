import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SeatSelectionProps {
  price: number;
  availableSeats: number;
  onSeatSelectionChange: (seats: string[]) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ price, availableSeats, onSeatSelectionChange }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [desiredSeats, setDesiredSeats] = useState(1);
  const [showSeatMap, setShowSeatMap] = useState(true);

  // Generate seat layout (10 rows x 5 columns)
  const rows = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)); // A to J
  const columns = Array.from({ length: 5 }, (_, i) => i + 1); // 1 to 5

  // Simulate some occupied seats (in a real app, this would come from the backend)
  const occupiedSeats = ['A1', 'B3', 'C4', 'E2', 'F5', 'H1', 'I3'];

  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      }
      if (prev.length >= desiredSeats) {
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleDesiredSeatsChange = (value: number) => {
    const newValue = Math.min(Math.max(1, value), availableSeats);
    setDesiredSeats(newValue);
    if (selectedSeats.length > newValue) {
      setSelectedSeats(prev => prev.slice(0, newValue));
    }
  };

  // Update parent component when selection changes
  React.useEffect(() => {
    onSeatSelectionChange(selectedSeats);
  }, [selectedSeats, onSeatSelectionChange]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Your Seats</h3>
          <button
            onClick={() => setShowSeatMap(!showSeatMap)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showSeatMap ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
              Number of Seats
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <button
                onClick={() => handleDesiredSeatsChange(desiredSeats - 1)}
                disabled={desiredSeats <= 1}
                className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <input
                type="number"
                id="seats"
                min={1}
                max={availableSeats}
                value={desiredSeats}
                onChange={(e) => handleDesiredSeatsChange(parseInt(e.target.value) || 1)}
                className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
              />
              <button
                onClick={() => handleDesiredSeatsChange(desiredSeats + 1)}
                disabled={desiredSeats >= availableSeats}
                className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Total Amount</p>
            <p className="text-lg font-bold text-blue-600">
              {(price * selectedSeats.length).toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </div>

      {showSeatMap && (
        <div className="p-4">
          <div className="flex justify-center mb-6 space-x-8">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded mr-2"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-400 border border-gray-500 rounded mr-2"></div>
              <span className="text-sm">Occupied</span>
            </div>
          </div>

          <div className="relative">
            {/* Bus front */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-200 rounded-t-full flex items-center justify-center text-sm font-medium">
              Front
            </div>

            <div className="grid gap-2">
              {rows.map(row => (
                <div key={row} className="flex justify-center gap-2">
                  <div className="w-6 flex items-center justify-center text-sm font-medium">
                    {row}
                  </div>
                  {columns.map(col => {
                    const seat = `${row}${col}`;
                    const isSelected = selectedSeats.includes(seat);
                    const isOccupied = occupiedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isOccupied}
                        className={`
                          w-8 h-8 rounded flex items-center justify-center text-sm
                          ${isOccupied 
                            ? 'bg-gray-400 border-gray-500 cursor-not-allowed' 
                            : isSelected
                              ? 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
                              : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                          }
                          border transition-colors duration-200
                        `}
                      >
                        {col}
                      </button>
                    );
                  })}
                  <div className="w-6"></div>
                </div>
              ))}
            </div>

            {/* Aisle labels */}
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
              Aisle
            </div>
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
              Aisle
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Selected Seats:</h4>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span
                    key={seat}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No seats selected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;