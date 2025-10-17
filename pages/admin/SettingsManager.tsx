import React, { useState } from 'react';
import { SocialLink, PortfolioItem, SpecialItem, Genre, Booking, Expense, InventoryItem } from '../../App';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface SettingsManagerProps {
  onSaveAllSettings: (settings: any) => Promise<void>;
  onClearAllData: () => Promise<void>;
  startTour: (tourKey: 'settings') => void;
  
  // Settings
  whatsAppNumber: string;
  companyName: string;
  logoUrl: string;
  aboutUsImageUrl: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  vatNumber: string;
  showroomTitle: string;
  showroomDescription: string;
  heroTattooGunImageUrl: string;
  isMaintenanceMode: boolean;
  apkUrl: string;

  // Data for backup
  portfolioData: PortfolioItem[];
  specialsData: SpecialItem[];
  showroomData: Genre[];
  bookings: Booking[];
  expenses: Expense[];
  inventory: InventoryItem[];
}

const SettingsManager: React.FC<SettingsManagerProps> = (props) => {
    // Local state for form fields
    const [settings, setSettings] = useState({
        companyName: props.companyName,
        whatsAppNumber: props.whatsAppNumber,
        address: props.address,
        phone: props.phone,
        email: props.email,
        showroomTitle: props.showroomTitle,
        showroomDescription: props.showroomDescription,
        bankName: props.bankName,
        accountNumber: props.accountNumber,
        branchCode: props.branchCode,
        accountType: props.accountType,
        vatNumber: props.vatNumber,
        isMaintenanceMode: props.isMaintenanceMode,
    });
    // State for image URLs and new files
    const [logo, setLogo] = useState<string | File>(props.logoUrl);
    const [aboutUsImage, setAboutUsImage] = useState<string | File>(props.aboutUsImageUrl);
    const [heroImage, setHeroImage] = useState<string | File>(props.heroTattooGunImageUrl);
    const [socialLinks, setSocialLinks] = useState<(SocialLink & { file?: File })[]>(props.socialLinks);
    const [apkFile, setApkFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({...prev, [id]: value}));
    };

    const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string | File>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleApkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          if (e.target.files[0].name.endsWith('.apk')) {
              setApkFile(e.target.files[0]);
          } else {
              alert('Please select a valid .apk file.');
              e.target.value = '';
          }
      }
    };
    
    const uploadFile = async (file: File, path: string): Promise<string> => {
        if (!(file instanceof File)) return file; // It's already a URL string
        const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const [logoUrl, aboutUsImageUrl, heroTattooGunImageUrl] = await Promise.all([
                uploadFile(logo as File, 'settings'),
                uploadFile(aboutUsImage as File, 'settings'),
                uploadFile(heroImage as File, 'settings'),
            ]);

            let finalApkUrl = props.apkUrl;
            if (apkFile) {
                finalApkUrl = await uploadFile(apkFile, 'mobile-app');
            }

            const finalSocialLinks = await Promise.all(
                socialLinks.map(async (link) => {
                    const iconUrl = link.file ? await uploadFile(link.file, 'social-icons') : link.icon;
                    return { id: link.id, url: link.url, icon: iconUrl };
                })
            );

            await props.onSaveAllSettings({
                ...settings,
                logoUrl,
                aboutUsImageUrl,
                heroTattooGunImageUrl,
                socialLinks: finalSocialLinks,
                apkUrl: finalApkUrl,
            });
            setSavedMessage('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Please check the console.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setSavedMessage(''), 3000);
        }
    };

    const handleAddSocialLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newLink = { id: Date.now().toString(), url: '', icon: URL.createObjectURL(file), file };
            setSocialLinks([...socialLinks, newLink]);
        }
    };
    
    const handleUpdateSocialLinkUrl = (id: string, url: string) => {
        setSocialLinks(socialLinks.map(link => link.id === id ? { ...link, url } : link));
    };
    
    const handleRemoveSocialLink = (id: string) => {
        setSocialLinks(socialLinks.filter(link => link.id !== id));
    };
    
    const getPreviewUrl = (media: string | File): string => {
        return (media instanceof File) ? URL.createObjectURL(media) : media;
    };
    
    const handleBackup = () => {
    try {
        const backupData = {
            settings: {
                companyName: props.companyName, logoUrl: props.logoUrl, aboutUsImageUrl: props.aboutUsImageUrl,
                whatsAppNumber: props.whatsAppNumber, address: props.address, phone: props.phone, email: props.email,
                socialLinks: props.socialLinks, bankName: props.bankName, accountNumber: props.accountNumber,
                branchCode: props.branchCode, accountType: props.accountType, vatNumber: props.vatNumber,
                showroomTitle: props.showroomTitle, showroomDescription: props.showroomDescription,
                heroTattooGunImageUrl: props.heroTattooGunImageUrl,
                isMaintenanceMode: props.isMaintenanceMode,
                apkUrl: props.apkUrl,
            },
            portfolioData: props.portfolioData, specialsData: props.specialsData, showroomData: props.showroomData,
            bookings: props.bookings, expenses: props.expenses, inventory: props.inventory,
        };
        
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `beautively-inked-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Backup downloaded successfully!');
    } catch (error) {
        console.error("Backup failed:", error);
        alert("An error occurred during backup. Check the console for details.");
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
      alert("Restore functionality is being refactored to work with the live database.");
      e.target.value = '';
  };


  return (
    <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Site Settings</h2>
            <button onClick={() => props.startTour('settings')} className="p-1.5 text-admin-dark-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Start Settings Tour">
                <span>🎓</span>
            </button>
        </header>
      <form onSubmit={handleSaveSettings} className="space-y-10">
        
        <section data-tour-id="settings-company-details">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🏢 Company Details</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Company Name </label>
              <input type="text" id="companyName" value={settings.companyName} onChange={handleInputChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Logo </label>
              <div className="flex items-center gap-4">
                {logo && <img src={getPreviewUrl(logo)} alt="Logo preview" className="w-16 h-16 rounded-lg bg-white/10 p-1 object-contain"/>}
                <input type="file" id="logo" accept="image/*" onChange={handleFileChange(setLogo)} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Artist Portrait (About Us Section) </label>
              <div className="flex items-center gap-4">
                {aboutUsImage && <img src={getPreviewUrl(aboutUsImage)} alt="Artist portrait preview" className="w-16 h-16 rounded-full bg-white/10 p-1 object-cover"/>}
                <input type="file" id="aboutUsImage" accept="image/*" onChange={handleFileChange(setAboutUsImage)} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
          </div>
        </section>

        <section data-tour-id="settings-page-content">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🎨 Homepage Content</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Hero Section Tattoo Gun Image </label>
              <div className="flex items-center gap-4">
                {heroImage && <img src={getPreviewUrl(heroImage)} alt="Tattoo gun preview" className="w-16 h-16 rounded-lg bg-white/10 p-1 object-contain"/>}
                <input type="file" id="heroTattooGunImage" accept="image/*" onChange={handleFileChange(setHeroImage)} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
            <div>
              <label htmlFor="showroomTitle" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Showroom Title </label>
              <input type="text" id="showroomTitle" value={settings.showroomTitle} onChange={handleInputChange} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
            <div>
              <label htmlFor="showroomDescription" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Showroom Description </label>
              <textarea id="showroomDescription" value={settings.showroomDescription} onChange={handleInputChange} rows={3} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">📱 Mobile App (APK)</h3>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-admin-dark-text-secondary mb-2">Current APK</label>
                {props.apkUrl ? (
                    <a href={props.apkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-admin-dark-primary hover:underline break-all">{props.apkUrl.split('%2F').pop()?.split('?')[0] || 'APK file'}</a>
                ) : (
                    <p className="text-sm text-admin-dark-text-secondary">No APK uploaded yet.</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-semibold text-admin-dark-text-secondary mb-2">{props.apkUrl ? 'Upload New APK' : 'Upload APK'}</label>
                <input type="file" id="apkFile" accept=".apk" onChange={handleApkFileChange} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
                {apkFile && <p className="text-sm text-admin-dark-text-secondary mt-2">New file selected: {apkFile.name}</p>}
            </div>
          </div>
        </section>

        <section data-tour-id="settings-contact-info">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">📞 Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" id="address" value={settings.address} onChange={handleInputChange} placeholder="Address" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="text" id="phone" value={settings.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="email" id="email" value={settings.email} onChange={handleInputChange} placeholder="Contact Email" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="text" id="whatsAppNumber" value={settings.whatsAppNumber} onChange={handleInputChange} placeholder="WhatsApp Number" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🌐 Social Media</h3>
            <div className="space-y-3">
                {socialLinks.map(link => (
                    <div key={link.id} className="flex items-center gap-3">
                        <img src={link.icon} alt="Social Icon" className="w-8 h-8 rounded-lg bg-white/10 p-1 object-contain"/>
                        <input type="text" value={link.url} onChange={(e) => handleUpdateSocialLinkUrl(link.id, e.target.value)} placeholder="https://..." className="flex-grow bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition"/>
                        <button type="button" onClick={() => handleRemoveSocialLink(link.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors">&times;</button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                 <label htmlFor="social_upload" className="inline-block text-sm text-admin-dark-primary bg-admin-dark-primary/20 hover:bg-admin-dark-primary/40 px-4 py-2 rounded-lg cursor-pointer transition-colors">Add Social Icon</label>
                 <input type="file" id="social_upload" accept="image/*" onChange={handleAddSocialLink} className="hidden" />
            </div>
        </section>

        <section data-tour-id="settings-billing-info">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">💰 Billing & Invoicing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" id="bankName" value={settings.bankName} onChange={handleInputChange} placeholder="Bank Name" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="text" id="accountType" value={settings.accountType} onChange={handleInputChange} placeholder="Account Type" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="text" id="accountNumber" value={settings.accountNumber} onChange={handleInputChange} placeholder="Account Number" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <input type="text" id="branchCode" value={settings.branchCode} onChange={handleInputChange} placeholder="Branch Code" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              <div className="md:col-span-2">
                 <input type="text" id="vatNumber" value={settings.vatNumber} onChange={handleInputChange} placeholder="VAT Number (Optional)" className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
            <button type="submit" disabled={isLoading} className="bg-admin-dark-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"> {isLoading ? 'Saving...' : 'Save Changes'} </button>
            {savedMessage && <span className="text-green-400 text-sm" role="status">{savedMessage}</span>}
        </div>
      </form>
      
      <section data-tour-id="settings-data-management" className="mt-12 pt-6 border-t border-admin-dark-border">
          <h3 className="text-lg font-semibold text-white mb-2">💾 Data Management</h3>
          <p className="text-sm text-admin-dark-text-secondary mb-4">Download a single JSON file containing all your site data, or restore your site from a backup file.</p>
          <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={handleBackup} className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-500/40 hover:text-white transition-colors">Backup All Data</button>
              <label htmlFor="restore-backup" className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-500/40 hover:text-white transition-colors cursor-pointer text-center">Restore from Backup</label>
              <input type="file" id="restore-backup" accept=".json" onChange={handleRestore} className="hidden" />
          </div>
      </section>

      <section data-tour-id="settings-danger-zone" className="mt-12 pt-6 border-t-2 border-red-500/30">
        <h3 className="text-lg font-semibold text-red-400 mb-2">🚨 Danger Zone</h3>
        <div className="space-y-6">
            <div>
                <p className="text-sm text-admin-dark-text-secondary mb-2">Activate maintenance mode to show a temporary "Under Maintenance" page to all public visitors. You will still be able to access this admin panel. Remember to click "Save Changes" at the top of the page to apply.</p>
                <div className="flex items-center gap-4 p-4 bg-admin-dark-bg/50 rounded-lg">
                    <button 
                        type="button"
                        onClick={() => setSettings(prev => ({...prev, isMaintenanceMode: !prev.isMaintenanceMode}))} 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.isMaintenanceMode ? 'bg-red-500' : 'bg-gray-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}/>
                    </button>
                    <span className={`font-semibold ${settings.isMaintenanceMode ? 'text-red-400' : 'text-admin-dark-text'}`}>
                        {settings.isMaintenanceMode ? 'Maintenance Mode will be ON' : 'Maintenance Mode will be OFF'}
                    </span>
                </div>
            </div>
            <div>
                <p className="text-sm text-admin-dark-text-secondary mb-2">This action is irreversible. Please be certain before proceeding.</p>
                <button type="button" onClick={props.onClearAllData} className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-500/40 hover:text-white transition-colors"> Clear All Live Data</button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsManager;
