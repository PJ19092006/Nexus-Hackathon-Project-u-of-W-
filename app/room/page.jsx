"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, Menu, Users, Radio, Plus, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

// ================= DEFAULT ROOMS =================
const DEFAULT_ROOMS = [
  {
    id: 1,
    name: "MORNING CHILL",
    type: "DAILY PLAYLIST",
    artists: "Shakira, Lasso, Sofia Reyes, Fuego",
    color: "bg-yellow-400",
    vinylColor: "from-yellow-500 to-orange-500",
    listeners: 12,
  },
  {
    id: 2,
    name: "HAPPY VIBES",
    type: "DAILY PLAYLIST",
    artists: "Pharrell, Katy Perry, Maroon 5",
    color: "bg-green-400",
    vinylColor: "from-green-500 to-teal-500",
    listeners: 8,
  },
  {
    id: 3,
    name: "YOU NEED TO CALM DOWN",
    type: "CHILL SESSION",
    artists: "Taylor Swift, Lana Del Rey",
    color: "bg-purple-200",
    vinylColor: "from-purple-400 to-pink-400",
    listeners: 15,
  },
];

const RoomSelectionPage = () => {
  const router = useRouter();

  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomVibe, setNewRoomVibe] = useState("CHILL SESSION");

  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const roomContainerRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const fabRef = useRef(null);

  // ================= LOAD FROM LOCAL STORAGE =================
  useEffect(() => {
    const savedRooms = localStorage.getItem("music-app-rooms");
    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  // ================= SAVE TO LOCAL STORAGE =================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("music-app-rooms", JSON.stringify(rooms));
    }
  }, [rooms, isLoaded]);

  // ================= FIXED GSAP (THIS IS THE ONLY CHANGE) =================
  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });

      gsap.from(searchRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });

      gsap.from(fabRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.8,
        ease: "back.out(1.7)",
        clearProps: "opacity,transform",
      });

      if (roomContainerRef.current) {
        gsap.from(roomContainerRef.current.children, {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.7,
          delay: 0.3,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });
      }
    },
    { scope: roomContainerRef },
  );

  // ================= MODAL ANIMATION =================
  useEffect(() => {
    if (isModalOpen) {
      gsap.to(modalRef.current, {
        opacity: 1,
        display: "flex",
        duration: 0.3,
      });

      gsap.fromTo(
        modalContentRef.current,
        { y: 50, scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4 },
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        display: "none",
        duration: 0.3,
      });
    }
  }, [isModalOpen]);

  // ================= HANDLERS =================
  const handleJoinRoom = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName) return;

    const colors = [
      { bg: "bg-blue-400", vinyl: "from-blue-500 to-indigo-500" },
      { bg: "bg-pink-400", vinyl: "from-pink-500 to-rose-500" },
      { bg: "bg-orange-400", vinyl: "from-orange-500 to-red-500" },
      { bg: "bg-cyan-400", vinyl: "from-cyan-500 to-blue-500" },
    ];

    const random = colors[Math.floor(Math.random() * colors.length)];

    setRooms((prev) => [
      {
        id: Date.now(),
        name: newRoomName.toUpperCase(),
        type: newRoomVibe,
        artists: "Various Artists",
        color: random.bg,
        vinylColor: random.vinyl,
        listeners: 1,
      },
      ...prev,
    ]);

    setNewRoomName("");
    setIsModalOpen(false);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.artists.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ================= JSX (UNCHANGED) =================
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* HEADER */}
      <div
        ref={headerRef}
        className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-30 bg-black/80 backdrop-blur-md"
      >
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-gray-900 rounded-full">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-4 md:px-8 pb-32 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">
          SEARCH ROOMS
        </h1>

        <div ref={searchRef} className="mb-10">
          <div className="relative max-w-2xl">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vibe or artist..."
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl border border-gray-800"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          </div>
        </div>

        <div
          ref={roomContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleJoinRoom(room.id)}
              className={`${room.color} rounded-[2rem] p-6 cursor-pointer`}
            >
              <div className="flex justify-between mb-4">
                <span className="font-bold">{room.type}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {room.listeners}
                </span>
              </div>

              <h2 className="text-2xl font-black">{room.name}</h2>
              <p className="text-sm">{room.artists}</p>

              <button className="mt-6 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <div ref={fabRef} className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white w-16 h-16 rounded-full flex items-center justify-center"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* MODAL */}
      <div
        ref={modalRef}
        className="fixed inset-0 hidden bg-black/80 items-center justify-center"
        onClick={(e) => e.target === modalRef.current && setIsModalOpen(false)}
      >
        <div
          ref={modalContentRef}
          className="bg-[#111] p-8 rounded-3xl w-full max-w-md relative"
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <form onSubmit={handleCreateRoom} className="space-y-6">
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="ROOM NAME"
              className="w-full bg-gray-900 text-white px-4 py-4 rounded-xl"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
            >
              LAUNCH ROOM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionPage;
