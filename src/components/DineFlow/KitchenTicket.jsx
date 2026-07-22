import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export const KitchenTicket = ({ ticket, onMarkComplete }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Store native browser setInterval reference pointer inside a useRef block
  const intervalRef = useRef(null);

  useEffect(() => {
    // Calculate initial elapsed time in case order was sent before mounting
    const sentTime = new Date(ticket.sentAt).getTime();
    const calculateElapsed = () => {
      const now = Date.now();
      const seconds = Math.floor((now - sentTime) / 1000);
      setElapsedSeconds(seconds > 0 ? seconds : 0);
    };

    calculateElapsed(); // Run once immediately

    // Start interval
    intervalRef.current = window.setInterval(() => {
      calculateElapsed();
    }, 1000);

    // Wipe out the background timer cleanly when component is unmounted or ticket changes
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [ticket.sentAt]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color code based on time elapsed to flag alert priorities to chefs
  const getTimerStyles = (seconds) => {
    if (seconds < 120) {
      // Under 2 mins: Fresh
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        badge: 'bg-emerald-500/20 text-emerald-300',
      };
    } else if (seconds < 300) {
      // 2 - 5 mins: Caution
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        badge: 'bg-amber-500/20 text-amber-300 animate-pulse',
      };
    } else {
      // Over 5 mins: Urgent
      return {
        text: 'text-rose-400 font-extrabold',
        bg: 'bg-rose-500/10 border-rose-500/30 animate-pulse-slow shadow-lg shadow-rose-500/5',
        badge: 'bg-rose-500/20 text-rose-300 font-bold',
      };
    }
  };

  const timerStyles = getTimerStyles(elapsedSeconds);

  return (
    <div className={cn(
      "flex flex-col justify-between rounded-3xl border bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-white/20",
      timerStyles.bg
    )}>
      {/* Ticket Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
        <div>
          <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">TICKET FOR</span>
          <h3 className="text-2xl font-black text-white mt-0.5">Table {ticket.tableId}</h3>
        </div>
        
        {/* Stopwatch counter */}
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border border-white/5",
          timerStyles.badge
        )}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Ticket Items list */}
      <div className="p-5 flex-1 space-y-3.5 min-h-[160px]">
        {ticket.items.map((item, index) => (
          <div key={item.id} className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-primary font-mono">{item.quantity}x</span>
                <span className="text-sm font-bold text-white tracking-wide">{item.menuItem.name}</span>
              </div>
              
              {/* Variants Details */}
              {item.variant && item.variant !== 'Standard' && (
                <div className="text-xs text-white/50 pl-7 font-medium">
                  Style: <span className="text-white/80 font-semibold">{item.variant}</span>
                </div>
              )}

              {/* Modifier unique notes */}
              {item.modifier && (
                <div className="pl-7">
                  <span className="inline-block text-[11px] font-semibold text-rose-300 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 font-sans">
                    ⚠️ {item.modifier}
                  </span>
                </div>
              )}
            </div>
            
            {/* Visual separator index */}
            <span className="text-[10px] font-mono text-white/20 pt-1">#{index + 1}</span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-white/10 bg-white/[0.01]">
        <button
          onClick={() => onMarkComplete(ticket.id)}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400/50 text-white rounded-2xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
        >
          <CheckSquare className="w-4 h-4" /> MARK COMPLETE & SERVE
        </button>
      </div>
    </div>
  );
};
