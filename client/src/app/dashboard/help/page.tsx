'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, BookOpen, Shield, LifeBuoy, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-safety-blue/10 blur-3xl rounded-full"></div>
        <h1 className="text-4xl font-bold mb-4 relative z-10">How can we help you?</h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8 relative z-10">Search our knowledge base or browse the safety guides below.</p>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-safety-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search guides, setup help, or AI calibration..."
              className="w-full glass py-6 pl-16 pr-8 rounded-[2rem] border-none focus:ring-4 focus:ring-safety-blue/20 transition-all outline-none font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <HelpCategory icon={<Shield className="text-blue-500" />} title="Getting Started" count={12} />
        <HelpCategory icon={<BookOpen className="text-green-500" />} title="AI Calibration" count={8} />
        <HelpCategory icon={<LifeBuoy className="text-orange-500" />} title="Emergency Setup" count={5} />
      </div>

      <div className="glass rounded-[3rem] p-12 mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Safety Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <GuideItem title="Optimizing AI Camera Placement for Fall Detection" />
          <GuideItem title="Configuring the Emergency Escalation Workflow" />
          <GuideItem title="Understanding Child Emotion Recognition Scores" />
          <GuideItem title="Securing Your Local-Only Monitoring Network" />
          <GuideItem title="ESP32-CAM Setup and Hardware Integration" />
          <GuideItem title="How to Add approved Family Members" />
        </div>
      </div>

      <div className="premium-gradient rounded-[3rem] p-12 text-center text-white">
         <h2 className="text-3xl font-bold mb-4">Still need assistance?</h2>
         <p className="opacity-80 mb-8 max-w-md mx-auto">Our specialized safety support team is available 24/7 for Enterprise and Pro users.</p>
         <button className="bg-white text-safety-blue px-10 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform">
            Contact Support
         </button>
      </div>
    </DashboardLayout>
  );
}

function HelpCategory({ icon, title, count }: any) {
  return (
    <div className="glass p-10 rounded-[2.5rem] hover:border-safety-blue/30 transition-all cursor-pointer group">
       <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { className: "w-8 h-8" })}
       </div>
       <h3 className="text-xl font-bold mb-2">{title}</h3>
       <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{count} Articles</p>
    </div>
  );
}

function GuideItem({ title }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 hover:pl-2 transition-all cursor-pointer group">
      <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-safety-blue transition-colors">{title}</span>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-safety-blue transition-colors" />
    </div>
  );
}
