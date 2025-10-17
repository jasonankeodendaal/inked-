import React, { useState, useEffect } from 'react';
import { Genre, ShowroomItem } from '../../App';
import TrashIcon from '../../components/icons/TrashIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressVideo } from '../../utils/mediaOptimizer';

const uploadShowroomFile = async (file: File, type: 'image' | 'video'): Promise<string> => {
    const storageRef = ref(storage, `showroom/${type}s/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

const getPreviewUrl = (media: string | File): string => {
    if (typeof media === 'string') return media;
    return URL.createObjectURL(media);
};


const ShowroomItemForm = ({
  initialItem,
  onSave,
  onCancel,
}: {
  initialItem: Partial<ShowroomItem>;
  onSave: (itemData: {
      id: string;
      title: string;
      images: (string | File)[];
      videoUrl?: string | File;
  }) => Promise<void>;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initialItem.title || '');
  const [images, setImages] = useState<(string | File)[]>(initialItem.images || []);
  const [video, setVideo] = useState<string | File | undefined>(initialItem.videoUrl);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  useEffect(() => {
    const objectUrls: string[] = [];
    const previews = images.map(img => {
        if (typeof img === 'string') return img;
        const url = URL.createObjectURL(img);
        objectUrls.push(url);
        return url;
    });
    setImagePreviews(previews);
    return () => {
        objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [images]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (video) {
        if (typeof video === 'string') {
            setVideoPreviewUrl(video);
        } else {
            objectUrl = URL.createObjectURL(video);
            setVideoPreviewUrl(objectUrl);
        }
    } else {
        setVideoPreviewUrl('');
    }
    return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    };
  }, [video]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const currentImageCount = images.length;
        if (currentImageCount + e.target.files.length > 5) {
            alert("You can only upload a maximum of 5 images per piece.");
            return;
        }
        setImages(prev => [...prev, ...Array.from(e.target.files)]);
    }
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
            setVideo(compressedFile);
        } catch (error) {
            console.error("Video compression failed:", error);
            alert("Video compression failed. Uploading the original file instead.");
            setVideo(originalFile);
        } finally {
            setIsCompressing(false);
        }
    }
  };

  const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => setVideo(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || images.length === 0) {
          alert("A title and at least one image are required.");
          return;
      }
      await onSave({
        id: initialItem.id || Date.now().toString(),
        title: title,
        images: images,
        videoUrl: video
      });
  };
  
  const inputClasses = "w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2.5 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="col-span-full bg-black/20 border border-admin-dark-border rounded-2xl p-6 my-4 space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-white">{initialItem.id ? 'Edit' : 'Add New'} Showroom Piece</h3>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Images ({images.length}/5)</label>
            <div className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4">
                <div className="grid grid-cols-5 gap-3 mb-4">
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={src} alt="preview" className="w-full h-full object-cover rounded-lg"/>
                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
                {images.length < 5 && (
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
                )}
            </div>
        </div>
        <div>
            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Video (Optional, 1 only)</label>
            {isCompressing ? (
                <div className="w-full bg-admin-dark-bg p-4 rounded-lg text-center">
                    <p className="text-sm text-admin-dark-text-secondary mb-2">Compressing video... Please wait.</p>
                    <div className="w-full bg-admin-dark-border rounded-full h-2.5">
                        <div className="bg-admin-dark-primary h-2.5 rounded-full" style={{ width: `${compressionProgress}%` }}></div>
                    </div>
                </div>
            ) : videoPreviewUrl ? (
                <div className="relative">
                    <video src={videoPreviewUrl} controls className="w-full max-w-xs rounded-lg bg-black"/>
                    <button type="button" onClick={removeVideo} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40"/>
            )}
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
            <button type="submit" disabled={isCompressing} className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 disabled:opacity-50">Save Piece</button>
            <button type="button" onClick={onCancel} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary">Cancel</button>
        </div>
    </form>
  )
}

interface ShowroomManagerProps {
  showroomData: Genre[];
  onAddShowroomGenre: (genre: Omit<Genre, 'id'>) => Promise<void>;
  onUpdateShowroomGenre: (genre: Genre) => Promise<void>;
  onDeleteShowroomGenre: (id: string) => Promise<void>;
  startTour: (tourKey: 'art') => void;
}

const ShowroomManager: React.FC<ShowroomManagerProps> = ({ 
  showroomData, 
  onAddShowroomGenre,
  onUpdateShowroomGenre,
  onDeleteShowroomGenre,
  startTour 
}) => {
    const [editingItem, setEditingItem] = useState<{item: Partial<ShowroomItem>, genreId: string} | null>(null);

    const handleAddGenre = async () => {
        const name = prompt("Enter new genre name:");
        if (name) {
            await onAddShowroomGenre({ name, items: [] });
        }
    };
    
    const handleDeleteGenre = async (genreId: string) => {
        if (window.confirm("Are you sure you want to delete this genre? The pieces inside will also be deleted from the showroom.")) {
            await onDeleteShowroomGenre(genreId);
        }
    };

    const handleSaveItem = async (itemData: {
        id: string;
        title: string;
        images: (string | File)[];
        videoUrl?: string | File;
    }) => {
        if (!editingItem) return;
        const { genreId } = editingItem;
        const genreToUpdate = showroomData.find(g => g.id === genreId);
        if (!genreToUpdate) return;
        
        try {
            const imageUrls = await Promise.all(
                itemData.images.map(img => img instanceof File ? uploadShowroomFile(img, 'image') : Promise.resolve(img))
            );
    
            let finalVideoUrl: string | undefined;
            if (itemData.videoUrl) {
                finalVideoUrl = itemData.videoUrl instanceof File
                    ? await uploadShowroomFile(itemData.videoUrl, 'video')
                    : itemData.videoUrl;
            }
    
            const finalItemData: ShowroomItem = {
                id: itemData.id,
                title: itemData.title,
                images: imageUrls,
                videoUrl: finalVideoUrl,
            };
    
            const itemExists = genreToUpdate.items.some(i => i.id === finalItemData.id);
            const updatedItems = itemExists
                ? genreToUpdate.items.map(i => i.id === finalItemData.id ? finalItemData : i)
                : [...genreToUpdate.items, finalItemData];
            
            await onUpdateShowroomGenre({ ...genreToUpdate, items: updatedItems });
            setEditingItem(null);
        } catch (error) {
            console.error("Error saving showroom item:", error);
            alert("An error occurred while saving. Check console.");
        }
    };

    const handleDeleteItem = async (genreId: string, itemId: string) => {
        if (window.confirm("Delete this showroom piece?")) {
            const genreToUpdate = showroomData.find(g => g.id === genreId);
            if(genreToUpdate) {
              const updatedItems = genreToUpdate.items.filter(i => i.id !== itemId);
              await onUpdateShowroomGenre({ ...genreToUpdate, items: updatedItems });
            }
        }
    };

    return (
    <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-white">Showroom Management</h2>
                <p className="text-sm text-admin-dark-text-secondary mt-1">Organize your portfolio into genres for the public 'Flash Wall'.</p>
            </div>
            <button data-tour-id="add-genre-button" onClick={handleAddGenre} className="flex items-center gap-2 bg-admin-dark-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                <PlusIcon className="w-5 h-5"/>
                Add Genre
            </button>
        </header>

        <div data-tour-id="showroom-genre-list" className="space-y-6">
            {showroomData.map(genre => (
                <div key={genre.id} className="bg-admin-dark-bg/50 border border-admin-dark-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-white">{genre.name}</h4>
                        <button onClick={() => handleDeleteGenre(genre.id)} className="p-2 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-full transition-colors" aria-label={`Delete genre ${genre.name}`}>
                            <TrashIcon className="w-4 h-4"/>
                        </button>
                    </div>

                    {editingItem?.genreId === genre.id && (
                        <ShowroomItemForm 
                            initialItem={editingItem.item}
                            onSave={handleSaveItem}
                            onCancel={() => setEditingItem(null)}
                        />
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                         {genre.items.map(item => (
                            <div key={item.id} className="relative group aspect-square">
                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-md"/>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                     <button onClick={() => setEditingItem({ item, genreId: genre.id })} className="p-2 bg-black/50 text-white rounded-full hover:bg-admin-dark-primary">
                                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"/></svg>
                                     </button>
                                     <button onClick={() => handleDeleteItem(genre.id, item.id)} className="p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80">
                                        <TrashIcon className="w-5 h-5"/>
                                     </button>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => setEditingItem({ item: {}, genreId: genre.id })} 
                            className="flex items-center justify-center aspect-square bg-admin-dark-bg border-2 border-dashed border-admin-dark-border rounded-lg text-admin-dark-text-secondary hover:bg-admin-dark-primary/20 hover:text-white transition-colors"
                        >
                            <PlusIcon className="w-8 h-8"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

export default ShowroomManager;