import React from 'react';
import type { Room } from '../../types/room.types';

interface RoomCardProps {
  room: Room;
  onSelect: (roomId: string, price: number, roomNumbers: number[]) => void;
  selectedRoomId?: string;
  selectedNumbers?: number[];
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onSelect,
  selectedRoomId,
  selectedNumbers = [],
}) => {
  const [selectedNum, setSelectedNum] = React.useState<number | null>(
    selectedRoomId === room._id && selectedNumbers.length > 0 ? selectedNumbers[0] : null
  );

  const handleRoomSelect = (number: number) => {
    setSelectedNum(number);
    onSelect(room._id, room.price, [number]);
  };

  return (
    <div className={`border rounded-lg p-5 flex flex-col md:flex-row justify-between gap-6 transition-all bg-white ${
      selectedRoomId === room._id ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-gray-900 text-lg">{room.title}</h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
            Max {room.maxPeople} {room.maxPeople === 1 ? 'person' : 'people'}
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{room.desc}</p>
        
        {/* Room selection options */}
        <div className="mt-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Select Room Number
          </span>
          <div className="flex flex-wrap gap-2">
            {room.roomNumbers.map((rNum) => {
              const isSelected = selectedRoomId === room._id && selectedNum === rNum.number;
              return (
                <button
                  key={rNum._id}
                  type="button"
                  onClick={() => handleRoomSelect(rNum.number)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  Room {rNum.number}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing / Booking column */}
      <div className="flex flex-row md:flex-col justify-between items-center md:items-end md:justify-center gap-4 md:border-l md:border-gray-100 md:pl-6 min-w-[150px]">
        <div className="flex flex-col md:items-end">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Per Night</span>
          <span className="text-2xl font-extrabold text-primary">${room.price}</span>
        </div>

        {selectedRoomId === room._id && selectedNum ? (
          <span className="text-xs text-success font-bold flex items-center gap-1 bg-success-light px-2.5 py-1 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Selected R{selectedNum}
          </span>
        ) : (
          <span className="text-xs text-gray-400 font-semibold italic">Choose a room number</span>
        )}
      </div>
    </div>
  );
};
