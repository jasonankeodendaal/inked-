import React, { useState } from 'react';
import { SpecialItem } from '../../App';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const EditForm = ({item, onSave, onCancel, onChange}: {item: Partial<SpecialItem>, onSave: (e: React.FormEvent) => Promise<void>, onCancel: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void}) => {
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const dataUrl = await fileToDataUrl(e.target.files[0]);
                const syntheticEvent = { target: { name: 'imageUrl', value: dataUrl } } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            } catch (error) {
                console.error("Failed to read image file:", error);
            }
        }
    };

    return (
    <form onSubmit={onSave} className="bg-black/20 border border-admin-dark-border rounded-2xl p-6 my-4 space-y-4 animate-fade-in md:col-span-2">
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
            <input type="text" name="title" value={item.title || ''} onChange={onChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Description</label>
            <textarea name="description" value={item.description || ''} onChange={onChange} rows={3} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Image</label>
            <div className="flex items-center gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt="Special preview" className="w-20 h-20 object-cover rounded-lg bg-black/20"/>}
                <input type="file" name="imageUrl" accept="image/png, image/jpeg" onChange={handleImageUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Price Type</label>
                <select name="priceType" value={item.priceType || 'none'} onChange={onChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                    <option value="none">None</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="percentage">Percentage Discount</option>
                </select>
            </div>
            {item.priceType && item.priceType !== 'none' && (
                <div>
                    <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">
                        {item.priceType === 'percentage' ? 'Percentage (%)' : 'Price (R)'}
                    </label>
                    <input type="number" name="priceValue" value={item.priceValue || ''} onChange={onChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
                </div>
            )}
        </div>
         <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Details (one per line)</label>
            <textarea name="details" value={Array.isArray(item.details) ? item.details.join('\n') : ''} onChange={onChange} rows={4} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" placeholder="e.g., Includes free consultation"/>
        </div>
        {item.priceType === 'percentage' && (
             <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Voucher Code (Optional)</label>
                <input type="text" name="voucherCode" value={item.voucherCode || ''} onChange={onChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
            </div>
        )}

        <div className="flex gap-4 pt-2">
            <button type="submit" className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Save Special</button>
            <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
        </div>
    </form>
)};

interface SpecialsManagerProps {
  specialsData: SpecialItem[];
  onAddSpecialItem: (item: Omit<SpecialItem, 'id'>) => Promise<void>;
  onUpdateSpecialItem: (item: SpecialItem) => Promise<void>;
  onDeleteSpecialItem: (id: string) => Promise<void>;
}

const SpecialsManager: React.FC<SpecialsManagerProps> = ({ 
  specialsData, 
  onAddSpecialItem,
  onUpdateSpecialItem,
  onDeleteSpecialItem
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentItem, setCurrentItem] = useState<Partial<SpecialItem>>({
        priceType: 'none',
        details: []
    });
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleEdit = (item: SpecialItem) => {
        setEditingId(item.id);
        setCurrentItem(item);
        setIsAddingNew(false);
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEditingId('__new__');
        setCurrentItem({
            title: '', description: '', imageUrl: '', priceType: 'none',
            priceValue: 0, details: [], voucherCode: '',
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setCurrentItem({});
        setIsAddingNew(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const processedItem: Partial<SpecialItem> = {
            ...currentItem,
            priceValue: currentItem.priceValue ? parseFloat(String(currentItem.priceValue)) : undefined,
            details: typeof (currentItem.details as any) === 'string'
                ? (currentItem.details as any).split('\n').map((s: string) => s.trim()).filter(Boolean)
                : currentItem.details,
        };
        
        if (processedItem.priceType !== 'percentage') {
            processedItem.voucherCode = undefined;
        }

        if (isAddingNew) {
            await onAddSpecialItem(processedItem as Omit<SpecialItem, 'id'>);
        } else {
            await onUpdateSpecialItem({ ...processedItem, id: editingId } as SpecialItem);
        }
        handleCancel();
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this special?')) {
            await onDeleteSpecialItem(id);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                 <div>
                    <h2 className="text-xl font-bold text-white">Specials Manager</h2>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Manage current flash designs and special offers.</p>
                </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add New Special
                </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAddingNew && editingId === '__new__' && <EditForm item={currentItem} onSave={handleSave} onCancel={handleCancel} onChange={handleInputChange}/>}

                {specialsData.map(item => (
                    <React.Fragment key={item.id}>
                        {editingId === item.id ? (
                           <EditForm item={currentItem} onSave={handleSave} onCancel={handleCancel} onChange={handleInputChange}/>
                        ) : (
                            <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-white">{item.title}</p>
                                        <p className="text-sm text-admin-dark-text-secondary">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-admin-dark-text-secondary self-end">
                                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label={`Edit ${item.title}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete ${item.title}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default SpecialsManager;
