import React from 'react';
import { Users, ChefHat, Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TableGrid = ({
  tables,
  onSelectTable,
  selectedTableId,
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
      case 'Ordering':
        return {
          bg: 'bg-sky-500/10 hover:bg-sky-500/15',
          border: 'border-sky-500/30 hover:border-sky-500/60',
          text: 'text-sky-400',
          badgeBg: 'bg-sky-500/20 text-sky-300',
          icon: <AlertCircle className="w-4 h-4 text-sky-400" />,
        };
      case 'Cooking':
        return {
          bg: 'bg-amber-500/10 hover:bg-amber-500/15 animate-pulse-slow',
          border: 'border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300',
          icon: <ChefHat className="w-4 h-4 text-amber-400 animate-bounce-slow" />,
        };
      case 'Served':
        return {
          bg: 'bg-violet-500/10 hover:bg-violet-500/15',
          border: 'border-violet-500/30 hover:border-violet-500/60',
          text: 'text-violet-400',
          badgeBg: 'bg-violet-500/20 text-violet-300',
          icon: <CheckCircle2 className="w-4 h-4 text-violet-400" />,
        };
      case 'Billing':
        return {
          bg: 'bg-rose-500/10 hover:bg-rose-500/15',
          border: 'border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-500/5',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300',
          icon: <Receipt className="w-4 h-4 text-rose-400" />,
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => {
        const config = getStatusConfig(table.status);
        const isSelected = selectedTableId === table.id;
        const totalItems = table.currentOrder.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <button
            key={table.id}
            type="button"
            onClick={() => onSelectTable(table.id)}
            className={cn(
              "relative flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 backdrop-blur-md cursor-pointer outline-none",
              config.bg,
              config.border,
              isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-black border-primary scale-[1.02]" : "hover:scale-[1.01]"
            )}
          >
            {/* Status Header */}
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-mono tracking-widest text-white/50 uppercase">
                {table.capacity} Seats
              </span>
              <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", config.badgeBg)}>
                {config.icon}
                <span>{table.status}</span>
              </div>
            </div>

            {/* Table Detail */}
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">{table.name}</h3>
              {totalItems > 0 ? (
                <p className="text-xs font-mono text-white/60 mt-1">
                  {totalItems} active {totalItems === 1 ? 'item' : 'items'}
                </p>
              ) : (
                <p className="text-xs font-mono text-white/30 mt-1">Empty Order</p>
              )}
            </div>

            {/* Micro-Interaction Ambient glow */}
            {isSelected && (
              <div className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};
