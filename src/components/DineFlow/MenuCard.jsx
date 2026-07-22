import React, { useState } from 'react';
import { Plus, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MenuCard = React.memo(({ item, onAddItem }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0] : 'Standard'
  );
  const [modifierText, setModifierText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [feedbackAdded, setFeedbackAdded] = useState(false);

  const handleAdd = () => {
    onAddItem(item, selectedVariant, modifierText);
    setModifierText(''); // Clear after adding
    setFeedbackAdded(true);
    setTimeout(() => setFeedbackAdded(false), 800);
  };

  // Check if variant adds pricing info (e.g., Bottle +$50, Double Gelato +$3)
  const getDisplayPrice = () => {
    let price = item.price;
    if (selectedVariant.includes('+$50')) price += 50;
    if (selectedVariant.includes('+$3')) price += 3;
    return price.toFixed(2);
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
      {/* Product Image & Details Toggle */}
      <div className="relative h-36 w-full overflow-hidden bg-black/40">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-primary text-white transition-colors duration-200 z-10"
          title="Custom note & details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
        
        {/* Absolute Item Price Badge */}
        <span className="absolute bottom-3 left-4 font-mono font-bold text-lg text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
          ${getDisplayPrice()}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight line-clamp-1">{item.name}</h4>
          <span className="text-[10px] font-mono tracking-widest text-primary uppercase mt-0.5 inline-block">
            {item.category}
          </span>
        </div>

        {/* Dynamic Detail Input Drawer */}
        {(showDetails || item.variants) && (
          <div className="mt-3 space-y-2 border-t border-white/5 pt-3 animate-fade-in">
            {/* Variants Selector */}
            {item.variants && item.variants.length > 0 && (
              <div>
                <label className="text-[10px] font-mono tracking-wider text-white/40 block mb-1">
                  Select Variant:
                </label>
                <div className="flex flex-wrap gap-1">
                  {item.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        "text-xs px-2 py-1 rounded-md border font-medium transition-all duration-200 cursor-pointer",
                        selectedVariant === v
                          ? "bg-primary/20 border-primary text-primary-foreground font-semibold"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Modifier Text Box */}
            {showDetails && (
              <div>
                <label className="text-[10px] font-mono tracking-wider text-white/40 block mb-1">
                  Modifier Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. No onions, extra ice..."
                  value={modifierText}
                  onChange={(e) => setModifierText(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-white/10 bg-black/40 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 font-sans"
                />
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAdd}
          className={cn(
            "w-full mt-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border",
            feedbackAdded
              ? "bg-emerald-500 border-emerald-400 text-white"
              : "bg-white/5 hover:bg-primary border-white/10 hover:border-primary text-white hover:text-primary-foreground hover:scale-[1.01]"
          )}
        >
          {feedbackAdded ? (
            <>
              <Check className="w-4 h-4" /> Added to Order
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add to Order
            </>
          )}
        </button>
      </div>
    </div>
  );
});

MenuCard.displayName = "MenuCard";
