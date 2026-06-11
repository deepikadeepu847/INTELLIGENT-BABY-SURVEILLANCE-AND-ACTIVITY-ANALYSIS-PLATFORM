'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, Info, Filter, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Event History</h1>
          <p className="text-slate-500">Review and manage recent detections and safety alerts.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-all font-bold">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-50 transition-all font-bold">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Time</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Event Type</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Severity</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <EventRow 
              time="4:12 PM" 
              type="Fall Detected" 
              location="Nursery" 
              severity="critical" 
              status="Escalated" 
              icon={<AlertCircle className="text-red-500" />}
            />
            <EventRow 
              time="3:45 PM" 
              type="Sleep detected" 
              location="Living Room" 
              severity="low" 
              status="Normal" 
              icon={<CheckCircle2 className="text-green-500" />}
            />
            <EventRow 
              time="2:15 PM" 
              type="Crying sound" 
              location="Nursery" 
              severity="medium" 
              status="Parent Alerted" 
              icon={<Info className="text-blue-500" />}
            />
             <EventRow 
              time="1:00 PM" 
              type="Unknown Face" 
              location="Entrance" 
              severity="high" 
              status="Recorded" 
              icon={<AlertCircle className="text-orange-500" />}
            />
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function EventRow({ time, type, location, severity, status, icon }: any) {
  const severityColors: any = {
    low: "bg-green-500/10 text-green-600",
    medium: "bg-blue-500/10 text-blue-600",
    high: "bg-orange-500/10 text-orange-600",
    critical: "bg-red-500/10 text-red-600",
  };

  return (
    <motion.tr 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{time}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-bold">{type}</span>
        </div>
      </td>
      <td className="px-8 py-6 text-slate-500 font-medium">{location}</td>
      <td className="px-8 py-6">
        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", severityColors[severity])}>
          {severity}
        </span>
      </td>
      <td className="px-8 py-6">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{status}</span>
      </td>
      <td className="px-8 py-6">
        <button className="opacity-0 group-hover:opacity-100 bg-safety-blue text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
          View Details
        </button>
      </td>
    </motion.tr>
  );
}
