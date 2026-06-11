'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { aiDetector, DetectionResult } from '@/ai/detector';
import { Shield, AlertCircle, Maximize2, Mic, MicOff, Camera, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { io, Socket } from 'socket.io-client';
import { useGuardianStore } from '@/store/useGuardianStore';

export default function LiveMonitor({ roomId }: { roomId: string }) {
  const [useLaptop, setUseLaptop] = useState(true);
  const { localStream, remoteStream } = useWebRTC(roomId, useLaptop);
  const { fanActive, setFanActive, fanMode, setFanMode } = useGuardianStore();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const lastAlertTime = useRef<number>(0);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'http://localhost:5000');
    aiDetector.loadModel();
    
    // Listen for fan status updates from server/sync
    socketRef.current.on('fan-status', (data: any) => {
      setFanActive(data.state === 'on');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [setFanActive]);

  useEffect(() => {
    if (videoRef.current) {
      const activeStream = useLaptop ? localStream : remoteStream;
      if (activeStream) {
        videoRef.current.srcObject = activeStream;
      }
    }
  }, [localStream, remoteStream, useLaptop]);

  // AI Detection Loop
  useEffect(() => {
    let animationFrameId: number;
    let isActive = true;

    const runDetection = async () => {
      if (!isActive) return;

      if (videoRef.current && videoRef.current.readyState === 4) {
        const results = await aiDetector.detect(videoRef.current);
        if (!isActive) return; // double-check after the async operation
        setDetections(results);
        drawResults(results);
        handleThreats(results);
      }
      
      if (isActive) {
        animationFrameId = requestAnimationFrame(runDetection);
      }
    };

    const drawResults = (results: DetectionResult[]) => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Match canvas size to video display size
      canvasRef.current.width = videoRef.current.clientWidth;
      canvasRef.current.height = videoRef.current.clientHeight;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Scale from the actual video resolution to the display size
      const videoW = videoRef.current.videoWidth || videoRef.current.clientWidth;
      const videoH = videoRef.current.videoHeight || videoRef.current.clientHeight;
      const scaleX = canvasRef.current.width / videoW;
      const scaleY = canvasRef.current.height / videoH;

      results.forEach(det => {
        const [x, y, w, h] = det.bbox.map((v, i) => i % 2 === 0 ? v * scaleX : v * scaleY);
        const color = det.severity === 'critical' ? '#EF4444' : '#0EA5E9';
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, w, h);
        
        // Label
        ctx.fillStyle = color;
        const labelText = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
        ctx.font = 'bold 14px Inter';
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillRect(x, y - 25, textWidth + 10, 25);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(labelText, x + 5, y - 7);
      });
    };

    const handleThreats = (results: DetectionResult[]) => {
      // Logic for Fan (DC Motor) Control
      const childPresent = results.some(r => r.label === 'Child' || r.label === 'Baby');
      const currentFanActive = useGuardianStore.getState().fanActive;
      const currentFanMode = useGuardianStore.getState().fanMode;
      
      // Automatic Fan Control based on Child Presence
      if (currentFanMode === 'auto') {
        if (childPresent && !currentFanActive) {
          console.log('[FAN] Baby detected, turning fan on');
          socketRef.current?.emit('fan-control', { roomId, type: 'fan-control', state: 'on' });
          useGuardianStore.getState().setFanActive(true);
        } else if (!childPresent && currentFanActive) {
          console.log('[FAN] Baby absent, turning fan off');
          socketRef.current?.emit('fan-control', { roomId, type: 'fan-control', state: 'off' });
          useGuardianStore.getState().setFanActive(false);
        }
      }

      const criticalThreat = results.find(r => r.severity === 'critical');
      if (criticalThreat && Date.now() - lastAlertTime.current > 10000) {
        lastAlertTime.current = Date.now();
        socketRef.current?.emit('alert', {
          roomId,
          type: criticalThreat.label,
          severity: 'critical',
          confidence: criticalThreat.confidence,
          cameraLocation: useLaptop ? 'Laptop Webcam' : 'Nursery Cam',
          childName: 'Baby',
          timestamp: new Date().toISOString()
        });
      }
    };

    const loop = async () => {
      if (isActive) {
        await runDetection();
      }
    };
    
    loop();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [roomId, useLaptop]);

  return (
    <div className="relative group rounded-[2.5rem] overflow-hidden bg-slate-900 border-4 border-white/10 shadow-2xl aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        width="100%"
        height="100%"
        className="w-full h-full object-cover"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Camera Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setUseLaptop(true)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              useLaptop ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
            )}
          >
            <Camera className="w-3.5 h-3.5" /> Laptop
          </button>
          <button 
            onClick={() => setUseLaptop(false)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              !useLaptop ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
            )}
          >
            <Shield className="w-3.5 h-3.5" /> ESP32 Cam
          </button>
        </div>
        
        <div className="flex items-center gap-3 glass py-2 px-4 rounded-full">
          <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", useLaptop || remoteStream ? "bg-red-500" : "bg-slate-500")}></div>
          <span className="text-white text-sm font-bold tracking-tight">
            {useLaptop ? "WEB CAM ACTIVE" : remoteStream ? "REMOTE FEED" : "CONNECTING..."}
          </span>
        </div>
      </div>

      {/* Fan Status Indicator Overlay */}
      <div className="absolute top-6 right-6">
        <div className={cn(
          "flex items-center gap-3 glass py-2 px-4 rounded-full border-l-4 transition-all",
          fanActive ? "border-safety-teal bg-safety-teal/20" : "border-slate-500 opacity-60"
        )}>
          <Wind className={cn("w-4 h-4 text-white", fanActive && "animate-spin-slow")} />
          <span className="text-white text-sm font-bold">
            FAN: {fanActive ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "glass p-4 rounded-2xl transition-all",
              isMuted ? "text-red-400" : "text-white"
            )}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          {/* Manual Fan Control Button */}
          <button 
            onClick={() => {
              const newState = !fanActive ? 'on' : 'off';
              socketRef.current?.emit('fan-control', { roomId, type: 'fan-control', state: newState });
              setFanMode('manual'); // interacting manually switches it to manual
              setFanActive(!fanActive);
            }}
            className={cn(
              "glass p-4 rounded-2xl transition-all",
              fanActive ? "text-safety-teal" : "text-white"
            )}
          >
            <Wind className={cn("w-6 h-6", fanActive && "animate-spin")} />
          </button>
          
          {/* Auto/Manual Mode Toggle */}
          <button 
            onClick={() => {
               setFanMode(fanMode === 'auto' ? 'manual' : 'auto');
            }}
            className={cn(
              "glass px-4 py-2 rounded-2xl font-bold text-xs uppercase transition-all tracking-widest",
              fanMode === 'auto' ? "bg-safety-teal/20 text-safety-teal border-safety-teal" : "text-white/50"
            )}
          >
            {fanMode === 'auto' ? 'Auto' : 'Manual'}
          </button>

          <button className="glass p-4 rounded-2xl text-white">
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>
        <div className="glass px-4 py-2 rounded-xl border-l-4 border-safety-blue text-right">
          <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Processing</p>
          <p className="text-sm font-bold text-white">{useLaptop ? "Neural Engine" : "Cloud Bypass"}</p>
        </div>
      </div>
    </div>
  );
}

