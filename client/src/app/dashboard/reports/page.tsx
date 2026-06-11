'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingDown, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Safety Analytics</h1>
          <p className="text-slate-500">AI-generated weekly insights and hazard reports.</p>
        </div>
        <button className="premium-gradient text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl">
          <Download className="w-5 h-5" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-[2.5rem] p-10">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Calendar className="text-safety-blue" /> This Week at a Glance
            </h3>
            
            <div className="space-y-10">
              <ReportMetric 
                label="Unusual Movement" 
                value="12% decrease" 
                trend="down" 
                description="Your child showed more stable movement patterns compared to last week."
              />
              <ReportMetric 
                label="Night Rest" 
                value="8.4 hrs / avg" 
                trend="up" 
                description="Average sleep duration increased by 45 minutes this week."
              />
              <ReportMetric 
                label="Safety Score" 
                value="98 / 100" 
                trend="neutral" 
                description="Excellent. All perimeter checks and AI calibrations passed."
              />
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-10 bg-safety-teal/5 border-safety-teal/20">
             <div className="flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-safety-teal flex items-center justify-center shrink-0 shadow-lg">
                  <ShieldCheck className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "Based on movement heatmaps, consider adding a corner guard to the coffee table in the Living Room. We noticed 3 high-speed passes near that area today."
                  </p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6">Past Reports</h3>
            <div className="space-y-4">
              <ReportItem date="March 01 - March 07" size="2.4 MB" />
              <ReportItem date="Feb 22 - Feb 28" size="3.1 MB" />
              <ReportItem date="Feb 15 - Feb 21" size="2.8 MB" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReportMetric({ label, value, trend, description }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
        {trend === 'up' ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-safety-blue" />}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          <span className={cn("text-xs font-bold", trend === 'up' ? "text-green-500" : "text-safety-blue")}>{value}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

function ReportItem({ date, size }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white transition-all cursor-pointer border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-slate-400" />
        <div>
          <p className="text-sm font-bold">{date}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{size}</p>
        </div>
      </div>
      <Download className="w-4 h-4 text-safety-blue hover:scale-125 transition-transform" />
    </div>
  );
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(' '); }
