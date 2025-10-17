import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../../App';
import StarIcon from '../../components/icons/StarIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressVideo } from '../../utils/mediaOptimizer';

const getMimeType = (fileOrUrl: File | string): string => {
    if (typeof fileOrUrl !== 'string') return fileOrUrl.type; // It's a File object
    if (fileOrUrl.startsWith('data:')) {
        const mime = fileOrUrl.substring(5, fileOrUrl.indexOf(';'));
        return mime || 'video/mp4';
    }
    const extension = fileOrUrl.split(/[#?]/)[0].split('.').pop()?.trim().toLowerCase();
    switch (extension) {
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'ogg': return 'video/ogg';
        default: return 'video/mp4';
    }
};

const getPreviewUrl = (media: string | File): string => {
    if (typeof media === 'string') return media;
    return URL.createObjectURL(media);
};

// --- Edit Form Component ---
const PortfolioItemEditForm = ({
  initialItem,
  onSave,
  onCancel,
  isAddingNew
}: {
  initialItem: Partial<PortfolioItem> & { id?: string };
  onSave: (itemData: any) => Promise<void>;
  onCancel: () => void;
  isAddingNew: boolean;
}) => {
  const [formData, setFormData] = useState<any>({
    title: initialItem.title || '',
    story: initialItem.story || '',
  });
  const [gallery, setGallery] = useState<(string | File)[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialItem.videoData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  
  useEffect(() => {
    const allImages = [initialItem.primaryImage, ...(initialItem.galleryImages || [])].filter(Boolean) as (string | File)[];
    setGallery(allImages);
    setPrimaryImage(initialItem.primaryImage || null);
    setVideoUrl(initialItem.videoData || null);
  }, [initialItem]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newGallery = [...gallery, ...files];
      setGallery(newGallery);
      if (!primaryImage) {
        setPrimaryImage(files[0]);
      }
    }
    e.target.value = '';
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const originalFile = e.target.files[0];
        setIsCompressing(true);
        setCompressionProgress(0);
        try {
            const compressedFile = await compressVideo(originalFile, (progress) => {
                setCompressionProgress(progress * 100);
            });
            setVideoFile(compressedFile);
            setVideoUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Video compression failed:", error);
            alert("Video compression failed. Uploading the original file instead.");
            // Fallback to original file
            setVideoFile(originalFile);
            setVideoUrl(URL.createObjectURL(originalFile));
        } finally {
            setIsCompressing(false);
        }
    }
    e.target.value = '';
  };
  
  const removeVideo = () => {
    if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl(null);
  };

  const removeImage = (imgToRemove: string | File) => {
    const newGallery = gallery.filter(img => img !== imgToRemove);
    setGallery(newGallery);
    if (primaryImage === imgToRemove) {
      setPrimaryImage(newGallery.length > 0 ? newGallery[0] : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryImage) {
      alert("Please upload and select a primary image (using the star icon).");
      return;
    }
    setIsLoading(true);

    const finalGallery = gallery.filter(img => img !== primaryImage);
    
    await onSave({
      ...initialItem,
      ...formData,
      primaryImage,
      galleryImages: finalGallery,
      videoFile,
    });
    setIsLoading(false);
  };
  
  const inputClasses = "w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2.5 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition";
  const fileInputClasses = "block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40";

  return (
    <form onSubmit={handleSubmit} className="bg-black/20 border border-admin-dark-border rounded-2xl p-6 my-4 space-y-6 animate-fade-in md:col-span-2">
      <header>
          <h3 className="text-xl font-bold text-white">{isAddingNew ? 'Create New Art Piece' : 'Edit Art Piece'}</h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={inputClasses} required />
              </div>
              <div>
                  <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Story</label>
                  <textarea value={formData.story} onChange={(e) => setFormData({...formData, story: e.target.value})} rows={5} className={inputClasses} required />
              </div>
          </div>
          <div className="space-y-2">
              <label className="block text-sm font-semibold text-admin-dark-text-secondary">Video (Optional)</label>
              {isCompressing ? (
                <div className="w-full bg-admin-dark-bg p-4 rounded-lg text-center">
                    <p className="text-sm text-admin-dark-text-secondary mb-2">Compressing video... Please wait.</p>
                    <div className="w-full bg-admin-dark-border rounded-full h-2.5">
                        <div className="bg-admin-dark-primary h-2.5 rounded-full" style={{ width: `${compressionProgress}%` }}></div>
                    </div>
                </div>
              ) : videoUrl ? (
                  <div className="relative">
                      <video className="w-full rounded-lg bg-black" controls src={videoUrl}></video>
                      <button type="button" onClick={removeVideo} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors" aria-label="Remove video">
                          <TrashIcon className="w-4 h-4" />
                      </button>
                  </div>
              ) : (
                  <>
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className={fileInputClasses} />
                    <p className="text-xs text-admin-dark-text-secondary mt-2">For best performance, upload videos optimized for web streaming (e.g., 360p resolution).</p>
                  </>
              )}
          </div>
      </div>
      
      <div>
          <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Image Collection</label>
          <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4">
              {gallery.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {gallery.map((img, index) => (
                          <div key={index} className="relative group aspect-square">
                              <img src={getPreviewUrl(img)} className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${primaryImage === img ? 'ring-4 ring-offset-2 ring-offset-admin-dark-bg ring-admin-dark-primary' : ''}`} alt="Gallery item" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button type="button" onClick={() => setPrimaryImage(img)} className="p-2 bg-black/50 text-white rounded-full hover:bg-admin-dark-primary" title="Set as Primary">
                                      <StarIcon className={`w-5 h-5 ${primaryImage === img ? 'text-yellow-400' : ''}`} />
                                  </button>
                                  <button type="button" onClick={() => removeImage(img)} className="p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80" title="Delete Image">
                                      <TrashIcon className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                      <p className="text-admin-dark-text-secondary">No images uploaded yet.</p>
                  </div>
              )}
               <div className="mt-4 pt-4 border-t border-admin-dark-border">
                   <label htmlFor="image-upload" className="block text-sm text-admin-dark-text-secondary mb-2">Add Images</label>
                   <input id="image-upload" type="file" multiple accept="image/png, image/jpeg" onChange={handleImageUpload} className={fileInputClasses} />
               </div>
          </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
          <button type="submit" disabled={isLoading || isCompressing} className="flex items-center gap-2 bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? 'Uploading...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
      </div>
    </form>
  );
};

// --- Main Manager Component ---
interface PortfolioManagerProps {
  portfolioData: PortfolioItem[];
  onAddPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  onUpdatePortfolioItem: (item: PortfolioItem) => Promise<void>;
  onDeletePortfolioItem: (id: string) => Promise<void>;
  startTour: (tourKey: 'art') => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolioData, onAddPortfolioItem, onUpdatePortfolioItem, onDeletePortfolioItem, startTour
}) => {
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const uploadFile = async (file: File, path: string): Promise<string> => {
        const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSaveItem = async (itemData: any) => {
        try {
            const { primaryImage, galleryImages, videoFile, ...restOfData } = itemData;

            const primaryImageUrl = primaryImage instanceof File ? await uploadFile(primaryImage, 'portfolio') : primaryImage;

            const galleryImageUrls = await Promise.all(
                (galleryImages || []).map((img: string | File) =>
                    img instanceof File ? uploadFile(img, 'portfolio') : Promise.resolve(img)
                )
            );
            
            const videoUrl = videoFile instanceof File ? await uploadFile(videoFile, 'portfolio_videos') : videoFile ? itemData.videoData : undefined;

            const finalData = { ...restOfData, primaryImage: primaryImageUrl, galleryImages: galleryImageUrls, videoData: videoUrl };
            
            if (isAddingNew) {
                const { id, ...newItemData } = finalData;
                await onAddPortfolioItem(newItemData);
            } else {
                await onUpdatePortfolioItem(finalData as PortfolioItem);
            }
        } catch (error) {
            console.error("Failed to save portfolio item:", error);
            alert("Error saving item. Check the console for details.");
        } finally {
            setEditingItem(null);
            setIsAddingNew(false);
        }
    };

    const handleAddNewItem = () => {
        setEditingItem({} as PortfolioItem); // Use empty object for form
        setIsAddingNew(true);
    };

    const handleDeleteItem = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this art piece? This will remove it from the database permanently.')) {
            await onDeletePortfolioItem(id);
        }
    };

    const handleToggleFeature = async (item: PortfolioItem) => {
        await onUpdatePortfolioItem({ ...item, featured: !item.featured });
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
                    {!(isAddingNew || editingItem) && (
                        <button data-tour-id="add-new-item-button" onClick={handleAddNewItem} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            <PlusIcon className="w-5 h-5"/>
                            Add New Item
                        </button>
                    )}
                </header>
                <div data-tour-id="portfolio-item-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(isAddingNew || editingItem) && 
                        <PortfolioItemEditForm 
                            initialItem={editingItem || {}} 
                            onSave={handleSaveItem} 
                            onCancel={() => { setEditingItem(null); setIsAddingNew(false); }} 
                            isAddingNew={isAddingNew}
                        />
                    }

                    {!editingItem && !isAddingNew && portfolioData.map(item => (
                        <div key={item.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4 flex flex-col justify-between gap-4">
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
                                    <span className="text-sm text-admin-dark-text-secondary">Feature</span>
                                </div>
                                <div className="flex gap-1 text-admin-dark-text-secondary">
                                    <button onClick={() => { setIsAddingNew(false); setEditingItem(item); }} className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors" aria-label={`Edit ${item.title}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete ${item.title}`}>
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioManager;