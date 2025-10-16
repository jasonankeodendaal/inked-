import React, { useState } from 'react';
import { SocialLink } from '../../App';

interface SettingsManagerProps {
  whatsAppNumber: string;
  onWhatsAppNumberUpdate: (phone: string) => void;
  companyName: string;
  onCompanyNameUpdate: (name: string) => void;
  logoUrl: string;
  onLogoUrlUpdate: (url: string) => void;
  address: string;
  onAddressUpdate: (address: string) => void;
  phone: string;
  onPhoneUpdate: (phone: string) => void;
  email: string;
  onEmailUpdate: (email: string) => void;
  socialLinks: SocialLink[];
  onSocialLinksUpdate: (links: SocialLink[]) => void;
  onClearAllData: () => void;
  bankName: string;
  onBankNameUpdate: (name: string) => void;
  accountNumber: string;
  onAccountNumberUpdate: (num: string) => void;
  branchCode: string;
  onBranchCodeUpdate: (code: string) => void;
  accountType: string;
  onAccountTypeUpdate: (type: string) => void;
  vatNumber: string;
  onVatNumberUpdate: (num: string) => void;
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
  const [localWhatsAppNumber, setLocalWhatsAppNumber] = useState(props.whatsAppNumber);
  const [localAddress, setLocalAddress] = useState(props.address);
  const [localPhone, setLocalPhone] = useState(props.phone);
  const [localEmail, setLocalEmail] = useState(props.email);
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialLink[]>(props.socialLinks);
  
  // New billing state
  const [localBankName, setLocalBankName] = useState(props.bankName);
  const [localAccountNumber, setLocalAccountNumber] = useState(props.accountNumber);
  const [localBranchCode, setLocalBranchCode] = useState(props.branchCode);
  const [localAccountType, setLocalAccountType] = useState(props.accountType);
  const [localVatNumber, setLocalVatNumber] = useState(props.vatNumber);

  const [savedMessage, setSavedMessage] = useState('');
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    props.onWhatsAppNumberUpdate(localWhatsAppNumber);
    props.onCompanyNameUpdate(localCompanyName);
    props.onLogoUrlUpdate(localLogoUrl);
    props.onAddressUpdate(localAddress);
    props.onPhoneUpdate(localPhone);
    props.onEmailUpdate(localEmail);
    props.onSocialLinksUpdate(localSocialLinks);
    // Save new billing info
    props.onBankNameUpdate(localBankName);
    props.onAccountNumberUpdate(localAccountNumber);
    props.onBranchCodeUpdate(localBranchCode);
    props.onAccountTypeUpdate(localAccountType);
    props.onVatNumberUpdate(localVatNumber);

    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const dataUrl = await fileToDataUrl(e.target.files[0]);
          setLocalLogoUrl(dataUrl);
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

  const handleClearDataClick = () => {
    if (window.confirm('Are you absolutely sure? This will delete all portfolio items, specials, bookings, and other content. This action cannot be undone.')) {
        props.onClearAllData();
    }
  };

  return (
    <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
        <header className="mb-8">
            <h2 className="text-xl font-bold text-white">Site Settings</h2>
            <p className="text-sm text-admin-dark-text-secondary mt-1">Manage global content for your website.</p>
        </header>
      <form onSubmit={handleSaveSettings} className="space-y-10">
        
        {/* Company Details Section */}
        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">🏢 Company Details</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Company Name </label>
              <input type="text" id="companyName" value={localCompanyName} onChange={(e) => setLocalCompanyName(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Logo </label>
              <div className="flex items-center gap-4">
                {localLogoUrl && <img src={localLogoUrl} alt="Logo preview" className="w-16 h-16 rounded-md bg-white/10 p-1 object-contain"/>}
                <input type="file" id="logo" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="block w-full text-sm text-admin-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-admin-dark-primary/20 file:text-admin-dark-primary hover:file:bg-admin-dark-primary/40" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">📞 Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Address </label>
                  <input type="text" id="address" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Phone Number </label>
                  <input type="text" id="phone" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Contact Email </label>
                  <input type="email" id="email" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="whatsAppNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> WhatsApp Number </label>
                  <input type="text" id="whatsAppNumber" value={localWhatsAppNumber} onChange={(e) => setLocalWhatsAppNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
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
                        <img src={link.icon} alt="Social Icon" className="w-8 h-8 rounded-md bg-white/10 p-1 object-contain"/>
                        <input type="text" value={link.url} onChange={(e) => handleUpdateSocialLink(link.id, e.target.value)} placeholder="https://..." className="flex-grow bg-admin-dark-bg border border-admin-dark-border rounded-md p-2 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition"/>
                        <button type="button" onClick={() => handleRemoveSocialLink(link.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors">&times;</button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                 <label htmlFor="social_upload" className="inline-block text-sm text-admin-dark-primary bg-admin-dark-primary/20 hover:bg-admin-dark-primary/40 px-4 py-2 rounded-md cursor-pointer transition-colors">Add Social Icon</label>
                 <input type="file" id="social_upload" accept="image/png, image/jpeg, image/svg+xml" onChange={handleAddSocialLink} className="hidden" />
            </div>
        </section>

        {/* Billing Information Section */}
        <section>
          <h3 className="text-lg font-semibold text-white border-b border-admin-dark-border pb-3 mb-4">💰 Billing & Invoicing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="bankName" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Bank Name </label>
                  <input type="text" id="bankName" value={localBankName} onChange={(e) => setLocalBankName(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
               <div>
                  <label htmlFor="accountType" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Account Type </label>
                  <input type="text" id="accountType" value={localAccountType} onChange={(e) => setLocalAccountType(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="accountNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Account Number </label>
                  <input type="text" id="accountNumber" value={localAccountNumber} onChange={(e) => setLocalAccountNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div>
                  <label htmlFor="branchCode" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> Branch Code </label>
                  <input type="text" id="branchCode" value={localBranchCode} onChange={(e) => setLocalBranchCode(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
              <div className="md:col-span-2">
                  <label htmlFor="vatNumber" className="block text-sm font-semibold text-admin-dark-text-secondary mb-2"> VAT Number (Optional) </label>
                  <input type="text" id="vatNumber" value={localVatNumber} onChange={(e) => setLocalVatNumber(e.target.value)} className="w-full bg-admin-dark-bg border border-admin-dark-border rounded-md p-3 text-admin-dark-text outline-none focus:ring-2 focus:ring-admin-dark-primary transition" />
              </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-admin-dark-border">
            <button type="submit" className="bg-admin-dark-primary text-white px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity"> Save Changes </button>
            {savedMessage && <span className="text-green-400 text-sm" role="status">{savedMessage}</span>}
        </div>
      </form>
      
      {/* Danger Zone Section */}
      <section className="mt-12 pt-6 border-t-2 border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-2">🚨 Danger Zone</h3>
          <p className="text-sm text-admin-dark-text-secondary mb-4">These actions are irreversible. Please be certain before proceeding.</p>
          <button 
            type="button" 
            onClick={handleClearDataClick}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-md font-bold text-sm hover:bg-red-500/40 hover:text-white transition-colors"
          >
            Clear All Mock Data
          </button>
      </section>
    </div>
  );
};

export default SettingsManager;
