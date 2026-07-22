import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from '../../components/DineFlow/RestaurantContext';
import { WaiterPOS } from '../../components/DineFlow/WaiterPOS';
import { KitchenDisplay } from '../../components/DineFlow/KitchenDisplay';
import { BillingTerminal } from '../../components/DineFlow/BillingTerminal';
import { 
  UtensilsCrossed, 
  ChefHat, 
  Receipt, 
  Sparkles, 
  Home, 
  TrendingUp, 
  Database,
  Grid
} from 'lucide-react';
import { toast } from 'sonner';

const DineFlowDashboard = () => {
  const [activeScreen, setActiveScreen] = useState('pos');
  const { state, dispatch } = useRestaurant();

  // Set page title for SEO best practices
  useEffect(() => {
    document.title = "DineFlow | Enterprise Full-Service POS & Kitchen Pipeline";
    
    // Add meta description dynamically
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'High-performance React POS & Kitchen Operations management system. Enterprise-grade architecture with real-time sync.');
  }, []);

  const handleSeedShowcase = () => {
    // Quick-reset first
    dispatch({ type: 'CLEAR_TABLE', payload: { tableId: 3 } });
    dispatch({ type: 'CLEAR_TABLE', payload: { tableId: 5 } });
    dispatch({ type: 'CLEAR_TABLE', payload: { tableId: 8 } });

    // Seed Table 3: Cooking
    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: 3,
        item: {
          id: "main-1",
          name: "Wagyu Ribeye Steak",
          price: 48,
          category: "Mains"
        },
        variant: "Medium Rare",
        modifier: "Allergies: Garlic Allergy"
      }
    });
    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: 3,
        item: {
          id: "drink-1",
          name: "Rosemary Old Fashioned",
          price: 18,
          category: "Drinks"
        },
        variant: "Standard"
      }
    });
    dispatch({ type: 'SEND_TO_KITCHEN', payload: { tableId: 3 } });

    // Seed Table 5: Served (Done Cooking)
    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: 5,
        item: {
          id: "app-3",
          name: "Crispy Calamari Fritti",
          price: 16,
          category: "Appetizers"
        },
        variant: "Regular Spicy"
      }
    });
    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: 5,
        item: {
          id: "main-3",
          name: "Wild Mushroom Tagliatelle",
          price: 28,
          category: "Mains"
        },
        variant: "Gluten-Free Pasta",
        modifier: "Extra Pecorino Cheese"
      }
    });
    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: 5,
        item: {
          id: "dessert-2",
          name: "Lava Chocolate Cake",
          price: 12,
          category: "Desserts"
        },
        variant: "Double Gelato (+$3)"
      }
    });
    // Send to kitchen & mark served
    dispatch({ type: 'SEND_TO_KITCHEN', payload: { tableId: 5 } });
    // Find the ticket created for table 5 and complete it to transition to Served state
    setTimeout(() => {
      const ticket = state.tickets.find(t => t.tableId === 5);
      if (ticket) {
        dispatch({ type: 'SERVE_ITEM', payload: { ticketId: ticket.id } });
      } else {
        // Fallback dispatch if state hasn't updated in same thread
        const lastTicketId = `ticket-5`;
        dispatch({ type: 'SERVE_ITEM', payload: { ticketId: lastTicketId } });
      }
      
      // Seed Table 8: Active Ordering
      dispatch({
        type: 'ADD_TO_ORDER',
        payload: {
          tableId: 8,
          item: {
            id: "app-1",
            name: "Truffle Arancini",
            price: 14,
            category: "Appetizers"
          },
          variant: "Extra Truffle Sauce"
        }
      });
      
      toast.success("Showcase Demo Seeded! Table 3 (Cooking KDS), Table 5 (Served/Billing ready) and Table 8 (Ordering) are pre-populated.");
    }, 100);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'pos':
        return <WaiterPOS />;
      case 'kds':
        return <KitchenDisplay />;
      case 'billing':
        return <BillingTerminal />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row antialiased selection:bg-primary/30 selection:text-white">
      
      {/* Dynamic Sidebar navigation */}
      <aside className="w-full md:w-80 bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between p-6 shrink-0 z-20">
        <div className="space-y-8">
          
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
              <UtensilsCrossed className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h1 id="dineflow-title" className="text-2xl font-black text-white tracking-tight">DineFlow</h1>
              <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase">OPERATIONS CONSOLE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-labelledby="dineflow-title">
            <button
              onClick={() => setActiveScreen('pos')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeScreen === 'pos'
                  ? "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Grid className="w-5 h-5" />
                <span>Waiter POS Terminal</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeScreen === 'pos' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-white/5 text-white/50'
              }`}>
                {state.tables.filter(t => t.status === 'Ordering').length} Act
              </span>
            </button>

            <button
              onClick={() => setActiveScreen('kds')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeScreen === 'kds'
                  ? "bg-amber-500 text-white font-black shadow-lg shadow-amber-500/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChefHat className="w-5 h-5" />
                <span>Kitchen Display (KDS)</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeScreen === 'kds' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'
              }`}>
                {state.tickets.length} Q
              </span>
            </button>

            <button
              onClick={() => setActiveScreen('billing')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeScreen === 'billing'
                  ? "bg-rose-500 text-white font-black shadow-lg shadow-rose-500/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5" />
                <span>Billing & Checkout</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                activeScreen === 'billing' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'
              }`}>
                {state.tables.filter(t => t.currentOrder.length > 0).length} bills
              </span>
            </button>
          </nav>

          {/* Quick Info & Seeder Showcase Panel */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
            <h4 className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5 font-sans uppercase">
              <Sparkles className="w-4 h-4 text-primary" /> Showcase Controls
            </h4>
            <p className="text-[11px] text-white/40 font-mono leading-relaxed">
              Recruiter Showcase: Click "Seed Showcase Demo" to instantly populate orders across POS, KDS, and checkout terminals to verify state synchronization.
            </p>
            <button
              onClick={handleSeedShowcase}
              className="w-full py-2 bg-primary/20 hover:bg-primary border border-primary/30 hover:border-primary text-primary hover:text-primary-foreground rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-primary/5"
            >
              <Database className="w-3.5 h-3.5" /> Seed Showcase Demo
            </button>
          </div>

        </div>

        {/* Footer Sidebar actions */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center text-[11px] font-mono text-white/30">
            <span>Terminal ID:</span>
            <span>#BISTRO-NY-01</span>
          </div>
          <a
            href="/"
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01]"
          >
            <Home className="w-4 h-4" /> Return to Portfolio
          </a>
        </div>
      </aside>

      {/* Main Console Workspace Area */}
      <main className="flex-1 bg-black p-6 md:p-10 overflow-y-auto max-h-screen">
        {renderActiveScreen()}
      </main>

    </div>
  );
};

export const DineFlowPage = () => {
  return (
    <RestaurantProvider>
      <DineFlowDashboard />
    </RestaurantProvider>
  );
};

export default DineFlowPage;
