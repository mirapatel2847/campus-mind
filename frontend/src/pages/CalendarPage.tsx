import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <CalendarIcon className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
      </div>

      <div className="p-8 rounded-xl bg-[#090E1A] border border-slate-800 text-center text-slate-400 text-sm">
        Campus deadline calendar and exam schedules will be visualized here.
      </div>
    </div>
  );
};

export default CalendarPage;
