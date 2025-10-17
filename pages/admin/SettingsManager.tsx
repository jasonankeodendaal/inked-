import React, { useState } from 'react';
import { SocialLink, PortfolioItem, SpecialItem, Genre, Booking, Expense, InventoryItem } from '../../App';

interface SettingsManagerProps {
  onSaveAllSettings: (settings: any) => void;
  onClearAllData: () => void;
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

  // Data for backup
  portfolioData: PortfolioItem[];
  specialsData: SpecialItem[];
  showroomData: Genre[];
  bookings: Booking[];
  expenses: Expense[];
  inventory: InventoryItem[];
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const SettingsManager: React.FC<SettingsManagerProps> = (props) => {
  const [localCompanyName, setLocalCompanyName] = useState(props.companyName);
  const [localLogoUrl, setLocalLogoUrl] = useState(props.logoUrl);
  const [localAboutUsImageUrl, setLocalAboutUsImageUrl] = useState(props.aboutUsImageUrl);
  const [localWhatsAppNumber, setLocalWhatsAppNumber] = useState(props.whatsAppNumber);
  const [localAddress, setLocalAddress] = useState(props.address);
  const [localPhone, setLocalPhone] = useState(props.phone);
  const [localEmail, setLocalEmail] = useState(props.email);
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialLink[]>(props.socialLinks);
  
  // Page Content state
  const [localShowroomTitle, setLocalShowroomTitle] = useState(props.showroomTitle);
  const [localShowroomDescription, setLocalShowroomDescription] = useState(props.showroomDescription);
  const [localHeroTattooGunImageUrl, setLocalHeroTattooGunImageUrl] = useState(props.heroTattooGunImageUrl);

  // New billing state
  const [localBankName, setLocalBankName] = useState(props.bankName);
  const [localAccountNumber, setLocalAccountNumber] = useState(props.accountNumber);
  const [localBranchCode, setLocalBranchCode] = useState(props.branchCode);
  const [localAccountType, setLocalAccountType] = useState(props.accountType);
  const [localVatNumber, setLocalVatNumber] = useState(props.vatNumber);

  const [savedMessage, setSavedMessage] = useState('');
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const allSettings = {
        companyName: localCompanyName,
        logoUrl: localLogoUrl,
        aboutUsImageUrl: localAboutUsImageUrl,
        whatsAppNumber: localWhatsAppNumber,
        address: localAddress,
        phone: localPhone,
        email: localEmail,
        socialLinks: localSocialLinks,
        bankName: localBankName,
        accountNumber: localAccountNumber,
        branchCode: localBranchCode,
        accountType: localAccountType,
        vatNumber: localVatNumber,
        showroomTitle: localShowroomTitle,
        showroomDescription: localShowroomDescription,
        heroTattooGunImageUrl: localHeroTattooGunImageUrl,
    };
    props.onSaveAllSettings(allSettings);

    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const dataUrl = await fileToDataUrl(e.target.files[0]);
          setLocalLogoUrl(dataUrl);
      }
  };
  
  const handleAboutUsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const dataUrl = await fileToDataUrl(e.target.files[0]);
          setLocalAboutUsImageUrl(dataUrl);
      }
  };

  const handleHeroTattooGunImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const dataUrl = await fileToDataUrl(e.target.files[0]);
          setLocalHeroTattooGunImageUrl(dataUrl);
      }
  };

  const handleAddSocialLink = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const icon = await fileToDataUrl(e.target.files[0]);
          const newLink: SocialLink = { id: Date.now().toString(), url: '', icon };
          setLocalSocialLinks([...localSocialLinks, newLink]);
          e.target.value = ''; // Reset file input
      }
  };
  
  const handleUpdateSocialLink = (id: string, url: string) => {
      setLocalSocialLinks(localSocialLinks.map(link => link.id === id ? { ...link, url } : link));
  };
  
  const handleRemoveSocialLink = (id: string) => {
      setLocalSocialLinks(localSocialLinks.filter(link => link.id !== id));
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
      // This functionality should be handled in App.tsx now to update the DB
      // For now, this is a placeholder. A full implementation would involve
      // passing a restore function down from App.tsx.
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
        
        {/* Company Details Section */}
        <section data-tour-id="settings-company-details">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🏢 Company Details</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Company Name </label>
              <input type="text" id="companyName" value={localCompanyName} onChange={(e) => setLocalCompanyName(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Logo </label>
              <div className="flex items-center gap-4">
                {localLogoUrl && <img src={localLogoUrl} alt="Logo preview" className="w-16 h-16 rounded-lg bg-white/10 p-1 object-contain"/>}
                <input type="file" id="logo" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
            <div>
              <label htmlFor="aboutUsImage" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Artist Portrait (About Us Section) </label>
              <div className="flex items-center gap-4">
                {localAboutUsImageUrl && <img src={localAboutUsImageUrl} alt="Artist portrait preview" className="w-16 h-16 rounded-full bg-white/10 p-1 object-cover"/>}
                <input type="file" id="aboutUsImage" accept="image/png, image/jpeg" onChange={handleAboutUsImageUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
          </div>
        </section>

        {/* Page Content Section */}
        <section data-tour-id="settings-page-content">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🎨 Homepage Content</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="heroTattooGunImage" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Hero Section Tattoo Gun Image </label>
              <div className="flex items-center gap-4">
                {localHeroTattooGunImageUrl && <img src={localHeroTattooGunImageUrl} alt="Tattoo gun preview" className="w-16 h-16 rounded-lg bg-white/10 p-1 object-contain"/>}
                <input type="file" id="heroTattooGunImage" accept="image/png, image/jpeg, image/webp" onChange={handleHeroTattooGunImageUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
            <div>
              <label htmlFor="showroomTitle" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Showroom Title </label>
              <input type="text" id="showroomTitle" value={localShowroomTitle} onChange={(e) => setLocalShowroomTitle(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
            <div>
              <label htmlFor="showroomDescription" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Showroom Description </label>
              <textarea id="showroomDescription" value={localShowroomDescription} onChange={(e) => setLocalShowroomDescription(e.target.value)} rows={3} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section data-tour-id="settings-contact-info">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">📞 Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Address </label>
                  <input type="text" id="address" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Phone Number </label>
                  <input type="text" id="phone" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Contact Email </label>
                  <input type="email" id="email" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="whatsAppNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> WhatsApp Number </label>
                  <input type="text" id="whatsAppNumber" value={localWhatsAppNumber} onChange={(e) => setLocalWhatsAppNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
                  <p className="text-xs text-admin-dark-text-secondary mt-2">No symbols (e.g., 27795904162)</p>
              </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🌐 Social Media</h3>
            <div className="space-y-3">
                {localSocialLinks.map(link => (
                    <div key={link.id} className="flex items-center gap-3">
                        <img src={link.icon} alt="Social Icon" className="w-8 h-8 rounded-lg bg-white/10 p-1 object-contain"/>
                        <input type="text" value={link.url} onChange={(e) => handleUpdateSocialLink(link.id, e.target.value)} placeholder="https://..." className="flex-grow bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition"/>
                        <button type="button" onClick={() => handleRemoveSocialLink(link.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors">&times;</button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                 <label htmlFor="social_upload" className="inline-block text-sm text-admin-dark-primary bg-admin-dark-primary/20 hover:bg-admin-dark-primary/40 px-4 py-2 rounded-lg cursor-pointer transition-colors">Add Social Icon</label>
                 <input type="file" id="social_upload" accept="image/png, image/jpeg, image/svg+xml" onChange={handleAddSocialLink} className="hidden" />
            </div>
        </section>

        {/* Billing Information Section */}
        <section data-tour-id="settings-billing-info">
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">💰 Billing & Invoicing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="bankName" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Bank Name </label>
                  <input type="text" id="bankName" value={localBankName} onChange={(e) => setLocalBankName(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
               <div>
                  <label htmlFor="accountType" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Account Type </label>
                  <input type="text" id="accountType" value={localAccountType} onChange={(e) => setLocalAccountType(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="accountNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Account Number </label>
                  <input type="text" id="accountNumber" value={localAccountNumber} onChange={(e) => setLocalAccountNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="branchCode" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Branch Code </label>
                  <input type="text" id="branchCode" value={localBranchCode} onChange={(e) => setLocalBranchCode(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div className="md:col-span-2">
                  <label htmlFor="vatNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> VAT Number (Optional) </label>
                  <input type="text" id="vatNumber" value={localVatNumber} onChange={(e) => setLocalVatNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
            <button type="submit" className="bg-admin-dark-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"> Save Changes </button>
            {savedMessage && <span className="text-green-400 text-sm" role="status">{savedMessage}</span>}
        </div>
      </form>
      
      {/* Data Management Section */}
      <section data-tour-id="settings-data-management" className="mt-12 pt-6 border-t border-admin-dark-border">
          <h3 className="text-lg font-semibold text-white mb-2">💾 Data Management</h3>
          <p className="text-sm text-admin-dark-text-secondary mb-4">Download a single JSON file containing all your site data, or restore your site from a backup file.</p>
          <div className="flex flex-col sm:flex-row gap-4">
              <button 
                  type="button" 
                  onClick={handleBackup}
                  className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-500/40 hover:text-white transition-colors"
              >
                  Backup All Data
              </button>
              <label 
                  htmlFor="restore-backup" 
                  className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-500/40 hover:text-white transition-colors cursor-pointer text-center"
              >
                  Restore from Backup
              </label>
              <input 
                  type="file" 
                  id="restore-backup" 
                  accept=".json" 
                  onChange={handleRestore} 
                  className="hidden" 
              />
          </div>
      </section>

      {/* Danger Zone Section */}
      <section data-tour-id="settings-danger-zone" className="mt-12 pt-6 border-t-2 border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-2">🚨 Danger Zone</h3>
          <p className="text-sm text-admin-dark-text-secondary mb-4">These actions are irreversible. Please be certain before proceeding.</p>
          <button 
            type="button" 
            onClick={props.onClearAllData}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-500/40 hover:text-white transition-colors"
          >
            Clear All Live Data
          </button>
      </section>
    </div>
  );
};

export default SettingsManager;