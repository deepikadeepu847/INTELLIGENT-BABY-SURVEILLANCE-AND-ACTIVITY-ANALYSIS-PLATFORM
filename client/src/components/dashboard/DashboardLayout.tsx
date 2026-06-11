'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Video, 
  Clock, 
  Users, 
  Settings, 
  ShieldAlert,
  Menu,
  X,
  User,
  Activity,
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-soft-bg dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="glass-dark border-r border-slate-800/50 flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 premium-gradient rounded-xl flex shrink-0 items-center justify-center shadow-lg">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold whitespace-nowrap">Guardian AI</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 relative">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard />} label="Overview" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard"><NavItem icon={<Video />} label="Live Monitor" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/events"><NavItem icon={<Clock />} label="AI Events" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/contacts"><NavItem icon={<Users />} label="Emergency Protocol" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/reports"><NavItem icon={<ShieldAlert />} label="Safety Analytics" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/settings"><NavItem icon={<Settings />} label="Settings" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/admin"><NavItem icon={<Activity />} label="Admin Panel" isOpen={isSidebarOpen} /></Link>
          <Link href="/dashboard/help"><NavItem icon={<LifeBuoy />} label="Help Center" isOpen={isSidebarOpen} /></Link>
        </nav>


        <div className="p-4 border-t border-slate-800/20">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer",
            !isSidebarOpen && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-safety-blue font-bold">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">Pro Parent</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 flex items-center justify-between px-8 bg-transparent">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-slate-800/10 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Dashboard Overview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full glass flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">All Systems Nominal</span>
            </div>
            <button className="p-2 rounded-xl hover:bg-slate-800/10 dark:hover:bg-white/5 transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, isOpen }: { icon: React.ReactElement, label: string, active?: boolean, isOpen: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-3.5 rounded-2xl transition-all cursor-pointer group",
      active 
        ? "bg-safety-blue text-white shadow-lg shadow-safety-blue/20" 
        : "text-slate-400 hover:text-white hover:bg-white/5",
      !isOpen && "justify-center px-0"
    )}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 shrink-0" })}
      {isOpen && <span className="font-semibold whitespace-nowrap">{label}</span>}

      {!isOpen && (
        <div className="absolute left-24 px-3 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          {label}
        </div>
      )}
    </div>
  );
}
