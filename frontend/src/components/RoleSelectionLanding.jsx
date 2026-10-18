import React from 'react';
import { Users, Shield, ArrowRight, Sparkles, CheckCircle2, BarChart3, MapPin, Database, Building2 } from 'lucide-react';

export default function RoleSelectionLanding({ onSelectRole }) {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-4 py-8">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-brand-terracotta/10 text-brand-terracotta px-4 py-1.5 rounded-full text-xs font-bold border border-brand-terracotta/20 shadow-2xs">
          <Building2 className="w-4 h-4 text-brand-terracotta" />
          <span>Brihanmumbai Municipal Corporation (BMC / MCGM)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
          BMC-Track AI
        </h1>
        
        <p className="text-sm sm:text-base text-brand-stone max-w-2xl mx-auto font-medium">
          Unified civic grievance reporting, intelligent ward dispatch, and performance transparency system for the whole of Mumbai.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        
        {/* Card 1: Citizen / Public Portal */}
        <div 
          onClick={() => onSelectRole('citizen')}
          className="bg-white rounded-3xl p-8 border border-brand-border hover:border-brand-terracotta/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center border border-brand-terracotta/20 group-hover:scale-105 transition-transform">
              <Users className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-terracotta uppercase tracking-wider block">Citizen Grievance Redressal</span>
              <h2 className="text-2xl font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors mt-0.5">
                Mumbaikar Citizen Portal
              </h2>
            </div>

            <p className="text-xs text-brand-stone leading-relaxed">
              Report potholes, monsoon waterlogging, garbage overflows, water pipeline bursts, or sanitation issues in under 30 seconds.
            </p>

            <ul className="space-y-2 text-xs text-brand-dark font-medium pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Submit municipal complaints anonymously in &lt; 30 seconds</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Bambaiya, Hinglish, Marathi & English text auto-classified</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Automatic duplicate detection & priority escalation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Track ward resolution times transparently</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-brand-border/60">
            <span className="text-xs font-bold text-brand-dark group-hover:text-brand-terracotta">Open Citizen Portal</span>
            <div className="w-8 h-8 rounded-full bg-brand-linen group-hover:bg-brand-terracotta group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card 2: Admin Portal */}
        <div 
          onClick={() => onSelectRole('admin')}
          className="bg-white rounded-3xl p-8 border border-brand-border hover:border-brand-emerald/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-emerald-light text-brand-emerald flex items-center justify-center border border-brand-emerald/20 group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider block">Official BMC Control Room</span>
              <h2 className="text-2xl font-bold text-brand-dark group-hover:text-brand-emerald transition-colors mt-0.5">
                Ward Officer & Dispatch System
              </h2>
            </div>

            <p className="text-xs text-brand-stone leading-relaxed">
              Prioritized operational queue for BMC Ward Officers and Central Control Rooms. Assign municipal maintenance crews, dispatch field workers, and track GIS maps.
            </p>

            <ul className="space-y-2 text-xs text-brand-dark font-medium pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Weighted urban priority formula ($0 - 100$)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Assign municipal engineers & workers via detail cards</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Live GIS map across all 24 BMC administrative wards</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                <span>Real-time silent sync for incoming citizen reports</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-brand-border/60">
            <span className="text-xs font-bold text-brand-dark group-hover:text-brand-emerald">Enter Ward Control Room</span>
            <div className="w-8 h-8 rounded-full bg-brand-linen group-hover:bg-brand-emerald group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
