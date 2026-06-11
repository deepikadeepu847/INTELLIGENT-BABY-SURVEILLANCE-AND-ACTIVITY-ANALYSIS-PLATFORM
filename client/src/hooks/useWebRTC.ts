'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebRTC = (roomId: string, isProducer: boolean = false) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'http://localhost:5000');
    
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    const setupRTC = async () => {
      // Small delay to ensure browser readiness and handle strict mode quirks
      await new Promise(resolve => setTimeout(resolve, 100));
      
      pc.current = new RTCPeerConnection(configuration);

      if (isProducer) {
        try {
          console.log("[WebRTC] Requesting camera access...");
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280 }, 
              height: { ideal: 720 },
              facingMode: "user"
            }, 
            audio: true 
          });
          
          console.log("[WebRTC] Camera access granted.");
          streamRef.current = stream;
          setLocalStream(stream);
          stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));
        } catch (err: any) {
          console.error("[WebRTC] Error accessing media devices:", err);
          if (err.name === 'NotAllowedError') {
            alert("Camera permission denied. Please allow camera access in your browser settings.");
          } else if (err.name === 'NotFoundError') {
            alert("No camera found on this device.");
          }
        }
      }

      pc.current.ontrack = (event) => {
        console.log("[WebRTC] Received remote stream");
        setRemoteStream(event.streams[0]);
      };
      
      // ... (rest of the socket logic remains same)
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current?.emit('signal', {
            roomId,
            signal: { type: 'candidate', candidate: event.candidate }
          });
        }
      };

      socket.current?.emit('join-room', roomId);

      socket.current?.on('signal', async (data) => {
        const { signal } = data;
        if (!pc.current) return;
        
        try {
          if (signal.type === 'offer') {
            await pc.current.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            socket.current?.emit('signal', {
              roomId,
              signal: { type: 'answer', sdp: pc.current.localDescription }
            });
          } else if (signal.type === 'answer') {
            await pc.current.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          } else if (signal.type === 'candidate') {
            await pc.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
          }
        } catch (err) {
          console.error("[WebRTC] Signaling error:", err);
        }
      });

      if (isProducer && pc.current) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket.current?.emit('signal', {
          roomId,
          signal: { type: 'offer', sdp: pc.current.localDescription }
        });
      }
    };

    setupRTC();

    return () => {
      console.log("[WebRTC] Cleaning up...");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`[WebRTC] Stopped track: ${track.kind}`);
        });
      }
      socket.current?.disconnect();
      pc.current?.close();
      pc.current = null;
    };
  }, [roomId, isProducer]);

  return { localStream, remoteStream };
};
