'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Phone, User, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Emergency Protocol</h1>
          <p className="text-slate-500">Manage who Guardian AI calls during an emergency.</p>
        </div>
        <button className="premium-gradient text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl">
          <Plus className="w-5 h-5" /> Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ContactCard 
          name="John Doe" 
          relation="Father" 
          phone="+1 (555) 000-1234" 
          priority={1}
        />
        <ContactCard 
          name="Jane Doe" 
          relation="Mother" 
          phone="+1 (555) 000-5678" 
          priority={2}
        />
        <ContactCard 
          name="Alice Smith" 
          relation="Nanny" 
          phone="+1 (555) 000-9999" 
          priority={3}
        />

        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-transparent">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
             <Plus className="text-slate-400 w-6 h-6" />
          </div>
          <p className="text-slate-500 font-bold">Add Additional Contact</p>
          <p className="text-xs text-slate-400 mt-2">Maximum of 5 contacts allowed on Pro plan.</p>
        </div>
      </div>

      <div className="mt-12 glass rounded-[2.5rem] p-10 bg-orange-500/5 border-orange-500/20">
        <div className="flex gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Escalation Logic</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Guardian AI will first send a push notification to all active devices. If no response is received within <strong>30 seconds</strong>, it will send an SMS to Priority 1. After <strong>another 60 seconds</strong>, an automated AI call will be placed to all contacts in order of priority.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ContactCard({ name, relation, phone, priority }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass rounded-[2rem] p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 flex gap-2">
        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Edit2 className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-2 rounded-xl hover:bg-red-50 transition-colors group">
          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-safety-blue/10 flex items-center justify-center text-safety-blue">
          <User className="w-7 h-7" />
        </div>
        <div>
           <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg">{name}</h4>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">P{priority}</span>
           </div>
          <p className="text-slate-500 text-sm font-medium">{relation}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Phone className="w-4 h-4 text-safety-teal" />
          <span className="font-bold">{phone}</span>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase rounded-lg">Verified</span>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase rounded-lg">SMS Ready</span>
        </div>
      </div>
    </motion.div>
  );
}
