"use client";

import React, { useState, useRef } from "react";
import { Search, ChevronLeft, Menu, Users, Radio } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const RoomSelectionPage = () => {
  const [rooms] = useState([
    {
      id: 1,
      name: "MORNING CHILL",
      type: "DAILY PLAYLIST",
      artists: "Shakira, Lasso, Sofia Reyes, Fuego and more",
      color: "bg-yellow-400",
      vinylColor: "from-yellow-500 to-orange-500",
      listeners: 12,
    },
    {
      id: 2,
      name: "HAPPY VIBES",
      type: "DAILY PLAYLIST",
      artists: "Shakira, Lasso, Sofia Reyes, Fuego and more",
      color: "bg-green-400",
      vinylColor: "from-green-500 to-teal-500",
      listeners: 8,
    },
    {
      id: 3,
      name: "YOU NEED TO CALM DOWN",
      type: "CHILL SESSION",
      artists: "Taylor Swift",
      color: "bg-purple-200",
      vinylColor: "from-purple-400 to-pink-400",
      listeners: 15,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const roomCardsRef = useRef([]);
  const headerRef = useRef(null);
  const searchRef = useRef(null);

  // GSAP Animations
  useGSAP(() => {
    // Animate header
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    // Animate search bar
    gsap.from(searchRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    });

    // Animate room cards
    gsap.from(roomCardsRef.current, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.7,
      delay: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleJoinRoom = (roomId) => {
    // This would navigate to the music player with the room ID
    console.log(`Joining room ${roomId}`);
    // In Next.js you'd use: router.push(`/room/${roomId}`)
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.artists.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between p-4 md:p-6"
      >
        <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 pb-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8 leading-tight">
          SEARCH ROOMS
        </h1>

        {/* Search Bar */}
        <div ref={searchRef} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-500 px-4 py-3 md:py-4 pr-12 rounded-xl border border-gray-800 focus:outline-none focus:border-gray-700 transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Room Cards */}
        <div className="space-y-4 max-w-md">
          {filteredRooms.map((room, index) => (
            <div
              key={room.id}
              ref={(el) => (roomCardsRef.current[index] = el)}
              className={`${room.color} rounded-3xl p-5 md:p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer`}
              onClick={() => handleJoinRoom(room.id)}
            >
              {/* Room Type Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs md:text-sm font-bold text-black/70">
                  {room.type}
                </span>
                <div className="flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5 text-black/70" />
                  <span className="text-xs font-semibold text-black/70">
                    {room.listeners}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Vinyl Record */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative">
                  <div className="w-full h-full bg-black rounded-full relative overflow-hidden">
                    <div
                      className={`absolute inset-2 bg-gradient-to-br ${room.vinylColor} rounded-full`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-black rounded-full border-2 border-gray-800"></div>
                    </div>
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-black text-black mb-1 leading-tight">
                    {room.name}
                  </h2>
                  <p className="text-xs md:text-sm text-black/70 line-clamp-2">
                    {room.artists}
                  </p>
                </div>

                {/* Join Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRoom(room.id);
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black hover:bg-gray-900 rounded-full flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-110"
                >
                  <Radio className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
              </div>

              {/* Waveform for specific room - Removed */}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms found</p>
            <p className="text-gray-600 text-sm mt-2">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;
