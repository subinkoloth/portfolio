import React, { useState, useCallback, useMemo } from 'react';
import { useRestaurant, MENU_ITEMS } from './RestaurantContext';
import { TableGrid } from './TableGrid';
import { MenuCard } from './MenuCard';
import { OrderSummary } from './OrderSummary';
import { UtensilsCrossed, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const WaiterPOS = () => {
  const { state, dispatch } = useRestaurant();
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Appetizers');

  // Find currently selected table
  const selectedTable = useMemo(() => {
    return state.tables.find(t => t.id === selectedTableId) || null;
  }, [state.tables, selectedTableId]);

  // Memoize active menu items filtering
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // useCallback on item selection click handlers to prevent unnecessary child component re-renders
  const handleAddItemToOrder = useCallback((item, variant, modifier) => {
    if (!selectedTableId) {
      toast.error("Please select a table first before adding items.");
      return;
    }

    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        tableId: selectedTableId,
        item,
        variant,
        modifier
      }
    });
  }, [selectedTableId, dispatch]);

  const handleSelectTable = useCallback((tableId) => {
    setSelectedTableId(tableId);
    const table = state.tables.find(t => t.id === tableId);
    
    // Auto transition to 'Ordering' status if currently 'Available'
    if (table && table.status === 'Available') {
      dispatch({ type: 'OPEN_TABLE', payload: { tableId } });
      toast.success(`${table.name} has been opened for ordering.`);
    }
  }, [state.tables, dispatch]);

  const handleRemoveItem = useCallback((orderItemId) => {
    if (!selectedTableId) return;
    dispatch({
      type: 'REMOVE_FROM_ORDER',
      payload: { tableId: selectedTableId, orderItemId }
    });
  }, [selectedTableId, dispatch]);

  const handleUpdateQuantity = useCallback((orderItemId, quantity) => {
    if (!selectedTableId) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { tableId: selectedTableId, orderItemId, quantity }
    });
  }, [selectedTableId, dispatch]);

  const handleSetModifier = useCallback((orderItemId, modifier) => {
    if (!selectedTableId) return;
    dispatch({
      type: 'SET_MODIFIER',
      payload: { tableId: selectedTableId, orderItemId, modifier }
    });
    toast.success("Special note updated.");
  }, [selectedTableId, dispatch]);

  const handleSendToKitchen = useCallback(() => {
    if (!selectedTableId || !selectedTable) return;
    
    dispatch({
      type: 'SEND_TO_KITCHEN',
      payload: { tableId: selectedTableId }
    });
    
    toast.success(`Sent ${selectedTable.currentOrder.length} items for ${selectedTable.name} to KDS!`);
  }, [selectedTableId, selectedTable, dispatch]);

  const handleProcessBilling = useCallback(() => {
    if (!selectedTableId) return;
    dispatch({
      type: 'PROCESS_BILLING',
      payload: { tableId: selectedTableId }
    });
    toast.success("Table marked ready for checkout!");
  }, [selectedTableId, dispatch]);

  const categories = [
    'Appetizers',
    'Mains',
    'Drinks',
    'Desserts',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Visual Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UtensilsCrossed className="w-8 h-8 text-primary" /> Waiter POS Terminal
          </h2>
          <p className="text-sm font-mono text-white/50 mt-1">
            Manage tables 1-12, take orders, customize items, and dispatch directly to the kitchen.
          </p>
        </div>
        <div className="flex gap-4 self-start md:self-center font-mono">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <div className="text-xs text-emerald-400 font-semibold">Available</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {state.tables.filter(t => t.status === 'Available').length}
            </div>
          </div>
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <div className="text-xs text-amber-400 font-semibold">Cooking</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {state.tables.filter(t => t.status === 'Cooking').length}
            </div>
          </div>
          <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-center">
            <div className="text-xs text-violet-400 font-semibold">Served</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {state.tables.filter(t => t.status === 'Served').length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Tables */}
      <div>
        <h3 className="text-lg font-bold text-white/90 mb-4 font-sans tracking-wide">Tables Status Overview</h3>
        <TableGrid
          tables={state.tables}
          onSelectTable={handleSelectTable}
          selectedTableId={selectedTableId}
        />
      </div>

      {/* Split screen ordering section */}
      {selectedTable ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Menu Selection (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Ordering for {selectedTable.name}
              </h3>
              
              {/* Category Tab buttons */}
              <div className="flex gap-1 overflow-x-auto max-w-[320px] sm:max-w-none pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all duration-300 border cursor-pointer ${
                      activeCategory === cat
                        ? "bg-primary border-primary/50 text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddItem={handleAddItemToOrder}
                />
              ))}
            </div>
          </div>

          {/* Active Order Summary Sidebar (1 Col) */}
          <div className="lg:col-span-1">
            <OrderSummary
              table={selectedTable}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onSetModifier={handleSetModifier}
              onSendToKitchen={handleSendToKitchen}
              onProcessBilling={handleProcessBilling}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-white/5 bg-white/5 text-center min-h-[300px] backdrop-blur-md">
          <div className="p-4 rounded-full bg-white/5 text-primary/70 mb-4">
            <UtensilsCrossed className="w-10 h-10 animate-pulse" />
          </div>
          <h4 className="text-lg font-bold text-white">No Table Selected</h4>
          <p className="text-sm text-white/40 max-w-sm mt-1 mx-auto">
            Please click on any table in the grid above to open it, view its active orders, or start a new order.
          </p>
        </div>
      )}
    </div>
  );
};
