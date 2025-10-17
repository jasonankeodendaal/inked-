import React, { useState } from 'react';
import { SpecialItem } from '../../App';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditForm = ({item, onSave, onCancel}: {item: Partial<SpecialItem>, onSave: (item: Partial<SpecialItem>, imageFile?: File) => Promise<void>, onCancel: () => void}) => {
    const [formData, setFormData] = useState(item);
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [imagePreview, setImagePreview] = useState(item.imageUrl || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(formData, imageFile);
        setIsLoading(false);
    };

    return (
    <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-2xl p-6 my-4 space-y-4 animate-fade-in md:col-span-2">
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Image</label>
            <div className="flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Special preview" className="w-20 h-20 object-cover rounded-lg bg-black/20"/>}
                <input type="file" name="imageUrl" accept="image/png, image/jpeg" onChange={handleImageUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Price Type</label>
                <select name="priceType" value={formData.priceType || 'none'} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                    <option value="none">None</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="percentage">Percentage Discount</option>
                </select>
            </div>
            {formData.priceType && formData.priceType !== 'none' && (
                <div>
                    <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">
                        {formData.priceType === 'percentage' ? 'Percentage (%)' : 'Price (R)'}
                    </label>
                    <input type="number" name="priceValue" value={formData.priceValue || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
                </div>
            )}
        </div>
         <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Details (one per line)</label>
            <textarea name="details" value={Array.isArray(formData.details) ? formData.details.join('\n') : ''} onChange={handleChange} rows={4} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none" placeholder="e.g., Includes free consultation"/>
        </div>
        {formData.priceType === 'percentage' && (
             <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Voucher Code (Optional)</label>
                <input type="text" name="voucherCode" value={formData.voucherCode || ''} onChange={handleChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
            </div>
        )}

        <div className="flex gap-4 pt-2">
            <button type="submit" disabled={isLoading} className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Special'}
            </button>
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
  specialsData, onAddSpecialItem, onUpdateSpecialItem, onDeleteSpecialItem
}) => {
    const [editingItem, setEditingItem] = useState<SpecialItem | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEditingItem({} as SpecialItem);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setIsAddingNew(false);
    };

    const handleSave = async (itemData: Partial<SpecialItem>, imageFile?: File) => {
        try {
            let imageUrl = itemData.imageUrl || '';
            if (imageFile) {
                const storageRef = ref(storage, `specials/${Date.now()}-${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const processedItem = {
                ...itemData,
                imageUrl,
                priceValue: itemData.priceValue ? parseFloat(String(itemData.priceValue)) : undefined,
                details: typeof (itemData.details as any) === 'string'
                    ? (itemData.details as any).split('\n').map((s: string) => s.trim()).filter(Boolean)
                    : itemData.details,
            };
            if (processedItem.priceType !== 'percentage') {
                processedItem.voucherCode = undefined;
            }

            if (isAddingNew) {
                await onAddSpecialItem(processedItem as Omit<SpecialItem, 'id'>);
            } else if (editingItem) {
                await onUpdateSpecialItem({ ...processedItem, id: editingItem.id } as SpecialItem);
            }
        } catch (error) {
            console.error("Failed to save special:", error);
            alert("Error saving special offer. Please check console.");
        } finally {
            handleCancel();
        }
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this special?')) {
            await onDeleteSpecialItem(id);
        }
    }

    const showForm = isAddingNew || editingItem;

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                 <div>
                    <h2 className="text-xl font-bold text-white">Specials Manager</h2>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Manage current flash designs and special offers.</p>
                </div>
                {!showForm && (
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add New Special
                    </button>
                )}
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showForm && (
                    <EditForm 
                        item={editingItem || {}} 
                        onSave={handleSave} 
                        onCancel={handleCancel}
                    />
                )}

                {!showForm && specialsData.map(item => (
                    <div key={item.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>
                            <div>
                                <p className="font-semibold text-white">{item.title}</p>
                                <p className="text-sm text-admin-dark-text-secondary">{item.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 text-admin-dark-text-secondary self-end">
                            <button onClick={() => { setIsAddingNew(false); setEditingItem(item); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label={`Edit ${item.title}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete ${item.title}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecialsManager;