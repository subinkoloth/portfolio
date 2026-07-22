import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';

// Enterprise Mock Menu Data for a 3-Star Full-Service Restaurant
export const MENU_ITEMS = [
  // Appetizers
  {
    id: "app-1",
    name: "Truffle Arancini",
    price: 14,
    category: "Appetizers",
    variants: ["Standard", "Extra Truffle Sauce"],
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "app-2",
    name: "Caprese Bruschetta",
    price: 12,
    category: "Appetizers",
    variants: ["Standard", "Gluten-Free Bread"],
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "app-3",
    name: "Crispy Calamari Fritti",
    price: 16,
    category: "Appetizers",
    variants: ["Regular Spicy", "Mild Lemon-Herb"],
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80"
  },
  // Mains
  {
    id: "main-1",
    name: "Wagyu Ribeye Steak",
    price: 48,
    category: "Mains",
    variants: ["Rare", "Medium Rare", "Medium", "Well Done"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "main-2",
    name: "Pan-Seared Sea Bass",
    price: 36,
    category: "Mains",
    variants: ["Standard", "Crispy Skin Only"],
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "main-3",
    name: "Wild Mushroom Tagliatelle",
    price: 28,
    category: "Mains",
    variants: ["Standard", "Gluten-Free Pasta"],
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&auto=format&fit=crop&q=80"
  },
  // Drinks
  {
    id: "drink-1",
    name: "Rosemary Old Fashioned",
    price: 18,
    category: "Drinks",
    variants: ["Standard", "Single Batch", "Double Batch"],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "drink-2",
    name: "Hibiscus Blossom Soda",
    price: 10,
    category: "Drinks",
    variants: ["Sweet", "Less Sweet"],
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "drink-3",
    name: "Premium Chardonnay",
    price: 15,
    category: "Drinks",
    variants: ["Glass", "Bottle (+$50)"],
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80"
  },
  // Desserts
  {
    id: "dessert-1",
    name: "Deconstructed Tiramisu",
    price: 14,
    category: "Desserts",
    variants: ["Standard", "Decaf Coffee Base"],
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "dessert-2",
    name: "Lava Chocolate Cake",
    price: 12,
    category: "Desserts",
    variants: ["Standard", "Double Gelato (+$3)"],
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80"
  }
];

const initialTables = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  status: 'Available', // Available | Ordering | Cooking | Served | Billing
  capacity: [2, 4, 6, 8][i % 4],
  currentOrder: [],
  serviceChargeApplied: true,
}));

const initialRestaurantState = {
  tables: initialTables,
  tickets: [],
};

/**
 * Strict Global POS State Reducer (JavaScript State Machine)
 * Handles transitions: Available -> Ordering -> Cooking -> Served -> Billing -> Available
 */
export function restaurantReducer(state, action) {
  switch (action.type) {
    case 'OPEN_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === action.payload.tableId && t.status === 'Available'
            ? { ...t, status: 'Ordering' }
            : t
        )
      };

    case 'ADD_TO_ORDER': {
      const { tableId, item, variant, modifier } = action.payload;
      
      // Calculate variant price adjustments
      let adjustedPrice = item.price;
      if (variant && variant.includes('+$50')) {
        adjustedPrice += 50;
      } else if (variant && variant.includes('+$3')) {
        adjustedPrice += 3;
      }

      const finalItem = { ...item, price: adjustedPrice };
      const resolvedVariant = variant || (item.variants && item.variants[0]) || 'Standard';
      const uniqueOrderItemId = `${item.id}-${resolvedVariant.replace(/\s+/g, '-').toLowerCase()}`;

      return {
        ...state,
        tables: state.tables.map(t => {
          if (t.id !== tableId) return t;

          // Auto transition Available to Ordering when items are added
          const nextStatus = t.status === 'Available' ? 'Ordering' : t.status;
          const existingItemIndex = t.currentOrder.findIndex(oi => oi.id === uniqueOrderItemId);
          let newOrder = [...t.currentOrder];

          if (existingItemIndex > -1) {
            newOrder[existingItemIndex] = {
              ...newOrder[existingItemIndex],
              quantity: newOrder[existingItemIndex].quantity + 1,
              modifier: modifier !== undefined ? modifier : newOrder[existingItemIndex].modifier
            };
          } else {
            newOrder.push({
              id: uniqueOrderItemId,
              menuItem: finalItem,
              quantity: 1,
              variant: resolvedVariant,
              modifier: modifier || ''
            });
          }

          return {
            ...t,
            status: nextStatus,
            currentOrder: newOrder
          };
        })
      };
    }

    case 'REMOVE_FROM_ORDER': {
      const { tableId, orderItemId } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t => {
          if (t.id !== tableId) return t;
          return {
            ...t,
            currentOrder: t.currentOrder.filter(oi => oi.id !== orderItemId)
          };
        })
      };
    }

    case 'UPDATE_QUANTITY': {
      const { tableId, orderItemId, quantity } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t => {
          if (t.id !== tableId) return t;
          return {
            ...t,
            currentOrder: t.currentOrder.map(oi =>
              oi.id === orderItemId ? { ...oi, quantity: Math.max(1, quantity) } : oi
            )
          };
        })
      };
    }

    case 'SET_MODIFIER': {
      const { tableId, orderItemId, modifier } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t => {
          if (t.id !== tableId) return t;
          return {
            ...t,
            currentOrder: t.currentOrder.map(oi =>
              oi.id === orderItemId ? { ...oi, modifier } : oi
            )
          };
        })
      };
    }

    case 'SEND_TO_KITCHEN': {
      const { tableId } = action.payload;
      const targetTable = state.tables.find(t => t.id === tableId);
      if (!targetTable || targetTable.currentOrder.length === 0) return state;

      // Transition POS state from Ordering/Available to Cooking
      const ticketId = `ticket-${tableId}-${Date.now()}`;
      const newTicket = {
        id: ticketId,
        tableId,
        items: [...targetTable.currentOrder],
        sentAt: new Date().toISOString(),
        status: 'Cooking'
      };

      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === tableId ? { ...t, status: 'Cooking' } : t
        ),
        tickets: [...state.tickets, newTicket]
      };
    }

    case 'SERVE_ITEM': {
      // Completed cooking ticket -> marks order as Served
      const { ticketId } = action.payload;
      const targetTicket = state.tickets.find(tk => tk.id === ticketId);
      if (!targetTicket) return state;

      const remainingTickets = state.tickets.filter(tk => tk.id !== ticketId);
      const tableHasOtherCookingTickets = remainingTickets.some(tk => tk.tableId === targetTicket.tableId);

      return {
        ...state,
        tickets: remainingTickets,
        tables: state.tables.map(t =>
          t.id === targetTicket.tableId
            ? { ...t, status: tableHasOtherCookingTickets ? 'Cooking' : 'Served' }
            : t
        )
      };
    }

    case 'APPLY_DISCOUNT': {
      const { tableId, code } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === tableId ? { ...t, discountCode: code } : t
        )
      };
    }

    case 'TOGGLE_SERVICE_CHARGE': {
      const { tableId } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === tableId ? { ...t, serviceChargeApplied: !t.serviceChargeApplied } : t
        )
      };
    }

    case 'PROCESS_BILLING': {
      const { tableId } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === tableId ? { ...t, status: 'Billing' } : t
        )
      };
    }

    case 'CLEAR_TABLE': {
      const { tableId } = action.payload;
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === tableId
            ? {
                ...t,
                status: 'Available',
                currentOrder: [],
                discountCode: undefined,
                serviceChargeApplied: true
              }
            : t
        ),
        tickets: state.tickets.filter(tk => tk.tableId !== tableId)
      };
    }

    default:
      return state;
  }
}

const RestaurantContext = createContext(undefined);

export const RestaurantProvider = ({ children }) => {
  // Bind useReducer engine with custom useLocalStorageState hook for resilient persistent state
  const [persistedState, setPersistedState] = useLocalStorageState('dineflow_state', initialRestaurantState);
  
  const [state, dispatch] = useReducer(restaurantReducer, persistedState);

  // Sync state shifts instantly to localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  return (
    <RestaurantContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
