'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Camera, Bell, Zap, Heart, Lock } from 'lucide-react';
import LiveMonitor from '@/components/dashboard/LiveMonitor';

export default function LandingPage() {
  const [showLive, setShowLive] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-soft-bg dark:bg-slate-950">
      {/* ... (background orbs) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-safety-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-safety-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-safety-teal rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Navigation */}
      {/* ... */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass rounded-2xl px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Guardian AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-safety-blue transition-colors">Features</a>
            <a href="#monitoring" className="hover:text-safety-blue transition-colors">Monitoring</a>
            <a href="#security" className="hover:text-safety-blue transition-colors">Security</a>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="premium-gradient text-white px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-safety-blue/10 text-safety-blue text-sm font-semibold mb-6">
              Next-Gen Child Safety
            </span>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              AI that protects what <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-safety-blue to-safety-lavender">matters most.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              Transform your child's safety with real-time AI threat detection, 
              low-latency monitoring, and automated emergency escalation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="premium-gradient text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-transform"
              >
                Start Monitoring Now
              </button>
              <button 
                onClick={() => setShowLive(!showLive)}
                className="glass px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/90 transition-all"
              >
                {showLive ? 'Close Live Demo' : 'View Live Demo'}
              </button>
            </div>
          </motion.div>

          {/* Interactive Preview */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="glass rounded-[2rem] p-4 overflow-hidden border-4 border-white/40 shadow-2xl">
              {showLive ? (
                <div className="aspect-video relative">
                  <LiveMonitor roomId="demo-room-123" />
                </div>
              ) : (
                <div className="relative aspect-video bg-slate-900 rounded-[1.5rem] overflow-hidden group cursor-pointer" onClick={() => setShowLive(true)}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  {/* Mock UI Overlays */}
                  <div className="absolute top-6 left-6 flex items-center gap-3 glass py-2 px-4 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE • Living Room</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="glass p-6 rounded-full">
                      <Zap className="text-white w-12 h-12 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-white/60 text-xs font-medium">AI CONFIDENCE</p>
                      <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full premium-gradient"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="glass h-12 w-12 flex items-center justify-center rounded-xl">
                        <Heart className="text-red-400 w-6 h-6" />
                      </div>
                      <div className="glass h-12 w-12 flex items-center justify-center rounded-xl">
                        <Bell className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-safety-blue" />}
              title="Real-time Detection"
              description="Proprietary AI detects falls, crying, and unauthorized entry within milliseconds."
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6 text-safety-teal" />}
              title="Smart Escalation"
              description="Multi-channel alerts via WhatsApp, SMS, and automated AI voice calls."
            />
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-safety-lavender" />}
              title="Privacy First"
              description="End-to-end encryption ensures only you can access your monitoring data."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-soft-bg dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
    >
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
