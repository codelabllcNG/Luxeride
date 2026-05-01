import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type AvailabilityCalendarProps = {
  availableDates?: string[];
};
export function AvailabilityCalendar({
  availableDates = []
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const isAvailable = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Mock: Make most days available except some random ones
    return day % 7 !== 0 && day % 13 !== 0;
  };
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };
  const isPast = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.1
  }} className="bg-dark-charcoal rounded-xl p-6 border border-dark-lighter">
      <h2 className="text-xl font-semibold text-grey-pastel mb-6">
        Availability
      </h2>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPreviousMonth} className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-grey-pastel">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button onClick={goToNextMonth} className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => <div key={day} className="text-center text-xs font-medium text-grey-medium py-2">
            {day}
          </div>)}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {Array.from({
        length: firstDayOfMonth
      }).map((_, index) => <div key={`empty-${index}`} className="aspect-square" />)}

        {/* Days of the month */}
        {Array.from({
        length: daysInMonth
      }).map((_, index) => {
        const day = index + 1;
        const available = isAvailable(day);
        const today = isToday(day);
        const past = isPast(day);
        return <button key={day} disabled={past || !available} className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${today ? 'ring-2 ring-primary' : ''}
                ${past ? 'text-grey-muted cursor-not-allowed' : available ? 'bg-primary/20 text-primary hover:bg-primary hover:text-black cursor-pointer' : 'bg-dark-lighter text-grey-muted cursor-not-allowed'}
              `}>
              {day}
            </button>;
      })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-dark-lighter">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span className="text-xs text-grey-medium">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-dark-lighter" />
          <span className="text-xs text-grey-medium">Unavailable</span>
        </div>
      </div>
    </motion.div>;
}