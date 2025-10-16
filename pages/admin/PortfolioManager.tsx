import React, { useState, useEffect } from 'react';
import { PortfolioItem, Genre } from '../../App';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const PortfolioItemEditForm = ({item, onSave, onCancel, onUpdate}: {item: Partial<PortfolioItem>, onSave: (e: React.FormEvent) => void, onCancel: () => void, onUpdate: (field: keyof PortfolioItem, value: any) => void}) => {
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdate(e.target.name as keyof PortfolioItem, e.target.value);
    };

    const handlePrimaryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const dataUrl = await fileToDataUrl(e.target.files[0]);
                onUpdate('primaryImage', dataUrl);
            } catch (error) { console.error(error); }
        }
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const dataUrl = await fileToDataUrl(e.target.files[0]);
                onUpdate('videoData', dataUrl);
            } catch (error) {
                console.error("Error processing video file:", error);
            }
        }
    };
    
    const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            try {
                const dataUrls = await Promise.all(Array.from(e.target.files).map(fileToDataUrl));
                const newGallery = [...(item.galleryImages || []), ...dataUrls];
                onUpdate('galleryImages', newGallery);
            } catch (error) { console.error(error); }
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = (item.galleryImages || []).filter((_, i) => i !== index);
        onUpdate('galleryImages', newGallery);
    };

    return (
    <form onSubmit={onSave} className="bg-black/20 border border-admin-dark-border rounded-lg p-6 my-4 space-y-4 animate-fade-in md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
                <input type="text" name="title" value={item.title || ''} onChange={handleTextChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
            </div>
             <div>
                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Video (Optional)</label>
                <input type="file" name="videoData" accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
                 {item.videoData && <video src={item.videoData} className="mt-2 rounded" width="100" autoPlay loop muted playsInline />}
            </div>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Story</label>
            <textarea name="story" value={item.story || ''} onChange={handleTextChange} rows={4} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-2 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none"/>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Primary Image</label>
            <div className="flex items-center gap-4">
                {item.primaryImage && <img src={item.primaryImage} alt="Primary preview" className="w-20 h-20 object-cover rounded-md bg-black/20"/>}
                <input type="file" name="primaryImage" accept="image/png, image/jpeg" onChange={handlePrimaryImageChange} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
            </div>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Gallery Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                {(item.galleryImages || []).map((img, index) => (
                    <div key={index} className="relative group">
                        <img src={img} className="w-full h-24 object-cover rounded-md"/>
                        <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                    </div>
                ))}
            </div>
            <input type="file" name="galleryImages" multiple accept="image/png, image/jpeg" onChange={handleGalleryImagesChange} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
        </div>
        <div className="flex gap-4 pt-2">
            <button type="submit" className="bg-admin-dark-primary text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">Save</button>
            <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-md font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
        </div>
    </form>
)};

const ShowroomManager: React.FC<{
  showroomData: Genre[];
  onShowroomUpdate: (data: Genre[]) => void;
  portfolioData: PortfolioItem[];
}> = ({ showroomData, onShowroomUpdate, portfolioData }) => {
    const [editingGenreId, setEditingGenreId] = useState<string | null>(null);
    const [editingGenreName, setEditingGenreName] = useState('');
    
    // Create a set of item IDs that are already in the showroom for quick lookup
    const showroomItemIds = new Set(showroomData.flatMap(g => g.items.map(i => i.id)));
    // Filter portfolio items that are not yet assigned to any genre
    const availablePortfolioItems = portfolioData.filter(p => !showroomItemIds.has(p.id));

    const handleAddNewGenre = () => {
        const newGenre: Genre = {
            id: Date.now().toString(),
            name: 'New Genre',
            items: [],
        };
        onShowroomUpdate([...showroomData, newGenre]);
    };

    const handleUpdateGenreName = (genreId: string) => {
        const updatedData = showroomData.map(g => g.id === genreId ? { ...g, name: editingGenreName } : g);
        onShowroomUpdate(updatedData);
        setEditingGenreId(null);
        setEditingGenreName('');
    };

    const handleDeleteGenre = (genreId: string) => {
        if(window.confirm('Are you sure you want to delete this genre?')) {
            onShowroomUpdate(showroomData.filter(g => g.id !== genreId));
        }
    };
    
    const handleDeleteItem = (genreId: string, itemId: string) => {
        if(window.confirm('Are you sure you want to remove this item from the genre?')) {
            const updatedShowroomData = showroomData.map(g => {
                if (g.id === genreId) {
                    return { ...g, items: g.items.filter(item => item.id !== itemId) };
                }
                return g;
            });
            onShowroomUpdate(updatedShowroomData);
        }
    };

    const handleAddItemFromPortfolio = (genreId: string, itemId: string) => {
        const itemToAdd = portfolioData.find(p => p.id === itemId);
        if (!itemToAdd) return;

        const updatedShowroomData = showroomData.map(g => {
            if (g.id === genreId) {
                // Avoid adding duplicates
                if (g.items.some(item => item.id === itemId)) return g;
                return { ...g, items: [...g.items, itemToAdd] };
            }
            return g;
        });
        onShowroomUpdate(updatedShowroomData);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-white">Showroom Genres</h3>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Organize portfolio items into genres for the showroom page.</p>
                </div>
                <button onClick={handleAddNewGenre} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Genre
                </button>
            </header>

            <div className="grid lg:grid-cols-2 gap-6">
                {showroomData.map(genre => (
                    <div key={genre.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            {editingGenreId === genre.id ? (
                                <input 
                                    type="text"
                                    value={editingGenreName}
                                    onChange={(e) => setEditingGenreName(e.target.value)}
                                    onBlur={() => handleUpdateGenreName(genre.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateGenreName(genre.id)}
                                    className="text-lg font-semibold bg-admin-dark-bg border-b-2 border-admin-dark-primary outline-none text-white"
                                    autoFocus
                                />
                            ) : (
                                <h4 className="text-lg font-semibold text-white">{genre.name}</h4>
                            )}
                            <div className="flex gap-1 text-admin-dark-text-secondary">
                                <button onClick={() => { setEditingGenreId(genre.id); setEditingGenreName(genre.name); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                </button>
                                <button onClick={() => handleDeleteGenre(genre.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-4 min-h-[50px]">
                            {genre.items.map(item => (
                                <div key={item.id} className="bg-admin-dark-bg p-2 rounded-md flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={item.primaryImage} alt={item.title} className="w-8 h-8 object-cover rounded"/>
                                        <p className="text-sm text-admin-dark-text">{item.title}</p>
                                    </div>
                                    <button onClick={() => handleDeleteItem(genre.id, item.id)} className="p-1 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {availablePortfolioItems.length > 0 && (
                            <div className="border-t border-admin-dark-border pt-3">
                                <p className="text-xs text-admin-dark-text-secondary mb-2">Add available item:</p>
                                <div className="flex flex-wrap gap-1">
                                    {availablePortfolioItems.map(item => (
                                        <button key={item.id} onClick={() => handleAddItemFromPortfolio(genre.id, item.id)} className="text-xs bg-admin-dark-bg text-admin-dark-text-secondary px-2 py-1 rounded hover:bg-admin-dark-primary/40 hover:text-white transition-colors">
                                            + {item.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ArtManagerProps {
    portfolioData: PortfolioItem[];
    onPortfolioUpdate: (data: PortfolioItem[]) => void;
    showroomData: Genre[];
    onShowroomUpdate: (data: Genre[]) => void;
}

const ArtManager: React.FC<ArtManagerProps> = ({ portfolioData, onPortfolioUpdate, showroomData, onShowroomUpdate }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'portfolio' | 'showroom'>('portfolio');

    const handleCancel = () => {
        setEditingId(null);
        setCurrentItem({});
        setIsAddingNew(false);
    };

    const handleEdit = (item: PortfolioItem) => {
        setEditingId(item.id);
        setCurrentItem(item);
        setIsAddingNew(false);
        window.scrollTo(0, 0);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedData;
        if (isAddingNew) {
            const newItem: PortfolioItem = {
                id: Date.now().toString(),
                title: currentItem.title || 'New Item',
                story: currentItem.story || '',
                primaryImage: currentItem.primaryImage || '',
                galleryImages: currentItem.galleryImages || [],
                videoData: currentItem.videoData,
                featured: false,
            };
            updatedData = [...portfolioData, newItem];
        } else {
            updatedData = portfolioData.map(item => item.id === editingId ? { ...item, ...currentItem } as PortfolioItem : item);
        }
        onPortfolioUpdate(updatedData);
        handleCancel();
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this item? This will also remove it from any showroom genre.')) {
            onPortfolioUpdate(portfolioData.filter(item => item.id !== id));
            // Also remove from showroom
            const updatedShowroom = showroomData.map(genre => ({
                ...genre,
                items: genre.items.filter(item => item.id !== id)
            }));
            onShowroomUpdate(updatedShowroom);
        }
    }
    
    const handleUpdateField = (field: keyof PortfolioItem, value: any) => {
        setCurrentItem(prev => ({...prev, [field]: value}));
    };

    const handleFeatureToggle = (id: string) => {
        const updatedData = portfolioData.map(pItem => 
            pItem.id === id ? { ...pItem, featured: !pItem.featured } : pItem
        );
        onPortfolioUpdate(updatedData);
    };

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6">
             <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                 <div>
                    <h2 className="text-xl font-bold text-white">Art Management</h2>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Manage portfolio pieces and organize them for display.</p>
                </div>
                <div className="flex items-center gap-2 bg-admin-dark-bg p-1 rounded-lg self-start">
                    <button onClick={() => setActiveSubTab('portfolio')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeSubTab === 'portfolio' ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>Portfolio</button>
                    <button onClick={() => setActiveSubTab('showroom')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeSubTab === 'showroom' ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>Showroom</button>
                </div>
            </header>
            
            {activeSubTab === 'portfolio' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => { setIsAddingNew(true); setEditingId('__new__'); setCurrentItem({}); window.scrollTo(0,0); }} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Add New Item
                        </button>
                    </div>

                    {(isAddingNew || editingId) && <PortfolioItemEditForm item={currentItem} onSave={handleSave} onCancel={handleCancel} onUpdate={handleUpdateField}/>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.map(item => (
                             <div key={item.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 overflow-hidden">
                                        <img src={item.primaryImage} alt={item.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-white truncate">{item.title}</p>
                                            {item.videoData && (
                                                <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 flex-shrink-0" title="Contains video">
                                                    Contains Video 🎥
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-admin-dark-text-secondary flex-shrink-0">
                                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label={`Edit ${item.title}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete ${item.title}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="border-t border-admin-dark-border pt-3">
                                    <label htmlFor={`feature-${item.id}`} className="flex items-center cursor-pointer justify-end gap-3">
                                        <span className="text-sm font-semibold text-admin-dark-text-secondary">Feature in Hero</span>
                                        <div className="relative">
                                            <input type="checkbox" id={`feature-${item.id}`} checked={!!item.featured} onChange={() => handleFeatureToggle(item.id)} className="sr-only peer" />
                                            <div className="block bg-admin-dark-bg w-12 h-6 rounded-full border border-admin-dark-border peer-checked:bg-admin-dark-primary peer-checked:border-admin-dark-primary transition"></div>
                                            <div className="dot absolute left-1 top-1 bg-gray-400 peer-checked:bg-white w-4 h-4 rounded-full transition-transform peer-checked:transform peer-checked:translate-x-6"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeSubTab === 'showroom' && (
                <ShowroomManager showroomData={showroomData} onShowroomUpdate={onShowroomUpdate} portfolioData={portfolioData} />
            )}
        </div>
    );
};

export default ArtManager;