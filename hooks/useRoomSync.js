import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useRoomSync = (roomId, audioRef, setIsPlaying, setCurrentTime) => {
  const socketRef = useRef(null);
  const [listeners, setListeners] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current.emit("join-room", roomId);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("room-state", (state) => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = state.currentTime;
      setCurrentTime(state.currentTime);

      if (state.isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }

      setIsPlaying(state.isPlaying);
    });

    socketRef.current.on("play", ({ currentTime }) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = currentTime;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    });

    socketRef.current.on("pause", ({ currentTime }) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = currentTime;
      audioRef.current.pause();
      setIsPlaying(false);
    });

    socketRef.current.on("seek", ({ currentTime }) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = currentTime;
      setCurrentTime(currentTime);
    });

    socketRef.current.on("listener-count", setListeners);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const syncPlay = () => {
    socketRef.current?.emit("play", {
      roomId,
      currentTime: audioRef.current.currentTime,
    });
  };

  const syncPause = () => {
    socketRef.current?.emit("pause", {
      roomId,
      currentTime: audioRef.current.currentTime,
    });
  };

  const syncSeek = (time) => {
    socketRef.current?.emit("seek", {
      roomId,
      currentTime: time,
    });
  };

  return {
    syncPlay,
    syncPause,
    syncSeek,
    listeners,
    isConnected,
  };
};
