"use client";

import { useParams } from "next/navigation";
import { useRoomSync } from "@/hooks/useRoomSync";
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Search,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  SkipBack,
  SkipForward,
  Volume2,
  Menu,
  Users,
  Trophy,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const MusicPlayerApp = () => {
  const { roomId } = useParams();
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "PERFECT STRANGERS",
      artist: "Jonas Blue",
      color: "bg-cyan-300",
      image: "cyan",
      votes: 0,
    },
    {
      id: 2,
      title: "I FEEL GOOD",
      artist: "Pink Sweat",
      color: "bg-lime-300",
      image: "lime",
      votes: 0,
    },
    {
      id: 3,
      title: "REMEMBER THIS",
      artist: "Jonas Brothers",
      color: "bg-orange-300",
      image: "orange",
      votes: 0,
    },
    {
      id: 4,
      title: "LOVE YOU BETTER",
      artist: "John De Sohn",
      color: "bg-purple-300",
      image: "purple",
      votes: 0,
    },
    {
      id: 5,
      title: "LOVE YOU BETTER",
      artist: "John De Sohn",
      color: "bg-purple-300",
      image: "purple",
      votes: 0,
    },
    {
      id: 6,
      title: "LOVE YOU BETTER",
      artist: "John De Sohn",
      color: "bg-purple-300",
      image: "purple",
      votes: 0,
    },
  ]);

  const [nowPlaying] = useState({
    id: 5,
    title: "Chill Vibes",
    artist: "Relaxing Music",
    album: "HIDING TONIGHT",
    albumArtist: "Alex Turner • 2011",
    songLists: "11 Song Lists",
    titleSong: "Glass In The Park",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "bg-gray-100",
    image: "white",
    hasWaveform: true,
    votes: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef(null);
  const fullPlayerRef = useRef(null);
  const mobileBarRef = useRef(null);
  const desktopBarRef = useRef(null);
  const songCardsRef = useRef([]);

  // Use the room sync hook
  const { syncPlay, syncPause, syncSeek, listeners } = useRoomSync(
    roomId,
    audioRef,
    setIsPlaying,
    setCurrentTime,
  );

  // Sort songs by votes (highest first)
  const rankedSongs = [...songs].sort((a, b) => b.votes - a.votes);

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      syncPause();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Play/Pause functionality
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // GSAP Animations
  useGSAP(() => {
    // Animate song cards on load
    gsap.from(songCardsRef.current, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    });

    // Animate mobile bar
    if (mobileBarRef.current) {
      gsap.from(mobileBarRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      });
    }

    // Animate desktop bar
    if (desktopBarRef.current) {
      gsap.from(desktopBarRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      });
    }
  }, []);

  // Full player animation
  useGSAP(() => {
    if (showFullPlayer && fullPlayerRef.current) {
      gsap.fromTo(
        fullPlayerRef.current,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      // Animate content inside
      gsap.from(".full-player-content > *", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        delay: 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [showFullPlayer]);

  const handleVote = (id, value) => {
    setSongs(
      songs.map((song) =>
        song.id === id
          ? { ...song, votes: Math.max(0, song.votes + value) }
          : song,
      ),
    );
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    syncSeek(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, pos)));
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      syncPause();
    } else {
      syncPlay();
    }
  };

  const closeFullPlayer = () => {
    gsap.to(fullPlayerRef.current, {
      y: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => setShowFullPlayer(false),
    });
  };

  const getRankBadge = (index) => {
    if (index === 0)
      return { icon: "🥇", color: "bg-yellow-400", text: "text-yellow-900" };
    if (index === 1)
      return { icon: "🥈", color: "bg-gray-300", text: "text-gray-900" };
    if (index === 2)
      return { icon: "🥉", color: "bg-orange-400", text: "text-orange-900" };
    return {
      icon: `#${index + 1}`,
      color: "bg-gray-200",
      text: "text-gray-700",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Audio Element */}
      <audio ref={audioRef} src={nowPlaying.audioUrl} preload="metadata" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-28">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button className="p-2 md:p-3 hover:bg-white rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                Room: {roomId}
              </h2>
              <div className="flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Users className="w-3.5 h-3.5 text-green-700" />
                <span className="text-sm font-semibold text-green-700">
                  {listeners}
                </span>
              </div>
            </div>
            <button className="p-2 md:p-3 hover:bg-white rounded-full transition-colors">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black mb-6 md:mb-8 leading-tight">
            FIND YOUR MUSIC
          </h1>

          {/* Songs List with Rankings */}
          <div className="space-y-3 md:space-y-4">
            {rankedSongs.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No songs in queue yet</p>
                <p className="text-gray-400 text-sm">
                  Add songs to get started!
                </p>
              </div>
            ) : rankedSongs.every((song) => song.votes === 0) ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">
                      Start Voting!
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Vote for your favorite songs using the thumbs up/down
                      buttons. The most popular songs will rise to the top!
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {rankedSongs.map((song, index) => {
              const badge = getRankBadge(index);
              return (
                <div
                  key={song.id}
                  ref={(el) => (songCardsRef.current[index] = el)}
                  className={`${song.color} rounded-2xl p-4 md:p-5 group hover:scale-[1.02] transition-transform cursor-pointer shadow-sm`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`${badge.color} ${badge.text} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 shadow-sm`}
                    >
                      {badge.icon}
                    </div>

                    {/* Album Art */}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
                      <div
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full ${
                          song.image === "cyan"
                            ? "bg-cyan-400"
                            : song.image === "lime"
                              ? "bg-lime-400"
                              : song.image === "orange"
                                ? "bg-orange-400"
                                : "bg-purple-400"
                        }`}
                      ></div>
                      <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base text-black leading-tight truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-700 truncate">
                        {song.artist}
                      </p>
                    </div>

                    {/* Vote Display and Buttons */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-white/90 px-3 py-1.5 rounded-full min-w-[3rem] text-center">
                        <p className="font-bold text-sm md:text-base text-gray-800">
                          {song.votes}
                        </p>
                        <p className="text-[10px] text-gray-600">votes</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleVote(song.id, 1)}
                          className="w-8 h-8 md:w-9 md:h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110"
                        >
                          <ThumbsUp className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleVote(song.id, -1)}
                          className="w-8 h-8 md:w-9 md:h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110"
                        >
                          <ThumbsDown className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Now Playing Bar - Mobile (Larger) */}
      <div
        ref={mobileBarRef}
        onClick={() => setShowFullPlayer(true)}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg cursor-pointer"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 rounded-lg"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-black truncate">
                {nowPlaying.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {nowPlaying.artist}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              className="p-2 bg-black rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white" fill="white" />
              )}
            </button>
          </div>

          {/* Waveform */}
          <div className="flex items-end gap-[2px] h-12 mb-2">
            {Array.from({ length: 60 }).map((_, i) => {
              const progress = duration > 0 ? currentTime / duration : 0;
              const isActive = i < progress * 60;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors duration-300 ${isActive ? "bg-purple-500" : "bg-gray-300"}`}
                  style={{ height: `${Math.random() * 70 + 30}%` }}
                ></div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {formatTime(currentTime)}
            </span>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSeek(e);
              }}
              className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-100"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Now Playing Bar - Desktop */}
      <div
        ref={desktopBarRef}
        className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Song Info */}
            <div
              onClick={() => setShowFullPlayer(true)}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 rounded-lg"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-black truncate">
                  {nowPlaying.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {nowPlaying.artist}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all">
                  <ThumbsUp className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all">
                  <ThumbsDown className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <SkipBack
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                  />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-black hover:bg-gray-800 rounded-full transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" fill="white" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <SkipForward
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                  />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-xs text-gray-600">
                  {formatTime(currentTime)}
                </span>
                <div
                  onClick={handleSeek}
                  className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                >
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-100"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Waveform */}
            <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-end gap-[2px] h-8">
                {Array.from({ length: 30 }).map((_, i) => {
                  const progress = duration > 0 ? currentTime / duration : 0;
                  const isActive = i < progress * 30;
                  return (
                    <div
                      key={i}
                      className={`w-[2px] rounded-sm transition-colors duration-300 ${isActive ? "bg-purple-500" : "bg-gray-300"}`}
                      style={{ height: `${Math.random() * 70 + 30}%` }}
                    ></div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <div
                  onClick={handleVolumeChange}
                  className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                >
                  <div
                    className="h-full bg-gray-600 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Player Modal */}
      {showFullPlayer && (
        <div
          ref={fullPlayerRef}
          className="fixed inset-0 bg-gradient-to-b from-purple-600 to-purple-400 z-50 flex flex-col"
        >
          <div className="full-player-content flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <button
                onClick={closeFullPlayer}
                className="p-2 hover:bg-purple-500 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <p className="text-white font-medium">Now Playing</p>
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span className="text-sm font-semibold text-white">
                    {listeners}
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-purple-500 rounded-full transition-colors">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
              <p className="text-white text-sm mb-2">Album</p>
              <h1 className="text-white text-4xl md:text-5xl font-black mb-2 text-center">
                {nowPlaying.album}
              </h1>
              <p className="text-white text-sm mb-1">
                {nowPlaying.albumArtist}
              </p>
              <p className="text-white text-xs mb-8">{nowPlaying.songLists}</p>

              {/* Album Art Card */}
              <div className="bg-purple-200 rounded-3xl p-6 md:p-8 w-full max-w-md mb-8">
                <p className="text-purple-600 text-xs mb-2 text-center">
                  Title Song
                </p>
                <h2 className="text-purple-900 text-2xl md:text-3xl font-bold mb-6 text-center">
                  {nowPlaying.titleSong}
                </h2>

                {/* Vinyl Record */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500 rounded-full"></div>
                  </div>
                  {isPlaying && (
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: "3s" }}
                    ></div>
                  )}
                </div>

                {/* Time and Waveform */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-purple-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    onClick={handleSeek}
                    className="h-12 md:h-16 flex items-end gap-[2px] cursor-pointer"
                  >
                    {Array.from({ length: 60 }).map((_, i) => {
                      const progress =
                        duration > 0 ? currentTime / duration : 0;
                      const isActive = i < progress * 60;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-colors duration-300 ${isActive ? "bg-purple-600" : "bg-purple-300"}`}
                          style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="pb-8 px-6">
              <div className="flex items-center justify-center gap-6 md:gap-8">
                <button className="p-3 hover:bg-purple-500 rounded-full transition-colors">
                  <SkipBack
                    className="w-7 h-7 md:w-8 md:h-8 text-white"
                    fill="white"
                  />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-5 md:p-6 bg-white hover:bg-gray-100 rounded-full transition-all"
                >
                  {isPlaying ? (
                    <Pause
                      className="w-8 h-8 md:w-10 md:h-10 text-purple-600"
                      fill="rgb(124, 58, 237)"
                    />
                  ) : (
                    <Play
                      className="w-8 h-8 md:w-10 md:h-10 text-purple-600"
                      fill="rgb(124, 58, 237)"
                    />
                  )}
                </button>
                <button className="p-3 hover:bg-purple-500 rounded-full transition-colors">
                  <SkipForward
                    className="w-7 h-7 md:w-8 md:h-8 text-white"
                    fill="white"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayerApp;
