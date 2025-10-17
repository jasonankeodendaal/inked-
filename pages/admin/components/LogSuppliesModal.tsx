

import React, { useState, useEffect } from 'react';
import { Booking, InventoryItem, Expense } from '../../../App';

const InkEstimator: React.FC = () => {
    const [mode, setMode] = useState<'quick' | 'area'>('quick');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState('');

    const handleQuickEstimate = (size: 'small' | 'medium' | 'large') => {
        const estimates = {
            small: '1-2 mL total',
            medium: '4-8 mL total',
            large: '10-30 mL+',
        };
        setResult(estimates[size]);
    };

    const handleAreaChange = (w: string, h: string) => {
        setWidth(w);
        setHeight(h);
        const numW = parseFloat(w);
        const numH = parseFloat(h);
        if (!isNaN(numW) && !isNaN(numH) && numW > 0 && numH > 0) {
            const area = numW * numH;
            const inkAmount = area / 25;
            setResult(`${inkAmount.toFixed(2)} mL (for solid color)`);
        } else {
            setResult('');
        }
    };

    return (
        <details className="bg-admin-dark-bg/50 rounded-lg p-3 mb-4">
            <summary className="font-semibold text-white cursor-pointer">Ink Usage Estimator</summary>
            <div className="mt-4 pt-4 border-t border-admin-dark-border">
                <div className="flex gap-2 mb-4">
                    <button onClick={() => setMode('quick')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${mode === 'quick' ? 'bg-admin-dark-primary text-white' : 'bg-white/10 text-admin-dark-text-secondary'}`}>Quick Estimate</button>
                    <button onClick={() => setMode('area')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${mode === 'area' ? 'bg-admin-dark-primary text-white' : 'bg-white/10 text-admin-dark-text-secondary'}`}>By Area</button>
                </div>
                {mode === 'quick' && (
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleQuickEstimate('small')} className="bg-white/5 p-2 rounded-lg text-sm hover:bg-white/10">Small</button>
                        <button onClick={() => handleQuickEstimate('medium')} className="bg-white/5 p-2 rounded-lg text-sm hover:bg-white/10">Medium</button>
                        <button onClick={() => handleQuickEstimate('large')} className="bg-white/5 p-2 rounded-lg text-sm hover:bg-white/10">Large</button>
                    </div>
                )}
                {mode === 'area' && (
                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Width (cm)" value={width} onChange={(e) => handleAreaChange(e.target.value, height)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text text-sm"/>
                        <span className="text-admin-dark-text-secondary">×</span>
                        <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => handleAreaChange(width, e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text text-sm"/>
                    </div>
                )}
                {result && (
                    <div className="mt-4 p-3 bg-admin-dark-bg rounded-lg text-center">
                        <p className="text-admin-dark-text-secondary text-sm">Estimated Ink:</p>
                        <p className="font-bold text-lg text-white">{result}</p>
                    </div>
                )}
            </div>
        </details>
    );
};

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
    const value = parseInt(quantity, 10);
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
      // FIX: Cast quantityUsed to a number to satisfy TypeScript's strict type checking
      // for arithmetic operations. The value from Object.entries on a record is loosely typed,
      // but we know from the component's state that it will be a number.
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
  
  const inputClasses = "w-20 bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition text-center";

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-admin-dark-border flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Log Supplies Used</h2>
            <p className="text-sm text-admin-dark-text-secondary mt-1">For <span className="font-semibold text-white">{booking.name}</span> on {new Date(booking.bookingDate).toLocaleDateString()}</p>
        </header>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          <InkEstimator />
          {inventory.length > 0 ? inventory.map(item => (
             <div key={item.id} className="flex justify-between items-center bg-admin-dark-bg/50 p-3 rounded-lg">
               <div>
                 <p className="font-semibold text-white">{item.name}</p>
                  {item.category === 'Ink' && item.brand && (
                      <p className="text-xs text-admin-dark-text-secondary">{item.brand} - Lot: {item.lotNumber || 'N/A'}</p>
                  )}
                 <p className="text-xs text-admin-dark-text-secondary">In stock: {item.quantity}{item.category === 'Ink' ? 'mL' : ''}</p>
               </div>
               <div className="flex items-center gap-2">
                 <label htmlFor={`item-${item.id}`} className="text-sm text-admin-dark-text-secondary">Used{item.category === 'Ink' ? ' (mL)' : ''}:</label>
                 <input
                    type="number"
                    id={`item-${item.id}`}
                    value={usedSupplies[item.id] || ''}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    min="0"
                    max={item.quantity}
                    className={inputClasses}
                    placeholder="0"
                 />
               </div>
             </div>
          )) : (
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