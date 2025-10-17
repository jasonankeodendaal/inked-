import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../../App';
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

const getMimeType = (url: string): string => {
    if (url.startsWith('data:')) {
        const mime = url.substring(5, url.indexOf(';'));
        return mime || 'video/mp4';
    }
    const extension = url.split(/[#?]/)[0].split('.').pop()?.trim().toLowerCase();
    switch (extension) {
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'ogg': return 'video/ogg';
        default: return 'video/mp4';
    }
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
  
  const inputClasses = "w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2.5 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition";
  const fileInputClasses = "block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40";

  return (
    <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-2xl p-6 my-4 space-y-6 animate-fade-in md:col-span-2">
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
                        <video className="w-full rounded-lg bg-black" controls>
                           <source src={videoData} type={getMimeType(videoData)} />
                        </video>
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
                                <img src={imgSrc} className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${primaryImage === imgSrc ? 'ring-4 ring-offset-2 ring-offset-admin-dark-bg ring-admin-dark-primary' : ''}`} alt="Gallery item" />
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
            <button type="submit" className="flex items-center gap-2 bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save
            </button>
            <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
        </div>
    </form>
  );
};


interface PortfolioManagerProps {
  portfolioData: PortfolioItem[];
  onAddPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  onUpdatePortfolioItem: (item: PortfolioItem) => void;
  onDeletePortfolioItem: (id: string) => void;
  startTour: (tourKey: 'art') => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolioData,
  onAddPortfolioItem,
  onUpdatePortfolioItem,
  onDeletePortfolioItem,
  startTour,
}) => {
    const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleEditItem = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsAddingNew(false);
    };

    const handleAddNewItem = () => {
        setEditingItem({});
        setIsAddingNew(true);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setIsAddingNew(false);
    };
    
    const handleSaveItem = (itemData: Partial<PortfolioItem>) => {
        if (isAddingNew) {
            const newItem: Omit<PortfolioItem, 'id'> = {
                title: itemData.title || 'New Piece',
                story: itemData.story || '',
                primaryImage: itemData.primaryImage || '',
                galleryImages: itemData.galleryImages || [],
                videoData: itemData.videoData,
                featured: false,
            };
            onAddPortfolioItem(newItem);
        } else {
            onUpdatePortfolioItem(itemData as PortfolioItem);
        }
        handleCancelEdit();
    };

    const handleDeleteItem = (id: string) => {
        if (window.confirm('Are you sure you want to delete this art piece? This will remove it from the database permanently.')) {
            onDeletePortfolioItem(id);
        }
    }

    const handleToggleFeature = (item: PortfolioItem) => {
        onUpdatePortfolioItem({ ...item, featured: !item.featured });
    };

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 space-y-8">
            <header className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Portfolio Management</h2>
                 <button onClick={() => startTour('art')} className="p-1.5 text-admin-dark-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Start Art Tour">
                    <span>🎓</span>
                </button>
            </header>
            
            <div>
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Portfolio Items</h3>
                        <p className="text-sm text-admin-dark-text-secondary mt-1">Manage individual art pieces with stories. Featured items appear on the homepage.</p>
                    </div>
                    {!editingItem && (
                        <button data-tour-id="add-new-item-button" onClick={handleAddNewItem} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            <PlusIcon className="w-5 h-5"/>
                            Add New Item
                        </button>
                    )}
                </header>
                <div data-tour-id="portfolio-item-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(isAddingNew && editingItem) && <PortfolioItemEditForm initialItem={editingItem} onSave={handleSaveItem} onCancel={handleCancelEdit} isAddingNew={true}/>}

                    {portfolioData.map(item => (
                        <React.Fragment key={item.id}>
                            {editingItem?.id === item.id ? (
                                <PortfolioItemEditForm initialItem={editingItem} onSave={handleSaveItem} onCancel={handleCancelEdit} isAddingNew={false}/>
                            ) : (
                                <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <img src={item.primaryImage} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>
                                        <div className="overflow-hidden">
                                            <p className="font-semibold text-white truncate">{item.title}</p>
                                            <p className="text-sm text-admin-dark-text-secondary truncate">{item.story}</p>
                                            {item.videoData && <span className="text-xs text-blue-400">Has Video</span>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-admin-dark-border pt-3">
                                        <div data-tour-id="feature-toggle" className="flex items-center gap-2">
                                            <button onClick={() => handleToggleFeature(item)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.featured ? 'bg-admin-dark-primary' : 'bg-gray-600'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.featured ? 'translate-x-6' : 'translate-x-1'}`}/>
                                            </button>
                                            <span className="text-sm text-admin-dark-text-secondary">Feature in Hero</span>
                                        </div>
                                        <div className="flex gap-1 text-admin-dark-text-secondary">
                                            <button onClick={() => handleEditItem(item)} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label={`Edit ${item.title}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete ${item.title}`}>
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioManager;
