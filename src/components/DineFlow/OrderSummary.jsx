import React, { useState } from 'react';
import { Trash2, Send, Plus, Minus, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OrderSummary = ({
  table,
  onRemoveItem,
  onUpdateQuantity,
  onSetModifier,
  onSendToKitchen,
  onProcessBilling,
}) => {
  const [editingModifierId, setEditingModifierId] = useState(null);
  const [tempModifierText, setTempModifierText] = useState('');

  const orderItems = table.currentOrder;
  const subtotal = orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const handleStartEditingModifier = (item) => {
    setEditingModifierId(item.id);
    setTempModifierText(item.modifier || '');
  };

  const handleSaveModifier = (itemId) => {
    onSetModifier(itemId, tempModifierText);
    setEditingModifierId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-primary font-semibold tracking-wider">ACTIVE ORDER</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{table.name}</h3>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono",
            table.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' :
            table.status === 'Ordering' ? 'bg-sky-500/20 text-sky-300' :
            table.status === 'Cooking' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
            table.status === 'Served' ? 'bg-violet-500/20 text-violet-300' :
            'bg-rose-500/20 text-rose-300'
          )}>
            {table.status}
          </div>
        </div>
      </div>

      {/* Items Scrollable List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[250px]">
        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-sm text-white/40 font-mono">No items in order yet.</p>
            <p className="text-xs text-white/20 mt-1">Select items from the menu grid.</p>
          </div>
        ) : (
          orderItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col justify-between gap-3 hover:border-white/10 transition-colors"
            >
              {/* Item Info Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-white leading-tight">{item.menuItem.name}</h4>
                    {item.variant && item.variant !== 'Standard' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-medium">
                        {item.variant}
                      </span>
                    )}
                  </div>
                  
                  {/* Modifier Note */}
                  {editingModifierId === item.id ? (
                    <div className="mt-2 flex gap-1.5">
                      <input
                        type="text"
                        value={tempModifierText}
                        onChange={(e) => setTempModifierText(e.target.value)}
                        className="flex-1 text-xs px-2 py-1 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                        placeholder="Allergies, temp, sauce..."
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveModifier(item.id)}
                        className="text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEditingModifier(item)}
                      className="text-left text-xs font-mono text-white/40 hover:text-primary mt-1 flex items-center gap-1 group"
                    >
                      {item.modifier ? (
                        <span className="text-amber-300/80">✏️ Note: "{item.modifier}"</span>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">+ Add modifier note</span>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-semibold text-white">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Trash */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-mono font-bold text-white w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
        {/* Math Summary */}
        <div className="flex justify-between items-center text-white/90">
          <span className="text-sm font-mono">Subtotal</span>
          <span className="text-xl font-mono font-bold">${subtotal.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onSendToKitchen}
            disabled={orderItems.length === 0 || table.status === 'Billing'}
            className={cn(
              "w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border cursor-pointer",
              orderItems.length === 0 || table.status === 'Billing'
                ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                : "bg-amber-500 border-amber-400 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/10 hover:scale-[1.01]"
            )}
          >
            <Send className="w-4 h-4" /> Send to Kitchen
          </button>

          {/* Quick billing redirect for served tables */}
          {table.status === 'Served' && (
            <button
              onClick={onProcessBilling}
              className="w-full py-3 bg-primary border border-primary/50 text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.01] cursor-pointer"
            >
              Ready for Checkout <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
