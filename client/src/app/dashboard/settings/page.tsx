'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Eye, Database, Lock, AlertTriangle, Save, Usb } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useState(85);
  const [ports, setPorts] = useState<any[]>([]);
  const [connectedPort, setConnectedPort] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchHardwareData();
  }, []);

  const fetchHardwareData = async () => {
    setIsRefreshing(true);
    try {
      const portsRes = await fetch('http://localhost:5000/api/hardware/ports');
      const portsData = await portsRes.json();
      setPorts(portsData.ports || []);

      const statusRes = await fetch('http://localhost:5000/api/hardware/status');
      const statusData = await statusRes.json();
      if (statusData.status === 'Connected') {
        setConnectedPort(statusData.path);
      }
    } catch (err) {
      console.error("Failed to fetch hardware data", err);
    }
    setIsRefreshing(false);
  };

  const handleConnectPort = async (path: string) => {
    try {
      await fetch('http://localhost:5000/api/hardware/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      setConnectedPort(path);
      alert(`Successfully requested connection to ${path}`);
    } catch (err) {
      console.error("Failed to connect", err);
      alert("Failed to connect to the selected port.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-slate-500">Fine-tune AI detection and privacy protocols.</p>
        </div>
        <button className="premium-gradient text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl hover:scale-105 transition-all">
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Calibration */}
          <div className="glass rounded-[2.5rem] p-10">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Shield className="text-safety-blue" /> AI Detection Calibration
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-lg">General Sensitivity</p>
                    <p className="text-sm text-slate-500">Higher values reduce false positives but may delay detection.</p>
                  </div>
                  <span className="text-2xl font-black text-safety-blue">{sensitivity}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="99" 
                  value={sensitivity} 
                  onChange={(e) => setSensitivity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-safety-blue"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-6">
                <ToggleSetting 
                  title="Fall Detection" 
                  description="Real-time posture and movement analysis." 
                  defaultChecked={true}
                />
                <ToggleSetting 
                  title="Audio Anomaly Detection" 
                  description="Detect crying, screaming, or glass breaking." 
                  defaultChecked={true}
                />
                <ToggleSetting 
                  title="Intrusion Alerts" 
                  description="Notify if an unrecognized person enters the frame." 
                  defaultChecked={false}
                />
                <ToggleSetting 
                  title="Emotion Analysis" 
                  description="Track emotional distress and agitation levels." 
                  defaultChecked={true}
                />
              </div>
            </div>
          </div>

          {/* Alert Methods */}
          <div className="glass rounded-[2.5rem] p-10">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Bell className="text-safety-lavender" /> Notification Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChannelCard icon={<Shield className="text-blue-500" />} title="Push Notifications" status="Instant" active={true} />
                <ChannelCard icon={<Bell className="text-green-500" />} title="SMS Gateway" status="Fast" active={true} />
                <ChannelCard icon={<Eye className="text-orange-500" />} title="AI Voice Call" status="Critical Only" active={true} />
                <ChannelCard icon={<Database className="text-purple-500" />} title="Email Logs" status="Daily" active={false} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Hardware Config */}
          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Usb className="w-5 h-5 text-safety-blue" />
              Hardware Integration
            </h3>
            <p className="text-sm text-slate-500 mb-4">Select the USB COM port for the Arduino Fan controller.</p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-safety-blue outline-none"
                  value={connectedPort}
                  onChange={(e) => setConnectedPort(e.target.value)}
                >
                  <option value="" disabled>Select a Port...</option>
                  {ports.map((port, idx) => (
                    <option key={idx} value={port.path}>
                      {port.path} - {port.manufacturer === 'Unknown' ? 'Serial Device' : port.manufacturer}
                    </option>
                  ))}
                  {ports.length === 0 && <option value="" disabled>No ports found</option>}
                </select>
                <button 
                  onClick={fetchHardwareData}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  {isRefreshing ? '...' : '🔄'}
                </button>
              </div>
              <button 
                onClick={() => handleConnectPort(connectedPort)}
                disabled={!connectedPort}
                className="w-full py-3 premium-gradient rounded-xl text-white font-bold opacity-90 hover:opacity-100 disabled:opacity-50"
              >
                Connect to Device
              </button>
            </div>
            {connectedPort && (
              <p className="mt-4 text-xs text-green-500 font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Active on {connectedPort}
              </p>
            )}
          </div>

          <div className="glass rounded-[2rem] p-8 bg-red-500/5 border-red-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
              <Lock className="w-5 h-5" /> Security Mode
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              When <strong>Local Only</strong> is active, all AI processing and video data stays on your local network. No data hits the cloud.
            </p>
            <button className="w-full py-3 rounded-xl border-2 border-red-500 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-all">
              Activate Local Mode
            </button>
          </div>

          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-4">Storage Policy</h3>
            <div className="space-y-4">
                <p className="text-sm text-slate-500">Current Plan: <strong>Pro</strong></p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-safety-teal w-[65%] h-full"></div>
                </div>
                <p className="text-xs text-slate-400">12.4 GB of 20 GB used</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleSetting({ title, description, defaultChecked }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex justify-between items-center group">
      <div>
        <p className="font-bold group-hover:text-safety-blue transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={cn(
            "w-12 h-6 rounded-full transition-all relative",
            checked ? "bg-safety-blue" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <div className={cn(
            "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
            checked ? "right-1" : "left-1"
        )}></div>
      </button>
    </div>
  );
}

function ChannelCard({ icon, title, status, active }: any) {
    return (
        <div className={cn(
            "p-6 rounded-3xl border-2 transition-all cursor-pointer",
            active ? "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900" : "border-dashed border-slate-200 dark:border-slate-800 opacity-50"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">{icon}</div>
                <div className={cn("w-2 h-2 rounded-full", active ? "bg-green-500" : "bg-slate-400")}></div>
            </div>
            <p className="font-bold text-sm">{title}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
        </div>
    );
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(' '); }
