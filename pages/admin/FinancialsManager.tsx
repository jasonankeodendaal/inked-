import React, { useState } from 'react';
import { Expense, InventoryItem, Booking } from '../../App';
import YearlyProfitChart from './components/YearlyProfitChart';

// --- Expense Management ---
const ExpenseForm: React.FC<{
    expense?: Partial<Expense>;
    onSave: (expense: Omit<Expense, 'id'> | Expense) => void;
    onCancel: () => void;
}> = ({ expense, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Expense>>(expense || { date: new Date().toISOString().split('T')[0], category: 'Supplies' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Expense, 'id'> | Expense);
    };

    return (
        <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-lg p-6 mb-4 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Date</label>
                        <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" style={{ colorScheme: 'dark' }} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Category</label>
                        <select name="category" value={formData.category || 'Supplies'} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required>
                            <option>Supplies</option>
                            <option>Rent</option>
                            <option>Utilities</option>
                            <option>Marketing</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Amount (R)</label>
                        <input type="number" name="amount" placeholder="0.00" value={formData.amount || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" step="0.01" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Description</label>
                    <input type="text" name="description" placeholder="e.g., Monthly Studio Rent" value={formData.description || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required />
                </div>
                <div className="flex gap-4 pt-2">
                    <button type="submit" className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Save Expense</button>
                    <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const ExpenseManager: React.FC<{
    expenses: Expense[];
    onAdd: (newExpense: Omit<Expense, 'id'>) => void;
    onUpdate: (updatedExpense: Expense) => void;
    onDelete: (expenseId: string) => void;
}> = ({ expenses, onAdd, onUpdate, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleSave = (expenseData: Omit<Expense, 'id'> | Expense) => {
        if ('id' in expenseData) {
            onUpdate(expenseData);
        } else {
            onAdd(expenseData);
        }
        setIsAdding(false);
        setEditingExpense(null);
    };

    return (
        <div className="mt-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Expense Tracker</h3>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Log and manage expenses for the selected month.</p>
                </div>
                {!isAdding && !editingExpense && (
                    <button data-tour-id="financials-add-expense-button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add Expense
                    </button>
                )}
            </header>
            
            {(isAdding || editingExpense) && (
                <ExpenseForm 
                    expense={editingExpense || undefined} 
                    onSave={handleSave} 
                    onCancel={() => { setIsAdding(false); setEditingExpense(null); }} 
                />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenses.length > 0 ? expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                    <div key={exp.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-3">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 capitalize">{exp.category}</span>
                                <p className="text-white font-semibold text-sm">{new Date(exp.date).toLocaleDateString('en-ZA')}</p>
                            </div>
                            <p className="text-admin-dark-text my-2">{exp.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-admin-dark-border pt-3">
                            <p className="text-red-400 font-bold text-lg">R{exp.amount.toFixed(2)}</p>
                            <div className="flex gap-2 text-admin-dark-text-secondary">
                                <button onClick={() => { setIsAdding(false); setEditingExpense(exp); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                </button>
                                <button onClick={() => onDelete(exp.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )) : <p className="md:col-span-2 text-center text-admin-dark-text-secondary py-8">No expenses found for this month.</p>}
            </div>
        </div>
    );
};

// --- Inventory Management ---
const InventoryForm: React.FC<{
    item?: Partial<InventoryItem>;
    onSave: (item: Omit<InventoryItem, 'id'> | InventoryItem) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<InventoryItem, 'id'> | InventoryItem);
    };

    return (
        <div className="md:col-span-2 lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-lg p-6 mb-4 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Item Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Category</label>
                        <input type="text" name="category" placeholder="e.g., Ink, Needles" value={formData.category || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Brand (Optional)</label>
                        <input type="text" name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Lot # (Optional)</label>
                        <input type="text" name="lotNumber" value={formData.lotNumber || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Quantity (units, or mL for ink)</label>
                        <input type="number" name="quantity" value={formData.quantity || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Cost per Item (R)</label>
                        <input type="number" name="cost" step="0.01" value={formData.cost || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Supplier (Optional)</label>
                        <input type="text" name="supplier" value={formData.supplier || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" />
                    </div>
                </div>
                <div className="flex gap-4 pt-2">
                    <button type="submit" className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Save Item</button>
                    <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const InventoryManager: React.FC<{
    inventory: InventoryItem[];
    onAdd: (newItem: Omit<InventoryItem, 'id'>) => void;
    onUpdate: (updatedItem: InventoryItem) => void;
    onDelete: (itemId: string) => void;
}> = ({ inventory, onAdd, onUpdate, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const handleSave = (itemData: Omit<InventoryItem, 'id'> | InventoryItem) => {
        if ('id' in itemData) {
            onUpdate(itemData);
        } else {
            onAdd(itemData);
        }
        setIsAdding(false);
        setEditingItem(null);
    };

    const totalValue = inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    return (
        <div className="mt-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-white">Inventory Management</h3>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Total Stock Value: <span className="font-bold text-blue-400">R{totalValue.toFixed(2)}</span></p>
                </div>
                {!isAdding && !editingItem && (
                    <button data-tour-id="financials-add-inventory-button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add Item
                    </button>
                )}
            </header>
            
            {(isAdding || editingItem) && (
                <InventoryForm 
                    item={editingItem || undefined} 
                    onSave={handleSave} 
                    onCancel={() => { setIsAdding(false); setEditingItem(null); }} 
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {inventory.map(item => (
                    <div key={item.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-3">
                        <div>
                            <div className="flex justify-between items-start">
                               <p className="text-white font-semibold pr-2">{item.name}</p>
                               <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 capitalize flex-shrink-0">{item.category}</span>
                            </div>
                             <p className="text-xs text-admin-dark-text-secondary mt-1">
                                {item.supplier && `from ${item.supplier}`}
                            </p>
                            <div className="flex justify-between items-baseline my-3">
                                 <p className="font-bold text-2xl">
                                    <span className={item.quantity < 10 ? 'text-yellow-400' : 'text-white'}>{item.quantity}</span>
                                    <span className="text-sm text-admin-dark-text-secondary ml-1"> {item.category === 'Ink' ? 'mL' : 'units'}</span>
                                </p>
                                <p className="text-blue-400 text-lg font-semibold">R{(item.cost * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center border-t border-admin-dark-border pt-3">
                            <div className="flex gap-2 text-admin-dark-text-secondary">
                                <button onClick={() => { setIsAdding(false); setEditingItem(item); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                </button>
                                <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MonthlyBreakdown: React.FC<{ bookings: Booking[], expenses: Expense[] }> = ({ bookings, expenses }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
                <h4 className="font-semibold text-white mb-3">Income (Completed Bookings)</h4>
                <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 max-h-80 overflow-y-auto">
                    {bookings.length > 0 ? (
                        <ul className="space-y-2">
                            {bookings.map(b => (
                                <li key={b.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5">
                                    <span className="text-admin-dark-text">{b.name}</span>
                                    <span className="font-semibold text-green-400">+ R{b.totalCost?.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-admin-dark-text-secondary text-center py-4">No income recorded for this month.</p>
                    )}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-white mb-3">Expenses</h4>
                <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 max-h-80 overflow-y-auto">
                     {expenses.length > 0 ? (
                        <ul className="space-y-2">
                            {expenses.map(e => (
                                <li key={e.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5">
                                    <div>
                                        <p className="text-admin-dark-text">{e.description}</p>
                                        <p className="text-xs text-admin-dark-text-secondary">{e.category}</p>
                                    </div>
                                    <span className="font-semibold text-red-400">- R{e.amount?.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-admin-dark-text-secondary text-center py-4">No expenses recorded for this month.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Financials Manager ---
interface FinancialsManagerProps {
    bookings: Booking[];
    expenses: Expense[];
    onAddExpense: (newExpense: Omit<Expense, 'id'>) => void;
    onUpdateExpense: (updatedExpense: Expense) => void;
    onDeleteExpense: (expenseId: string) => void;
    inventory: InventoryItem[];
    onAddInventoryItem: (newItem: Omit<InventoryItem, 'id'>) => void;
    onUpdateInventoryItem: (updatedItem: InventoryItem) => void;
    onDeleteInventoryItem: (itemId: string) => void;
    startTour: (tourKey: 'financials') => void;
}

const FinancialsManager: React.FC<FinancialsManagerProps> = (props) => {
    const [activeSubTab, setActiveSubTab] = useState<'breakdown' | 'expenses' | 'inventory'>('breakdown');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleMonthChange = (increment: number) => {
        setSelectedDate(current => {
            const newDate = new Date(current);
            newDate.setDate(1); // Avoid day issues
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
    };

    const filteredBookings = props.bookings.filter(b => {
        const bookingDate = new Date(b.bookingDate);
        return b.status === 'completed' &&
               bookingDate.getFullYear() === selectedDate.getFullYear() &&
               bookingDate.getMonth() === selectedDate.getMonth();
    });

    const filteredExpenses = props.expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getFullYear() === selectedDate.getFullYear() &&
               expenseDate.getMonth() === selectedDate.getMonth();
    });
    
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const summaryData = [
        { title: 'Monthly Revenue', value: totalRevenue, color: 'text-green-400', icon: '📈' },
        { title: 'Monthly Expenses', value: totalExpenses, color: 'text-red-400', icon: '📉' },
        { title: 'Monthly Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-blue-400' : 'text-red-400', icon: '💰' },
    ];
    
    const renderContent = () => {
        switch (activeSubTab) {
            case 'breakdown':
                return <MonthlyBreakdown bookings={filteredBookings} expenses={filteredExpenses} />;
            case 'expenses':
                return <ExpenseManager 
                    expenses={filteredExpenses}
                    onAdd={props.onAddExpense}
                    onUpdate={props.onUpdateExpense}
                    onDelete={props.onDeleteExpense}
                />;
            case 'inventory':
                 return <InventoryManager
                    inventory={props.inventory}
                    onAdd={props.onAddInventoryItem}
                    onUpdate={props.onUpdateInventoryItem}
                    onDelete={props.onDeleteInventoryItem}
                />;
            default: return null;
        }
    }

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 space-y-8">
            <header className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Financials & Stock</h2>
                 <button onClick={() => props.startTour('financials')} className="p-1.5 text-admin-dark-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Start Financials Tour">
                    <span>🎓</span>
                </button>
            </header>

            <section>
                <div data-tour-id="financials-month-navigator" className="flex items-center justify-between mb-4 bg-admin-dark-bg/50 p-2 rounded-lg">
                    <button onClick={() => handleMonthChange(-1)} className="px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">◀</button>
                    <h3 className="font-semibold text-lg text-white text-center">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => handleMonthChange(1)} className="px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">▶</button>
                </div>
                <div data-tour-id="financials-summary-cards" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaryData.map(item => (
                        <div key={item.title} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4">
                            <p className="text-sm text-admin-dark-text-secondary flex items-center gap-2">{item.icon} {item.title}</p>
                            <p className={`text-2xl font-bold mt-1 ${item.color}`}>R{item.value.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            <section data-tour-id="financials-yearly-chart">
                <YearlyProfitChart bookings={props.bookings} expenses={props.expenses} selectedYear={selectedDate.getFullYear()} />
            </section>
            
            <section>
                <div data-tour-id="financials-subtabs" className="flex items-center gap-2 bg-admin-dark-bg p-1 rounded-lg self-start">
                    {(['breakdown', 'expenses', 'inventory'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveSubTab(tab)} className={`w-full px-4 py-1.5 text-sm font-bold rounded-lg transition-colors capitalize ${activeSubTab === tab ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>{tab}</button>
                    ))}
                </div>
                {renderContent()}
            </section>
        </div>
    );
};

export default FinancialsManager;
