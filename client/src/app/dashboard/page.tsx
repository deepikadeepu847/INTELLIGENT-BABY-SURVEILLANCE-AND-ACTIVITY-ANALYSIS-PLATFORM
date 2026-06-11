'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Camera, AlertCircle, Heart, ShieldAlert } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LiveMonitor from '@/components/dashboard/LiveMonitor';
import { useGuardianStore } from '@/store/useGuardianStore';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const { heartRate, setHeartRate, activeRoomId } = useGuardianStore();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'http://localhost:5000');
    
    if (activeRoomId) {
      socket.emit('join-room', activeRoomId);
    }

    socket.on('sensor-update', (data: any) => {
      if (data.sensor === 'HEALTH' && data.heartRate !== undefined) {
        setHeartRate(data.heartRate);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeRoomId, setHeartRate]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Camera className="text-safety-blue" />} 
          label="Active Cameras" 
          value="1" 
          trend="Webcam Online"
        />
        <StatCard 
          icon={<AlertCircle className="text-orange-500" />} 
          label="AI Detections" 
          value="4" 
          sub="Last 24 hours"
        />
        <StatCard 
          icon={<Heart className="text-red-500" />} 
          label="Heart Rate" 
          value={heartRate > 0 ? `${heartRate} BPM` : "Connecting..."} 
          sub={heartRate > 0 ? "Real-time Pulse" : "Waiting for sensor"}
        />
        <StatCard 
          icon={<TrendingUp className="text-safety-teal" />} 
          label="Signaling Status" 
          value="Stable" 
          sub="WebRTC Connected"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Real Live Monitor */}
          <LiveMonitor roomId={activeRoomId || 'demo-room-123'} />

          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6">Activity Timeline</h3>
            <div className="space-y-6">
              <TimelineItem time="2:45 PM" event="Sleep detected" type="success" />
              <TimelineItem time="1:30 PM" event="Movement detected" type="info" />
              <TimelineItem time="12:15 PM" event="Approved face: Mary (Nanny)" type="info" />
              <TimelineItem time="10:00 AM" event="Morning wake-up" type="info" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6">Family Online</h3>
            <div className="space-y-4">
              <UserRow name="Mom (Superuser)" status="Online" />
              <UserRow name="Dad" status="Watching" />
              <UserRow name="Grandma" status="Offline" />
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="text-orange-500 w-6 h-6" />
              Safety Protocols
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              AI sensitivity is currently set to <strong>High</strong>. Immediate escalation active.
            </p>
            <div className="space-y-2">
               <button className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold hover:shadow-lg transition-all">
                EMERGENCY STOP
              </button>
              <button className="w-full py-4 rounded-2xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-all">
                Manage Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, trend, sub }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass rounded-3xl p-6"
    >
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-4">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold mb-1">{value}</h4>
      {trend && <p className="text-xs text-green-500 font-bold">{trend}</p>}
      {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
    </motion.div>
  );
}

function TimelineItem({ time, event, type }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-16 shrink-0 text-sm font-bold text-slate-400">{time}</div>
      <div className="flex-1 pb-6 border-l-2 border-slate-100 dark:border-slate-800 pl-6 relative">
        <div className={cn(
          "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2",
          type === 'success' ? "bg-green-500 border-green-200" : "bg-blue-500 border-blue-200"
        )}></div>
        <p className="font-bold text-slate-700 dark:text-slate-300">{event}</p>
      </div>
    </div>
  );
}

function UserRow({ name, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800"></div>
        <span className="font-medium">{name}</span>
      </div>
      <span className={cn(
        "text-xs font-bold px-2 py-1 rounded-lg",
        status === 'Online' || status === 'Watching' ? "bg-green-500/10 text-green-600" : "bg-slate-500/10 text-slate-500"
      )}>{status}</span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
