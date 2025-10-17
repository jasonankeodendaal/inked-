import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';

import Header from './components/Header';
import Hero from './components/Hero';
import SpecialsCollage from './components/SpecialsCollage';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import Showroom from './pages/ShowroomPage';
import AboutUs from './components/AboutUs';
import WelcomeIntro from './components/WelcomeIntro';

// --- INTERFACES (Unchanged) ---
export interface PortfolioItem {
  id: string;
  title: string;
  story: string;
  primaryImage: string;
  galleryImages: string[];
  videoData?: string;
  featured?: boolean;
}
export interface ShowroomItem {
  id: string;
  title: string;
  images: string[];
  videoUrl?: string;
}
export interface SpecialItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceType: 'hourly' | 'fixed' | 'percentage' | 'none';
  priceValue?: number;
  details: string[];
  voucherCode?: string;
}
export interface SocialLink {
  id: string;
  url: string;
  icon: string;
}
export interface Booking {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  contactMethod?: 'email' | 'whatsapp';
  message: string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingType: 'online' | 'manual';
  totalCost?: number;
  amountPaid?: number;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'other';
  referenceImages?: string[];
}
export interface Genre {
  id:string;
  name: string;
  items: ShowroomItem[];
}
export interface Expense {
  id: string;
  date: string;
  category: 'Supplies' | 'Rent' | 'Utilities' | 'Marketing' | 'Other';
  description: string;
  amount: number;
}
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  cost: number;
  supplier?: string;
  brand?: string;
  lotNumber?: string;
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [specialsData, setSpecialsData] = useState<SpecialItem[]>([]);
  const [showroomData, setShowroomData] = useState<Genre[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // Site settings state with default values
  const [companyName, setCompanyName] = useState('Beautively Inked Tattoo Studio');
  const [logoUrl, setLogoUrl] = useState('https://i.ibb.co/fVzq56Ng/31e985d7-135f-4a54-98f9-f110bd155497-2.png');
  const [aboutUsImageUrl, setAboutUsImageUrl] = useState('https://picsum.photos/seed/artist-portrait/500/500');
  const [whatsAppNumber, setWhatsAppNumber] = useState('27795904162');
  const [address, setAddress] = useState('123 Ink Lane, Art City, 45678');
  const [phone, setPhone] = useState('+27 12 345 6789');
  const [email, setEmail] = useState('contact@beautivelyinked.com');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showroomTitle, setShowroomTitle] = useState('The Flash Wall');
  const [showroomDescription, setShowroomDescription] = useState("A curated collection of our work...");
  const [heroTattooGunImageUrl, setHeroTattooGunImageUrl] = useState('https://i.ibb.co/Mkfdy286/image-removebg-preview.png');
  const [bankName, setBankName] = useState('FNB');
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [branchCode, setBranchCode] = useState('250655');
  const [accountType, setAccountType] = useState('Cheque');
  const [vatNumber, setVatNumber] = useState('');

  const [currentView, setCurrentView] = useState('home');
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  // --- DATA FETCHING on App Load ---
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    let isMounted = true;

    try {
      // Subscribe to settings document
      const settingsUnsub = onSnapshot(doc(db, "settings", "main"), (doc) => {
        if (doc.exists()) {
          const settings = doc.data();
          if (isMounted) {
            setCompanyName(settings.companyName);
            setLogoUrl(settings.logoUrl);
            setAboutUsImageUrl(settings.aboutUsImageUrl);
            setWhatsAppNumber(settings.whatsAppNumber);
            setAddress(settings.address);
            setPhone(settings.phone);
            setEmail(settings.email);
            setSocialLinks(settings.socialLinks);
            setShowroomTitle(settings.showroomTitle);
            setShowroomDescription(settings.showroomDescription);
            setHeroTattooGunImageUrl(settings.heroTattooGunImageUrl);
            setBankName(settings.bankName);
            setAccountNumber(settings.accountNumber);
            setBranchCode(settings.branchCode);
            setAccountType(settings.accountType);
            setVatNumber(settings.vatNumber);
          }
        }
      }, (error) => {
        console.error("Error listening to settings:", error);
        alert("Could not connect to the settings database. Please check your connection and Firebase setup.");
      });
      unsubscribers.push(settingsUnsub);

      // Subscribe to all collections
      const collectionsToSubscribe: { name: string, setter: React.Dispatch<React.SetStateAction<any[]>> }[] = [
        { name: 'portfolio', setter: setPortfolioData },
        { name: 'specials', setter: setSpecialsData },
        { name: 'showroom', setter: setShowroomData },
        { name: 'bookings', setter: setBookings },
        { name: 'expenses', setter: setExpenses },
        { name: 'inventory', setter: setInventory },
      ];

      collectionsToSubscribe.forEach(({ name, setter }) => {
        const collectionUnsub = onSnapshot(collection(db, name), (snapshot) => {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (isMounted) {
            setter(data);
          }
        }, (error) => {
          console.error(`Error listening to ${name} collection:`, error);
        });
        unsubscribers.push(collectionUnsub);
      });
      
    } catch (error) {
      console.error("Error setting up Firestore listeners:", error);
      alert("Could not connect to the database. Please check your connection and Firebase setup.");
    } finally {
        if (isMounted) {
            setLoading(false);
        }
    }

    // Cleanup function
    return () => {
      isMounted = false;
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // --- INTRO & NAVIGATION ---
  useEffect(() => {
    if (sessionStorage.getItem('introShown')) {
      setIsIntroVisible(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('introShown', 'true');
    setIsIntroVisible(false);
  };

  const navigate = (view: 'home' | 'admin') => setCurrentView(view);

  // --- CRUD (Create, Read, Update, Delete) FUNCTIONS ---
  
  // Generic update DB doc
  const updateItem = async <T extends {id: string}>(collectionName: string, item: T) => {
    try {
      const { id, ...data } = item;
      await updateDoc(doc(db, collectionName, id), data);
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      alert(`Failed to update item in ${collectionName}. Please check the console for details and verify your Firestore security rules.`);
    }
  };

  // Generic add DB doc
  const addItem = async <T extends {}>(collectionName: string, item: T) => {
    try {
      await addDoc(collection(db, collectionName), item);
    } catch (error) {
      console.error(`Error adding ${collectionName}:`, error);
      alert(`Failed to add item to ${collectionName}. Please check the console for details and verify your Firestore security rules.`);
    }
  };

  // Generic delete DB doc
  const deleteItem = async (collectionName: string, itemId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, itemId));
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      alert(`Failed to delete item from ${collectionName}. Please check the console for details and verify your Firestore security rules.`);
    }
  };

  // Portfolio
  const handleUpdatePortfolioItem = async (item: PortfolioItem) => await updateItem('portfolio', item);
  const handleAddPortfolioItem = async (item: Omit<PortfolioItem, 'id'>) => await addItem('portfolio', item);
  const handleDeletePortfolioItem = async (itemId: string) => await deleteItem('portfolio', itemId);

  // Specials
  const handleUpdateSpecialItem = async (item: SpecialItem) => await updateItem('specials', item);
  const handleAddSpecialItem = async (item: Omit<SpecialItem, 'id'>) => await addItem('specials', item);
  const handleDeleteSpecialItem = async (itemId: string) => await deleteItem('specials', itemId);

  // Showroom
  const handleUpdateShowroomGenre = async (item: Genre) => await updateItem('showroom', item);
  const handleAddShowroomGenre = async (item: Omit<Genre, 'id'>) => await addItem('showroom', item);
  const handleDeleteShowroomGenre = async (itemId: string) => await deleteItem('showroom', itemId);
  
  // Bookings
  const handleAddBooking = async (newBookingData: Omit<Booking, 'id' | 'status' | 'bookingType'>) => {
    const newBooking: Omit<Booking, 'id'> = {
      ...newBookingData,
      status: 'pending',
      bookingType: 'online',
    };
    await addItem('bookings', newBooking);
  };
  const handleManualAddBooking = async (newBookingData: Omit<Booking, 'id' | 'bookingType'>) => {
    const newBooking: Omit<Booking, 'id'> = {
      ...newBookingData,
      bookingType: 'manual',
    };
    await addItem('bookings', newBooking);
  };
  const handleUpdateBooking = async (item: Booking) => await updateItem('bookings', item);

  // Expenses
  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => await addItem('expenses', newExpense);
  const handleUpdateExpense = async (updatedExpense: Expense) => await updateItem('expenses', updatedExpense);
  const handleDeleteExpense = async (expenseId: string) => await deleteItem('expenses', expenseId);

  // Inventory
  const handleAddInventoryItem = async (newItem: Omit<InventoryItem, 'id'>) => await addItem('inventory', newItem);
  const handleUpdateInventoryItem = async (updatedItem: InventoryItem) => await updateItem('inventory', updatedItem);
  const handleDeleteInventoryItem = async (itemId: string) => await deleteItem('inventory', itemId);

  // Settings
  const handleSaveAllSettings = async (settings: any) => {
    try {
        await setDoc(doc(db, "settings", "main"), settings, { merge: true });
    } catch (error) {
        console.error("Error saving settings:", error);
        alert("Failed to save settings. Please check the console for details and verify your Firestore security rules.");
    }
  };

  const handleClearAllData = async () => {
      if (!window.confirm("ARE YOU SURE? This will delete ALL content from your live database. This is irreversible.")) return;

      const collectionsToDelete = ['portfolio', 'specials', 'showroom', 'bookings', 'expenses', 'inventory'];
      const batch = writeBatch(db);

      try {
          for (const collectionName of collectionsToDelete) {
              const querySnapshot = await collection(db, collectionName).get();
              querySnapshot.docs.forEach(d => batch.delete(d.ref));
          }
          await batch.commit();
          
          alert('All live data has been cleared from the database.');
      } catch (error) {
          console.error("Error clearing data:", error);
          alert("An error occurred while clearing data. Check console for details.");
      }
  };
  
  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-dark">
         <img src="https://i.ibb.co/fVzq56Ng/31e985d7-135f-4a54-98f9-f110bd155497-2.png" alt="Beautively Inked Logo" className="w-48 h-48 object-contain animate-pulse"/>
         <p className="text-brand-light/70 mt-4">Connecting to Studio...</p>
      </div>
    );
  }

  if (isIntroVisible) {
    return <WelcomeIntro isVisible={isIntroVisible} onEnter={handleEnter} logoUrl={logoUrl} />;
  }

  if (currentView === 'admin') {
    return (
      <AdminPage
        onNavigate={navigate}
        portfolioData={portfolioData}
        onAddPortfolioItem={handleAddPortfolioItem}
        onUpdatePortfolioItem={handleUpdatePortfolioItem}
        onDeletePortfolioItem={handleDeletePortfolioItem}
        specialsData={specialsData}
        onAddSpecialItem={handleAddSpecialItem}
        onUpdateSpecialItem={handleUpdateSpecialItem}
        onDeleteSpecialItem={handleDeleteSpecialItem}
        showroomData={showroomData}
        onAddShowroomGenre={handleAddShowroomGenre}
        onUpdateShowroomGenre={handleUpdateShowroomGenre}
        onDeleteShowroomGenre={handleDeleteShowroomGenre}
        bookings={bookings}
        onUpdateBooking={handleUpdateBooking}
        onManualAddBooking={handleManualAddBooking}
        expenses={expenses}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
        inventory={inventory}
        onAddInventoryItem={handleAddInventoryItem}
        onUpdateInventoryItem={handleUpdateInventoryItem}
        onDeleteInventoryItem={handleDeleteInventoryItem}
        onSaveAllSettings={handleSaveAllSettings}
        onClearAllData={handleClearAllData}
        onLogout={() => navigate('home')}
        // Pass all settings as props
        companyName={companyName}
        logoUrl={logoUrl}
        aboutUsImageUrl={aboutUsImageUrl}
        whatsAppNumber={whatsAppNumber}
        address={address}
        phone={phone}
        email={email}
        socialLinks={socialLinks}
        showroomTitle={showroomTitle}
        showroomDescription={showroomDescription}
        heroTattooGunImageUrl={heroTattooGunImageUrl}
        bankName={bankName}
        accountNumber={accountNumber}
        branchCode={branchCode}
        accountType={accountType}
        vatNumber={vatNumber}
      />
    );
  }

  return (
    <>
      <Header onNavigate={navigate} logoUrl={logoUrl} companyName={companyName} />
      <main>
        <Hero portfolioData={portfolioData} onNavigate={navigate} heroTattooGunImageUrl={heroTattooGunImageUrl} />
        <SpecialsCollage specials={specialsData} whatsAppNumber={whatsAppNumber} />
        <AboutUs aboutUsImageUrl={aboutUsImageUrl} />
        <Showroom 
          showroomData={showroomData} 
          showroomTitle={showroomTitle} 
          showroomDescription={showroomDescription} 
        />
        <ContactForm onAddBooking={handleAddBooking} />
      </main>
      <Footer
        companyName={companyName}
        address={address}
        phone={phone}
        email={email}
        socialLinks={socialLinks}
      />
    </>
  );
};

export default App;
