import React, { useMemo } from 'react';
import { useRestaurant } from './RestaurantContext';
import { KitchenTicket } from './KitchenTicket';
import { ChefHat, ClipboardList, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const KitchenDisplay = () => {
  const { state, dispatch } = useRestaurant();

  // Chronologically sort tickets so oldest order is cooked first
  const sortedTickets = useMemo(() => {
    return [...state.tickets].sort((a, b) => 
      new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  }, [state.tickets]);

  const handleMarkTicketComplete = (ticketId) => {
    dispatch({
      type: 'SERVE_ITEM',
      payload: { ticketId }
    });
    toast.success("Order marked complete and dispatched to server!");
  };

  // Chef Summary: Consolidated breakdown of all active items to cook in bulk
  const chefSummary = useMemo(() => {
    const summary = {};
    
    state.tickets.forEach(ticket => {
      ticket.items.forEach(item => {
        const name = item.menuItem.name;
        const variant = item.variant || 'Standard';
        
        if (!summary[name]) {
          summary[name] = { quantity: 0, variantSummary: {} };
        }
        
        summary[name].quantity += item.quantity;
        summary[name].variantSummary[variant] = (summary[name].variantSummary[variant] || 0) + item.quantity;
      });
    });

    return Object.entries(summary).map(([name, data]) => ({
      name,
      quantity: data.quantity,
      variants: Object.entries(data.variantSummary).map(([vName, qty]) => `${qty}x ${vName}`)
    }));
  }, [state.tickets]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ChefHat className="w-8 h-8 text-amber-500 animate-pulse-slow" /> Kitchen Display System (KDS)
          </h2>
          <p className="text-sm font-mono text-white/50 mt-1">
            Real-time culinary order pipeline. Tickets are colored and sorted dynamically based on elapsed time.
          </p>
        </div>
        <div className="flex gap-4 font-mono self-start md:self-center">
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <div className="text-xs text-amber-400 font-semibold">Cooking Tickets</div>
            <div className="text-xl font-bold text-white mt-0.5">{state.tickets.length}</div>
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <div className="text-xs text-primary font-semibold">Total Prep Items</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {chefSummary.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Chef Prep Grid (1 Col consolidated prep, 3 Cols tickets) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Prep Summary Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> Chef's Batch Summary
            </h3>
            
            {chefSummary.length === 0 ? (
              <div className="text-center py-8 text-white/30 font-mono text-xs">
                No active food items to prep.
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {chefSummary.map((item) => (
                  <div 
                    key={item.name} 
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 hover:border-white/15 transition-colors"
                  >
                    <span className="text-lg font-black text-primary font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {item.quantity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white tracking-wide truncate">{item.name}</h4>
                      {item.variants.length > 0 && (
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">
                          ({item.variants.join(', ')})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kitchen Stats Panel */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md font-mono text-xs text-white/50 space-y-3.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5 font-sans">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Operational Metrics
            </h4>
            <div className="flex justify-between">
              <span>Target ticket cycle time:</span>
              <span className="text-emerald-400 font-semibold">10 mins</span>
            </div>
            <div className="flex justify-between">
              <span>Average response time:</span>
              <span className="text-white font-semibold">3.4 mins</span>
            </div>
            <div className="flex justify-between">
              <span>Peak hourly tickets:</span>
              <span className="text-white font-semibold">36 tickets</span>
            </div>
          </div>
        </div>

        {/* Chronological Active Kitchen Tickets */}
        <div className="xl:col-span-3 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Active Culinary Tickets ({sortedTickets.length})
          </h3>
          
          {sortedTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-white/5 bg-white/5 text-center min-h-[300px] backdrop-blur-md">
              <div className="p-4 rounded-full bg-white/5 text-emerald-400 mb-4">
                <ChefHat className="w-10 h-10 animate-bounce-slow" />
              </div>
              <h4 className="text-lg font-bold text-white">Culinary Queue is Clear</h4>
              <p className="text-sm text-white/40 max-w-sm mt-1 mx-auto">
                No orders are currently waiting in the kitchen. When a waiter submits an order from their POS Terminal, it will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedTickets.map((ticket) => (
                <KitchenTicket
                  key={ticket.id}
                  ticket={ticket}
                  onMarkComplete={handleMarkTicketComplete}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
