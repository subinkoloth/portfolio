import React, { useState, useMemo } from 'react';
import { useRestaurant } from './RestaurantContext';
import { Receipt, CreditCard, Ticket, CheckCircle2, RefreshCw, X, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const BillingTerminal = () => {
  const { state, dispatch } = useRestaurant();
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Find currently selected table
  const selectedTable = useMemo(() => {
    return state.tables.find(t => t.id === selectedTableId) || null;
  }, [state.tables, selectedTableId]);

  // Tables that are currently active (have orders)
  const activeTables = useMemo(() => {
    return state.tables.filter(t => t.currentOrder.length > 0);
  }, [state.tables]);

  // Wrap all mathematics inside a useMemo block.
  // Recalculates subtotal, 5% GST, 10% Service Charge, discounts and grand total only when 
  // the table currentOrder, discountCode, or serviceChargeApplied states change.
  const billingCalculations = useMemo(() => {
    if (!selectedTable || selectedTable.currentOrder.length === 0) {
      return {
        subtotal: 0,
        gst: 0,
        serviceCharge: 0,
        discountAmount: 0,
        grandTotal: 0,
      };
    }

    const orderItems = selectedTable.currentOrder;
    const code = selectedTable.discountCode;
    const isServiceCharge = selectedTable.serviceChargeApplied;

    // Calculate base subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    // Calculate discount amount based on active coupon codes
    let discountAmount = 0;
    if (code) {
      const upperCode = code.toUpperCase();
      if (upperCode === 'SAVE10') {
        discountAmount = subtotal * 0.10; // 10% Off
      } else if (upperCode === 'VIP20') {
        discountAmount = subtotal * 0.20; // 20% Off
      } else if (upperCode === 'WELCOME') {
        discountAmount = Math.min(5, subtotal); // $5 flat off
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Calculate 10% Service Charge (applied on discounted subtotal for fairness in a 3-star bistro)
    const serviceCharge = isServiceCharge ? discountedSubtotal * 0.10 : 0;

    // Calculate 5% GST (applied on discounted subtotal + service charge)
    const gst = (discountedSubtotal + serviceCharge) * 0.05;

    // Grand Total
    const grandTotal = discountedSubtotal + serviceCharge + gst;

    return {
      subtotal,
      gst,
      serviceCharge,
      discountAmount,
      grandTotal,
    };
  }, [
    selectedTable?.currentOrder, 
    selectedTable?.discountCode, 
    selectedTable?.serviceChargeApplied
  ]);

  const handleApplyCoupon = () => {
    if (!selectedTableId) return;
    const validCoupons = ['SAVE10', 'VIP20', 'WELCOME'];
    const formattedCode = discountInput.trim().toUpperCase();

    if (formattedCode === '') {
      dispatch({ type: 'APPLY_DISCOUNT', payload: { tableId: selectedTableId, code: '' } });
      toast.success("Coupon removed.");
      return;
    }

    if (validCoupons.includes(formattedCode)) {
      dispatch({
        type: 'APPLY_DISCOUNT',
        payload: { tableId: selectedTableId, code: formattedCode }
      });
      toast.success(`Coupon "${formattedCode}" applied successfully!`);
    } else {
      toast.error("Invalid coupon code. Try SAVE10, VIP20, or WELCOME.");
    }
  };

  const handleToggleServiceCharge = () => {
    if (!selectedTableId) return;
    dispatch({
      type: 'TOGGLE_SERVICE_CHARGE',
      payload: { tableId: selectedTableId }
    });
  };

  const handleCheckoutComplete = () => {
    if (!selectedTableId) return;
    
    setIsProcessingPayment(true);
    
    // Simulate transaction clearing delay
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_TABLE',
        payload: { tableId: selectedTableId }
      });
      
      setIsProcessingPayment(false);
      setShowReceiptModal(false);
      setSelectedTableId(null);
      setDiscountInput('');
      toast.success("Billing finalized! Table marked available for guest seating.");
    }, 1500);
  };

  const handleProcessBillingStatus = () => {
    if (!selectedTableId) return;
    dispatch({
      type: 'PROCESS_BILLING',
      payload: { tableId: selectedTableId }
    });
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="w-8 h-8 text-rose-500" /> Cashier & Billing Terminal
          </h2>
          <p className="text-sm font-mono text-white/50 mt-1">
            Calculate invoices, apply guest discounts, override service charges, and print professional customer receipts.
          </p>
        </div>
        <div className="flex gap-4 font-mono self-start md:self-center">
          <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            <div className="text-xs text-rose-400 font-semibold">Open Invoices</div>
            <div className="text-xl font-bold text-white mt-0.5">{activeTables.length}</div>
          </div>
          <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-center">
            <div className="text-xs text-violet-400 font-semibold">Served & Unpaid</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {activeTables.filter(t => t.status === 'Served').length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Selector Panel (1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-4">Choose Billable Table</h3>
            
            {activeTables.length === 0 ? (
              <div className="text-center py-12 text-white/30 font-mono text-xs space-y-2">
                <div>No occupied tables with orders.</div>
                <div className="text-[10px] text-white/20">Open the Waiter POS Terminal to seat guests and submit orders.</div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-2">
                {activeTables.map((table) => {
                  const isSelected = selectedTableId === table.id;
                  const totalSum = table.currentOrder.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

                  return (
                    <button
                      key={table.id}
                      onClick={() => {
                        setSelectedTableId(table.id);
                        setDiscountInput(table.discountCode || '');
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 backdrop-blur-md cursor-pointer",
                        isSelected
                          ? "bg-primary/20 border-primary shadow-lg shadow-primary/5 scale-[1.01]"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/15"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-white">{table.name}</h4>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase",
                            table.status === 'Served' ? "bg-violet-500/20 text-violet-300 border border-violet-500/20" :
                            table.status === 'Billing' ? "bg-rose-500/20 text-rose-300 border border-rose-500/20 animate-pulse" :
                            "bg-amber-500/10 text-amber-300 border border-amber-500/10"
                          )}>
                            {table.status}
                          </span>
                        </div>
                        <span className="text-xs text-white/40 font-mono">
                          {table.currentOrder.length} unique items
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-white">
                          ${totalSum.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Itemization Panel (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTable ? (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
              
              {/* Header Details */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">CHECKOUT RECEIPT SUMMARY</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">Invoice Detail: {selectedTable.name}</h3>
                </div>
                <div className="text-xs font-mono text-white/40 bg-black/35 border border-white/5 px-3 py-1.5 rounded-lg">
                  Guest count: {selectedTable.capacity}
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {selectedTable.currentOrder.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-primary">{item.quantity}x</span>
                        <span className="text-sm font-semibold text-white">{item.menuItem.name}</span>
                        {item.variant && item.variant !== 'Standard' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                            {item.variant}
                          </span>
                        )}
                      </div>
                      {item.modifier && (
                        <p className="text-[11px] font-mono text-amber-300/80 pl-6 mt-0.5">
                          ✍️ {item.modifier}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right flex items-center gap-4">
                      <span className="text-xs font-mono text-white/40">
                        (${item.menuItem.price.toFixed(2)} ea)
                      </span>
                      <span className="text-sm font-mono font-bold text-white min-w-[70px]">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Controls: Coupons & Service Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 bg-white/[0.01] p-5 rounded-2xl border border-white/5">
                
                {/* Coupon Discount Section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 block">Apply Coupon Code:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10, VIP20, WELCOME"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-primary/20 border border-primary/40 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" /> Apply
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 font-mono">
                    * Try codes: <span className="text-primary font-bold">SAVE10</span> (10% off), <span className="text-primary font-bold">VIP20</span> (20% off), or <span className="text-primary font-bold">WELCOME</span> ($5 off).
                  </p>
                </div>

                {/* Service Charge Override */}
                <div className="flex flex-col justify-center space-y-2.5">
                  <label className="text-xs font-bold text-white/70 block">Hospitality Extras:</label>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-black/20">
                    <div>
                      <span className="text-xs font-bold text-white">10% Service Charge</span>
                      <p className="text-[10px] text-white/40 mt-0.5">Applied for premium table service</p>
                    </div>
                    <button
                      onClick={handleToggleServiceCharge}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border cursor-pointer",
                        selectedTable.serviceChargeApplied
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                      )}
                    >
                      {selectedTable.serviceChargeApplied ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Calculations Bill Breakdown */}
              <div className="p-6 rounded-2xl bg-black/45 border border-white/5 space-y-3.5 font-mono text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${billingCalculations.subtotal.toFixed(2)}</span>
                </div>
                
                {selectedTable.discountCode && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount Coupon ({selectedTable.discountCode})</span>
                    <span>-${billingCalculations.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>10% Service Charge</span>
                  <span className="text-white">${billingCalculations.serviceCharge.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>5% GST (Taxes)</span>
                  <span className="text-white">${billingCalculations.gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-3.5">
                  <span className="font-sans">Grand Total</span>
                  <span className="text-primary font-mono text-xl">${billingCalculations.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <button
                  onClick={handleProcessBillingStatus}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 border border-rose-400 text-white rounded-2xl font-black text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-rose-500/10 cursor-pointer"
                >
                  <CreditCard className="w-5 h-5" /> PROCESS BILLING & PRINT INVOICE
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-white/5 bg-white/5 text-center min-h-[300px] backdrop-blur-md">
              <div className="p-4 rounded-full bg-white/5 text-rose-500/70 mb-4">
                <Receipt className="w-10 h-10 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-white">No Table Selected</h4>
              <p className="text-sm text-white/40 max-w-sm mt-1 mx-auto">
                Please select an active table from the left list to review their items, toggle taxes, and complete checkout payment processing.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Receipt Modal - Professional Thermal Printed Styling */}
      {showReceiptModal && selectedTable && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white text-zinc-900 rounded-2xl p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto flex flex-col justify-between font-mono border-t-[10px] border-zinc-800 relative">
            
            {/* Dismiss Button */}
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
              title="Close Invoice"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thermal Ticket Print Details */}
            <div className="space-y-5 text-center pt-2">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight uppercase">DineFlow Bistro</h3>
                <p className="text-[10px] text-zinc-500">3-STAR BISTRO & FINE DINING</p>
                <p className="text-[10px] text-zinc-400">128 ORCHARD STREET, NEW YORK, NY</p>
                <p className="text-[10px] text-zinc-400">TEL: (555) 019-9029</p>
              </div>

              {/* Server Info */}
              <div className="border-y border-dashed border-zinc-300 py-3 text-left text-[11px] space-y-1 text-zinc-700">
                <div className="flex justify-between">
                  <span>DATE: {new Date().toLocaleDateString()}</span>
                  <span>TIME: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>TABLE: {selectedTable.name}</span>
                  <span>GUESTS: {selectedTable.capacity}</span>
                </div>
                <div>SERVER: CHRIS P. (POS-01)</div>
                <div>INVOICE ID: DF-{selectedTable.id}-{Date.now().toString().slice(-6)}</div>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 text-left text-xs py-2 text-zinc-800">
                {selectedTable.currentOrder.map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-bold">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.variant && item.variant !== 'Standard' && (
                      <div className="text-[10px] text-zinc-500 pl-4 font-mono">
                        ↳ Style: {item.variant}
                      </div>
                    )}
                    {item.modifier && (
                      <div className="text-[10px] text-zinc-500 pl-4 font-mono italic">
                        ↳ Spec: {item.modifier}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="border-t border-dashed border-zinc-300 pt-4 space-y-2 text-left text-xs text-zinc-700">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>${billingCalculations.subtotal.toFixed(2)}</span>
                </div>

                {selectedTable.discountCode && (
                  <div className="flex justify-between text-zinc-900 font-bold">
                    <span>COUPON DEDUCTION ({selectedTable.discountCode})</span>
                    <span>-${billingCalculations.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>10% SERVICE CHARGE</span>
                  <span>${billingCalculations.serviceCharge.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>5% GST TAX</span>
                  <span>${billingCalculations.gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-zinc-900 border-t border-dashed border-zinc-300 pt-3.5">
                  <span>GRAND TOTAL</span>
                  <span>${billingCalculations.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Thermal footer barcode simulation */}
              <div className="space-y-2 pt-4">
                <div className="w-full h-8 bg-zinc-800 flex items-center justify-center text-[10px] text-white tracking-[0.6em] font-sans font-bold">
                  *DINEFLOWBISTRO*
                </div>
                <p className="text-[9px] text-zinc-500 font-sans">
                  THANK YOU FOR DINING WITH US!
                </p>
              </div>
            </div>

            {/* Print Confirmation Actions */}
            <div className="mt-8 pt-4 border-t border-zinc-100 flex gap-3">
              <button
                onClick={() => {
                  toast.success("Sending print command to thermal Bluetooth printer...");
                  window.print();
                }}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={handleCheckoutComplete}
                disabled={isProcessingPayment}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-rose-500/10"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Complete Payment
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
