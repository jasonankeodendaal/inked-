import React, { useState, useEffect } from 'react';
import { PortfolioItem, Genre } from '../../App';
import StarIcon from '../../components/icons/StarIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PlusIcon from '../../components/icons/PlusIcon';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const PortfolioItemEditForm = ({
  initialItem,
  onSave,
  onCancel,
  isAddingNew
}: {
  initialItem: Partial<PortfolioItem>;
  onSave: (itemData: Partial<PortfolioItem>) => void;
  onCancel: () => void;
  isAddingNew: boolean;
}) => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [videoData, setVideoData] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialItem.title || '');
    setStory(initialItem.story || '');
    setVideoData(initialItem.videoData || null);
    const allImages = [initialItem.primaryImage, ...(initialItem.galleryImages || [])].filter(Boolean) as string[];
    setGallery(allImages);
    setPrimaryImage(initialItem.primaryImage || null);
  }, [initialItem]);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 5) {
        alert("Batch Upload Notice: You've selected more than 5 images. They will all be added.");
      }
      try {
        const dataUrls = await Promise.all(Array.from(e.target.files).map(fileToDataUrl));
        setGallery(prev => [...prev, ...dataUrls]);
        // If no primary image is set, make the first uploaded one the primary.
        if (!primaryImage) {
          setPrimaryImage(dataUrls[0]);
        }
      } catch (error) { console.error("Error processing images:", error); }
      e.target.value = ''; // Reset file input
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const dataUrl = await fileToDataUrl(e.target.files[0]);
        setVideoData(dataUrl);
      } catch (error) { console.error("Error processing video:", error); }
    } else {
        setVideoData(null);
    }
    e.target.value = ''; // Reset file input
  };

  const removeImage = (imgToRemove: string) => {
    const newGallery = gallery.filter(img => img !== imgToRemove);
    setGallery(newGallery);
    // If the removed image was the primary one, select a new primary.
    if (primaryImage === imgToRemove) {
      setPrimaryImage(newGallery.length > 0 ? newGallery[0] : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryImage && gallery.length > 0) {
        alert("Please select a primary image for this portfolio item by clicking the star icon.");
        return;
    }
    const finalGalleryImages = gallery.filter(img => img !== primaryImage);
    onSave({ ...initialItem, title, story, primaryImage: primaryImage || '', galleryImages: finalGalleryImages, videoData: videoData || undefined });
  };
  
  const inputClasses = "w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-2.5 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition";
  const fileInputClasses = "block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40";

  return (
    <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-lg p-6 my-4 space-y-6 animate-fade-in md:col-span-2">
        <header>
            <h3 className="text-xl font-bold text-white">{isAddingNew ? 'Create New Art Piece' : 'Edit Art Piece'}</h3>
            <p className="text-sm text-admin-dark-text-secondary mt-1">{isAddingNew ? "Upload a batch of images and a video to create a new portfolio item." : "Modify the details of this existing art piece."}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
                    <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Story</label>
                    <textarea name="story" value={story} onChange={(e) => setStory(e.target.value)} rows={5} className={inputClasses} required />
                </div>
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-admin-dark-text-secondary">Video (Optional)</label>
                {videoData ? (
                    <div className="relative">
                        <video src={videoData} className="w-full rounded-lg bg-black" controls />
                        <button type="button" onClick={() => setVideoData(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors" aria-label="Remove video">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <input type="file" name="videoData" accept="video/*" onChange={handleVideoUpload} className={fileInputClasses} />
                )}
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Image Collection</label>
            <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4">
                {gallery.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {gallery.map((imgSrc) => (
                            <div key={imgSrc} className="relative group aspect-square">
                                <img src={imgSrc} className={`w-full h-full object-cover rounded-md transition-all duration-300 ${primaryImage === imgSrc ? 'ring-4 ring-offset-2 ring-offset-admin-dark-bg ring-admin-dark-primary' : ''}`} alt="Gallery item" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => setPrimaryImage(imgSrc)} className="p-2 bg-black/50 text-white rounded-full hover:bg-admin-dark-primary" title="Set as Primary">
                                        <StarIcon className={`w-5 h-5 ${primaryImage === imgSrc ? 'text-yellow-400' : ''}`} />
                                    </button>
                                    <button type="button" onClick={() => removeImage(imgSrc)} className="p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80" title="Delete Image">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-admin-dark-text-secondary">No images uploaded yet.</p>
                        <p className="text-xs text-gray-500 mt-1">Start by adding images below.</p>
                    </div>
                )}
                 <div className="mt-4 pt-4 border-t border-admin-dark-border">
                     <label htmlFor="image-upload" className="block text-sm text-admin-dark-text-secondary mb-2">Add Images to Collection (Recommended: up to 5 at a time)</label>
                     <input id="image-upload" type="file" name="galleryImages" multiple accept="image/png, image/jpeg" onChange={handleImageUpload} className={fileInputClasses} />
                 </div>
            </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
            <button type="submit" className="flex items-center gap-2 bg-admin-dark-primary text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save
            </button>
            <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-md font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
        </div>
    </form>
  );
};


const ShowroomManager: React.FC<{
  showroomData: Genre[];
  onShowroomUpdate: (data: Genre[]) => void;
  portfolioData: PortfolioItem[];
}> = ({ showroomData, onShowroomUpdate, portfolioData }) => {
    const [editingGenreId, setEditingGenreId] = useState<string | null>(null);
    const [editingGenreName, setEditingGenreName] = useState('');
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [draggedGenreId, setDraggedGenreId] = useState<string | null>(null);

    const showroomItemIds = new Set(showroomData.flatMap(g => g.items.map(i => i.id)));
    const availablePortfolioItems = portfolioData.filter(p => !showroomItemIds.has(p.id));

    const handleAddNewGenre = () => {
        const newGenre: Genre = { id: Date.now().toString(), name: 'New Genre', items: [] };
        onShowroomUpdate([...showroomData, newGenre]);
    };

    const handleUpdateGenreName = (genreId: string) => {
        onShowroomUpdate(showroomData.map(g => g.id === genreId ? { ...g, name: editingGenreName } : g));
        setEditingGenreId(null);
    };

    const handleDeleteGenre = (genreId: string) => {
        if (window.confirm('Are you sure you want to delete this genre?')) {
            onShowroomUpdate(showroomData.filter(g => g.id !== genreId));
        }
    };

    const handleAddItem = (genreId: string, itemId: string) => {
        const itemToAdd = portfolioData.find(p => p.id === itemId);
        if (itemToAdd) {
            onShowroomUpdate(showroomData.map(g => g.id === genreId ? { ...g, items: [...g.items, itemToAdd] } : g));
        }
    };
    
    const handleRemoveItem = (genreId: string, itemId: string) => {
        onShowroomUpdate(showroomData.map(g => g.id === genreId ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g));
    };

    // Drag and Drop Handlers
    const handleGenreDragStart = (e: React.DragEvent, genreId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedGenreId(genreId);
    };
    const handleGenreDrop = (e: React.DragEvent, targetGenreId: string) => {
        e.preventDefault();
        if (!draggedGenreId || draggedGenreId === targetGenreId) return;

        const reordered = [...showroomData];
        const draggedIndex = reordered.findIndex(g => g.id === draggedGenreId);
        const targetIndex = reordered.findIndex(g => g.id === targetGenreId);
        const [draggedGenre] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedGenre);
        onShowroomUpdate(reordered);
    };
    
    const handleItemDragStart = (e: React.DragEvent, itemId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItemId(itemId);
    };
    const handleItemDrop = (e: React.DragEvent, targetGenreId: string) => {
        e.preventDefault();
        if (!draggedItemId) return;
        
        let itemToMove: PortfolioItem | undefined;
        let sourceGenreId: string | undefined;

        // Find and remove item from source genre
        const tempShowroomData = showroomData.map(g => {
            const item = g.items.find(i => i.id === draggedItemId);
            if (item) {
                itemToMove = item;
                sourceGenreId = g.id;
                return { ...g, items: g.items.filter(i => i.id !== draggedItemId) };
            }
            return g;
        });
        
        if (itemToMove) {
            // Add item to target genre
            const finalShowroomData = tempShowroomData.map(g => {
                if (g.id === targetGenreId) {
                    return { ...g, items: [...g.items, itemToMove!] };
                }
                return g;
            });
            onShowroomUpdate(finalShowroomData);
        }
        setDraggedItemId(null);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-white">Showroom Genres</h3>
                    <p className="text-sm text-admin-dark-text-secondary mt-1">Organize portfolio items into genres. Drag to reorder items and genres.</p>
                </div>
                <button onClick={handleAddNewGenre} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5" />
                    Add Genre
                </button>
            </header>

            <div className="grid lg:grid-cols-2 gap-6">
                {showroomData.map(genre => (
                    <div 
                        key={genre.id} 
                        draggable
                        onDragStart={e => handleGenreDragStart(e, genre.id)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleGenreDrop(e, genre.id)}
                        onDragEnd={() => setDraggedGenreId(null)}
                        className={`bg-admin-dark-bg/50 border border-admin-dark-border rounded-xl p-4 transition-all duration-300 ${draggedGenreId === genre.id ? 'opacity-30' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 cursor-move">
                            {editingGenreId === genre.id ? (
                                <input type="text" value={editingGenreName} onChange={(e) => setEditingGenreName(e.target.value)} onBlur={() => handleUpdateGenreName(genre.id)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateGenreName(genre.id)} className="text-lg font-semibold bg-admin-dark-bg border-b-2 border-admin-dark-primary outline-none text-white" autoFocus />
                            ) : (
                                <h4 className="text-lg font-semibold text-white">{genre.name}</h4>
                            )}
                            <div className="flex gap-1 text-admin-dark-text-secondary">
                                <button onClick={() => { setEditingGenreId(genre.id); setEditingGenreName(genre.name); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                </button>
                                <button onClick={() => handleDeleteGenre(genre.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div onDragOver={e => e.preventDefault()} onDrop={e => handleItemDrop(e, genre.id)} className="space-y-2 mb-4 min-h-[50px] bg-admin-dark-bg p-2 rounded-md border-2 border-dashed border-transparent">
                            {genre.items.map(item => (
                                <div key={item.id} draggable onDragStart={e => handleItemDragStart(e, item.id)} onDragEnd={() => setDraggedItemId(null)} className={`bg-admin-dark-bg/80 p-2 rounded-md flex items-center justify-between cursor-move transition-opacity ${draggedItemId === item.id ? 'opacity-30' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <img src={item.primaryImage} alt={item.title} className="w-8 h-8 object-cover rounded"/>
                                        <p className="text-sm text-admin-dark-text">{item.title}</p>
                                    </div>
                                    <button onClick={() => handleRemoveItem(genre.id, item.id)} className="p-1 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors">
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
                                        <button key={item.id} onClick={() => handleAddItem(genre.id, item.id)} className="text-xs bg-admin-dark-bg text-admin-dark-text-secondary px-2 py-1 rounded hover:bg-admin-dark-primary/40 hover:text-white transition-colors">
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

    const handleSave = (savedItemData: Partial<PortfolioItem>) => {
        let updatedData;
        if (isAddingNew) {
            const newItem: PortfolioItem = {
                id: Date.now().toString(),
                title: savedItemData.title || 'New Item',
                story: savedItemData.story || '',
                primaryImage: savedItemData.primaryImage || '',
                galleryImages: savedItemData.galleryImages || [],
                videoData: savedItemData.videoData,
                featured: false, // Default featured to false
            };
            updatedData = [...portfolioData, newItem];
        } else {
            // When editing, we merge the saved data with the existing item to ensure we don't lose properties like `id` and `featured`.
            updatedData = portfolioData.map(item => 
                item.id === editingId ? { ...item, ...savedItemData } as PortfolioItem : item
            );
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
                            <PlusIcon className="w-5 h-5" />
                            Add New Item
                        </button>
                    </div>

                    {(isAddingNew || editingId) && <PortfolioItemEditForm initialItem={currentItem} onSave={handleSave} onCancel={handleCancel} isAddingNew={isAddingNew} />}
                    
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
                                            <TrashIcon className="w-5 h-5" />
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