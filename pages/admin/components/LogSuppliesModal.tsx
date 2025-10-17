import React, { useState, useEffect } from 'react';
import { Booking, InventoryItem, Expense } from '../../../App';

interface LogSuppliesModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  inventory: InventoryItem[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateInventoryItem: (item: InventoryItem) => void;
}

const LogSuppliesModal: React.FC<LogSuppliesModalProps> = ({
  isOpen,
  onClose,
  booking,
  inventory,
  onAddExpense,
  onUpdateInventoryItem,
}) => {
  const [usedSupplies, setUsedSupplies] = useState<Record<string, number>>({});

  useEffect(() => {
    // Reset form when modal opens for a new booking
    if (isOpen) {
      setUsedSupplies({});
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleQuantityChange = (itemId: string, quantity: string) => {
    // Use parseFloat to allow for decimal values (e.g., for ink in mL)
    const value = parseFloat(quantity);
    const inventoryItem = inventory.find(i => i.id === itemId);
    if (!inventoryItem) return;

    // Clamp value between 0 and current stock
    const clampedValue = Math.max(0, Math.min(value, inventoryItem.quantity));

    setUsedSupplies(prev => ({
      ...prev,
      [itemId]: isNaN(clampedValue) ? 0 : clampedValue,
    }));
  };

  const handleSubmit = () => {
    if (!booking) return;

    Object.entries(usedSupplies).forEach(([itemId, quantityUsed]) => {
      const numQuantityUsed = Number(quantityUsed);
      if (numQuantityUsed > 0) {
        const inventoryItem = inventory.find(i => i.id === itemId);
        if (inventoryItem) {
          // 1. Create an expense record
          const totalCost = numQuantityUsed * inventoryItem.cost;
          
          const description = inventoryItem.category === 'Ink'
            ? `${numQuantityUsed}mL of ${inventoryItem.brand || ''} ${inventoryItem.name} (Lot: ${inventoryItem.lotNumber || 'N/A'}) used for ${booking.name}'s tattoo`
            : `${numQuantityUsed}x ${inventoryItem.name} for ${booking.name}'s tattoo`;

          const newExpense: Omit<Expense, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            category: 'Supplies',
            description,
            amount: totalCost,
          };
          onAddExpense(newExpense);

          // 2. Update the inventory
          const updatedInventoryItem: InventoryItem = {
            ...inventoryItem,
            quantity: inventoryItem.quantity - numQuantityUsed,
          };
          onUpdateInventoryItem(updatedInventoryItem);
        }
      }
    });

    onClose();
  };
  
  const inputClasses = "w-24 bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition text-center";

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-admin-dark-border flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Log Supplies Used</h2>
            <p className="text-sm text-admin-dark-text-secondary mt-1">For <span className="font-semibold text-white">{booking.name}</span> on {new Date(booking.bookingDate).toLocaleDateString()}</p>
        </header>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {inventory.length > 0 ? inventory.map(item => {
            const isInk = item.category === 'Ink';
            return (
             <div key={item.id} className="flex justify-between items-center bg-admin-dark-bg/50 p-3 rounded-lg">
               <div>
                 <p className="font-semibold text-white">{item.name}</p>
                  {isInk && item.brand && (
                      <p className="text-xs text-admin-dark-text-secondary">{item.brand} - Lot: {item.lotNumber || 'N/A'}</p>
                  )}
                 <p className="text-xs text-admin-dark-text-secondary">In stock: {item.quantity}{isInk ? 'mL' : ''}</p>
               </div>
               <div className="flex items-center gap-2">
                 <label htmlFor={`item-${item.id}`} className="text-sm text-admin-dark-text-secondary">Used{isInk ? ' (mL)' : ''}:</label>
                 <input
                    type="number"
                    id={`item-${item.id}`}
                    value={usedSupplies[item.id] || ''}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    min="0"
                    max={item.quantity}
                    step={isInk ? "0.1" : "1"}
                    className={inputClasses}
                    placeholder={isInk ? "0.0" : "0"}
                 />
               </div>
             </div>
            );
          }) : (
            <p className="text-center text-admin-dark-text-secondary py-8">Your inventory is empty. Please add items in the Financials tab.</p>
          )}
        </div>
        
        <footer className="flex justify-end gap-4 p-6 border-t border-admin-dark-border flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
            <button type="button" onClick={handleSubmit} className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Log Usage &amp; Finalize</button>
        </footer>
      </div>
    </div>
  );
};

export default LogSuppliesModal;