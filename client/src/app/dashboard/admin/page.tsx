'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Users, AlertCircle, TrendingUp, Cpu, Network, Database } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
        <p className="text-slate-500">Enterprise-level monitoring of your AI safety network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <AdminStat icon={<Activity className="text-blue-500" />} label="Avg Latency" value="42ms" trend="Optimal" />
        <AdminStat icon={<Server className="text-green-500" />} label="Cloud Uptime" value="100%" trend="Stable" />
        <AdminStat icon={<Cpu className="text-purple-500" />} label="Edge Load" value="12%" trend="Low" />
        <AdminStat icon={<Network className="text-orange-500" />} label="Bandwidth" value="4.2 Mbps" trend="Nominal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="glass rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold mb-8">AI Inference Quality</h3>
          <div className="space-y-8">
             <QualityMetric label="Object Recall" value="99.4%" color="bg-blue-500" />
             <QualityMetric label="Voice Accuracy" value="97.2%" color="bg-emerald-500" />
             <QualityMetric label="False Positive Rate" value="0.02%" color="bg-indigo-500" />
          </div>
          <div className="mt-12 p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
            <div className="flex justify-between items-center relative z-10">
               <p className="text-sm font-bold">Signaling Server Status</p>
               <span className="text-xs font-black uppercase tracking-widest text-green-500">Connected</span>
            </div>
            {/* Simple sparkline mock */}
            <div className="flex items-end gap-1 h-12 mt-4">
                {[4,6,3,8,5,9,10,4,6,8,12,7,9,14,10,8,6,5,8,10].map((h, i) => (
                    <div key={i} className="flex-1 bg-safety-blue/20 rounded-t-sm" style={{height: `${h*4}px`}}></div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[2.5rem] p-10">
             <h3 className="text-xl font-bold mb-6">Audit Trail</h3>
             <div className="space-y-6">
                <AuditItem user="System" action="AI Calibration Updated" time="2 mins ago" />
                <AuditItem user="John Doe" action="Live Feed Accessed" time="15 mins ago" />
                <AuditItem user="Jane Doe" action="Emergency Contact Added" time="1 hour ago" />
                <AuditItem user="ESP32-CAM" action="Firmware Handshake" time="3 hours ago" />
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function AdminStat({ icon, label, value, trend }: any) {
  return (
    <div className="glass p-6 rounded-3xl group hover:border-safety-blue/50 transition-all">
       <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform">{icon}</div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black">{value}</p>
          </div>
       </div>
       <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">{trend}</p>
    </div>
  );
}

function QualityMetric({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-sm font-black">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{width: value}}></div>
      </div>
    </div>
  );
}

function AuditItem({ user, action, time }: any) {
    return (
        <div className="flex justify-between items-center group cursor-default">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {user[0]}
                </div>
                <div>
                   <p className="text-sm font-bold group-hover:text-safety-blue transition-colors">{action}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black">{user}</p>
                </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{time}</span>
        </div>
    );
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(' '); }
