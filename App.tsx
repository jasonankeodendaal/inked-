import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecialsCollage from './components/SpecialsCollage';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import Showroom from './pages/ShowroomPage';
import AboutUs from './components/AboutUs';
import WelcomeIntro from './components/WelcomeIntro'; // Import the new component

export interface PortfolioItem {
  id: string;
  title: string;
  story: string;
  primaryImage: string; // Will store base64 Data URL
  galleryImages: string[]; // Will store array of base64 Data URLs
  videoData?: string; // Optional base64 Data URL for a video
  featured?: boolean;
}

export interface ShowroomItem {
  id: string;
  title: string;
  images: string[]; // up to 5 images
  videoUrl?: string;
}


export interface SpecialItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Will store base64 Data URL
  priceType: 'hourly' | 'fixed' | 'percentage' | 'none';
  priceValue?: number;
  details: string[];
  voucherCode?: string;
}

export interface SocialLink {
  id: string;
  url: string;
  icon: string; // base64 Data URL
}


export interface Booking {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  contactMethod?: 'email' | 'whatsapp';
  message: string;
  bookingDate: string; // ISO string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingType: 'online' | 'manual';
  totalCost?: number;
  amountPaid?: number;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'other';
  referenceImages?: string[]; // array of base64 data URLs
}

export interface Genre {
  id:string;
  name: string;
  items: ShowroomItem[];
}

// NEW Data Structures for Admin Panel
export interface Expense {
  id: string;
  date: string; // ISO string
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


const initialBookingsData: Booking[] = [
  { id: 'b1', name: 'Alice Johnson', email: 'alice@example.com', message: 'Interested in a floral sleeve for the preferred date.', bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'pending', bookingType: 'online', contactMethod: 'email' },
  { id: 'b2', name: 'Bob Williams', email: 'bob@example.com', message: 'Consultation for a large back piece.', bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'pending', bookingType: 'online', contactMethod: 'whatsapp', whatsappNumber: '1234567890' },
  { id: 'b3', name: 'Charlie Brown', email: 'charlie@example.com', message: 'Looking to get a small wrist tattoo.', bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'confirmed', bookingType: 'online', totalCost: 1200, amountPaid: 1200, paymentMethod: 'card' },
  { id: 'b4', name: 'Diana Miller', email: 'diana@example.com', message: 'Follow-up session for my sleeve.', bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'completed', bookingType: 'manual', totalCost: 3500, amountPaid: 3500, paymentMethod: 'transfer' },
  { id: 'b5', name: 'Ethan Hunt', email: 'ethan@example.com', message: 'Cancelled due to scheduling conflict.', bookingDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'cancelled', bookingType: 'online' },
  { id: 'b6', name: 'Fiona Glenanne', email: 'fiona@example.com', message: 'Ready for my appointment next week!', bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'confirmed', bookingType: 'online', totalCost: 800, amountPaid: 200, paymentMethod: 'cash' },
];

const initialPortfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Celestial Journey',
    story: "This piece represents the client's passion for astronomy and the journey of self-discovery. Each star is a milestone, and the nebula clouds symbolize the unknown future.",
    primaryImage: 'https://picsum.photos/id/1015/400/600',
    galleryImages: [
      'https://picsum.photos/id/1015/1200/800',
      'https://picsum.photos/seed/celestial-detail/1200/800',
      'https://picsum.photos/seed/celestial-angle/1200/800',
    ],
    featured: true,
  },
  {
    id: '2',
    title: 'Kinetic Sculpture',
    story: 'A dynamic piece that appears to move with the body, brought to life with a looping video background.',
    primaryImage: 'https://picsum.photos/id/1016/400/600',
    galleryImages: [
      'https://picsum.photos/id/1016/1200/800',
      'https://picsum.photos/seed/ocean-closeup/1200/800',
    ],
    videoData: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-a-man-with-head-down-32839-large.mp4', // This is a URL but will be treated as data for demo
    featured: true,
  },
  {
    id: '3',
    title: 'Forest Spirit',
    story: 'Inspired by ancient folklore, this tattoo depicts a guardian of the forest. It wraps around the arm, a symbol of protection and connection to nature.',
    primaryImage: 'https://picsum.photos/id/1018/400/600',
    galleryImages: [
      'https://picsum.photos/id/1018/1200/800',
      'https://picsum.photos/seed/forest-lines/1200/800',
    ],
    videoData: 'https://assets.mixkit.co/videos/preview/mixkit-black-and-white-video-of-a-man-with-a-beard-34441-large.mp4',
    featured: false,
  },
  {
    id: '4',
    title: 'Urban Geometry',
    story: 'A piece that blends sharp, geometric patterns with the flowing lines of a city skyline, representing the structure and chaos of modern life.',
    primaryImage: 'https://picsum.photos/id/1019/400/600',
    galleryImages: [
      'https://picsum.photos/id/1019/1200/800',
    ],
    featured: true,
  },
    {
    id: '5',
    title: 'The Wanderer',
    story: 'For a client who has traveled the world, this compass and map tattoo is a reminder of past adventures and the promise of new ones to come.',
    primaryImage: 'https://picsum.photos/id/1021/400/600',
    galleryImages: [
        'https://picsum.photos/id/1021/1200/800',
        'https://picsum.photos/seed/wanderer-detail/1200/800',
    ],
    featured: false,
  },
  {
    id: '6',
    title: 'Mechanical Heart',
    story: 'A biomechanical tattoo that explores the intersection of humanity and technology, showing the intricate workings of a heart powered by gears and steam.',
    primaryImage: 'https://picsum.photos/id/1022/400/600',
    galleryImages: [
        'https://picsum.photos/id/1022/1200/800',
        'https://picsum.photos/seed/mech-heart/1200/800'
    ],
    videoData: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-long-corridor-42419-large.mp4',
    featured: true,
  },
];

const initialSpecialsData: SpecialItem[] = [
  {
    id: 's1',
    title: 'Full Day Session',
    description: 'Dedicate a full day to your masterpiece.',
    imageUrl: 'https://picsum.photos/seed/full-day-tattoo/400/600',
    priceType: 'fixed',
    priceValue: 2500,
    details: ['Up to 8 hours of tattoo time', 'Ideal for large, single-session pieces', 'Includes a free consultation and aftercare kit'],
  },
  {
    id: 's2',
    title: 'Fine-Line Hourly',
    description: 'Intricate and delicate work, priced by the hour.',
    imageUrl: 'https://picsum.photos/seed/floral-fridays/400/600',
    priceType: 'hourly',
    priceValue: 850,
    details: ['Perfect for floral & script tattoos', 'Minimum 2-hour booking required', 'Pay only for the time you need'],
  },
  {
    id: 's3',
    title: 'Student Discount',
    description: 'Get 15% off any tattoo with a valid student ID.',
    imageUrl: 'https://picsum.photos/seed/student-deal/800/800',
    priceType: 'percentage',
    priceValue: 15,
    details: ['Valid on weekdays only', 'Must present a valid student card', 'Cannot be combined with other offers'],
    voucherCode: 'STUDENT15',
  },
  {
    id: 's4',
    title: 'Palm-Sized Flash',
    description: 'Choose from our exclusive flash sheet collection.',
    imageUrl: 'https://picsum.photos/seed/small-tattoo/400/400',
    priceType: 'fixed',
    priceValue: 500,
    details: ['Over 50 unique designs available', 'No alterations to flash designs', 'Perfect for a quick and stylish tattoo'],
  }
];

const generateShowroomItems = (count: number, seedPrefix: string): ShowroomItem[] => {
    const items: ShowroomItem[] = [];
    const placeholderVideos = [
        'https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-a-man-with-head-down-32839-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-black-and-white-video-of-a-man-with-a-beard-34441-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-futuristic-long-corridor-42419-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-girl-in-a-leather-jacket-and-a-hat-in-a-dark-basement-43916-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-mysterious-person-in-a-hoodie-standing-in-the-dark-43920-large.mp4'
    ];

    for (let i = 0; i < count; i++) {
        const title = `${seedPrefix.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Design #${i + 1}`;
        const images = Array.from({ length: 5 }, (_, j) => `https://picsum.photos/seed/${seedPrefix}-${i}-img${j}/400/400`);
        const videoUrl = i % 2 === 0 ? placeholderVideos[Math.floor(i / 2) % placeholderVideos.length] : undefined;

        items.push({
            id: `sr-${seedPrefix}-${i}`,
            title,
            images,
            videoUrl,
        });
    }
    return items;
};

const initialShowroomData: Genre[] = [
    {
        id: 'genre1',
        name: 'Fine-Line & Abstract',
        items: generateShowroomItems(10, 'fine-line'),
    },
    {
        id: 'genre2',
        name: 'Sleeves & Large Pieces',
        items: generateShowroomItems(10, 'large-pieces'),
    },
    {
        id: 'genre3',
        name: 'Modern & Geometric',
        items: generateShowroomItems(10, 'geometric'),
    }
];

const initialExpenseData: Expense[] = [
    { id: 'e1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Supplies', description: 'Needles & Ink', amount: 1500 },
    { id: 'e2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Rent', description: 'Studio Rent - Monthly', amount: 10000 },
];

const initialInventoryData: InventoryItem[] = [
    { id: 'i1', name: 'Triple Black', category: 'Ink', quantity: 355, cost: 1.4, supplier: 'Tattoo World', brand: 'Dynamic Color', lotNumber: 'DYN-TB-1A2B' },
    { id: 'i2', name: '7RL Needles', category: 'Needles', quantity: 500, cost: 7, supplier: 'Ink Emporium' },
    { id: 'i3', name: 'Canary Yellow', category: 'Ink', quantity: 60, cost: 2.5, supplier: 'Tattoo World', brand: 'Intenze', lotNumber: 'INT-CY-5E6F' },
];

const App: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>(initialPortfolioData);
  const [specialsData, setSpecialsData] = useState<SpecialItem[]>(initialSpecialsData);
  const [showroomData, setShowroomData] = useState<Genre[]>(initialShowroomData);
  const [bookings, setBookings] = useState<Booking[]>(initialBookingsData);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenseData);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryData);
  
  // Site settings state
  const [companyName, setCompanyName] = useState('Beautively Inked Tattoo Studio');
  const [logoUrl, setLogoUrl] = useState('https://i.ibb.co/fVzq56Ng/31e985d7-135f-4a54-98f9-f110bd155497-2.png');
  const [aboutUsImageUrl, setAboutUsImageUrl] = useState('https://picsum.photos/seed/artist-portrait/500/500');
  const [whatsAppNumber, setWhatsAppNumber] = useState('27795904162'); // E.g., 27795904162 for +27 79 590 4162
  const [address, setAddress] = useState('123 Ink Lane, Art City, 45678');
  const [phone, setPhone] = useState('+27 12 345 6789');
  const [email, setEmail] = useState('contact@beautivelyinked.com');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  // Page content settings
  const [showroomTitle, setShowroomTitle] = useState('The Flash Wall');
  const [showroomDescription, setShowroomDescription] = useState("A curated collection of our work, showcasing the skill, diversity, and passion we bring to every piece.");
  const [heroTattooGunImageUrl, setHeroTattooGunImageUrl] = useState('https://i.ibb.co/Mkfdy286/image-removebg-preview.png');

  // New billing settings state
  const [bankName, setBankName] = useState('FNB');
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [branchCode, setBranchCode] = useState('250655');
  const [accountType, setAccountType] = useState('Cheque');
  const [vatNumber, setVatNumber] = useState(''); // Optional, so empty is fine

  const [currentView, setCurrentView] = useState('home'); // 'home' or 'admin'
  
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  useEffect(() => {
    // Only show the intro once per session
    if (sessionStorage.getItem('introShown')) {
      setIsIntroVisible(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('introShown', 'true');
    setIsIntroVisible(false);
  };

  const navigate = (view: 'home' | 'admin') => {
    setCurrentView(view);
  };

  const handleAddBooking = (newBookingData: Omit<Booking, 'id' | 'status' | 'bookingType'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: Date.now().toString(),
      status: 'pending',
      bookingType: 'online',
    };

    // In a real app with a backend, you would upload the referenceImages here.
    if (newBooking.referenceImages && newBooking.referenceImages.length > 0) {
        console.log(`Booking request includes ${newBooking.referenceImages.length} reference images.`);
    }

    setBookings(prevBookings => [newBooking, ...prevBookings]);
  };

  const handleManualAddBooking = (newBookingData: Omit<Booking, 'id' | 'bookingType'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: Date.now().toString(),
      bookingType: 'manual',
    };
    setBookings(prevBookings => [newBooking, ...prevBookings]);
  };

  // --- Expense CRUD Handlers ---
  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...newExpense, id: Date.now().toString() }, ...prev]);
  };
  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  // --- Inventory CRUD Handlers ---
  const handleAddInventoryItem = (newItem: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => [{ ...newItem, id: Date.now().toString() }, ...prev]);
  };
  const handleUpdateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
  };

  // --- Clear All Data Handler ---
  const handleClearAllData = () => {
      setPortfolioData([]);
      setSpecialsData([]);
      setShowroomData([]);
      setBookings([]);
      setExpenses([]);
      setInventory([]);
      // We don't clear site settings like company name, logo, billing, etc.
      alert('All mock data has been cleared!');
  };
  
  const handleLogout = () => {
    // This function will be passed down to the AdminPage
    // For now, it simply navigates home, but in a real app
    // you might clear session storage, etc.
    navigate('home');
  };

  if (isIntroVisible) {
    return <WelcomeIntro isVisible={isIntroVisible} onEnter={handleEnter} logoUrl={logoUrl} />;
  }

  if (currentView === 'admin') {
    return (
      <AdminPage
        onNavigate={navigate}
        portfolioData={portfolioData}
        onPortfolioUpdate={setPortfolioData}
        specialsData={specialsData}
        onSpecialsUpdate={setSpecialsData}
        showroomData={showroomData}
        onShowroomUpdate={setShowroomData}
        bookings={bookings}
        onBookingsUpdate={setBookings}
        onManualAddBooking={handleManualAddBooking}
        expenses={expenses}
        onExpensesUpdate={setExpenses}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
        inventory={inventory}
        onInventoryUpdate={setInventory}
        onAddInventoryItem={handleAddInventoryItem}
        onUpdateInventoryItem={handleUpdateInventoryItem}
        onDeleteInventoryItem={handleDeleteInventoryItem}
        whatsAppNumber={whatsAppNumber}
        onWhatsAppNumberUpdate={setWhatsAppNumber}
        companyName={companyName}
        onCompanyNameUpdate={setCompanyName}
        logoUrl={logoUrl}
        onLogoUrlUpdate={setLogoUrl}
        aboutUsImageUrl={aboutUsImageUrl}
        onAboutUsImageUrlUpdate={setAboutUsImageUrl}
        address={address}
        onAddressUpdate={setAddress}
        phone={phone}
        onPhoneUpdate={setPhone}
        email={email}
        onEmailUpdate={setEmail}
        socialLinks={socialLinks}
        onSocialLinksUpdate={setSocialLinks}
        onClearAllData={handleClearAllData}
        bankName={bankName}
        onBankNameUpdate={setBankName}
        accountNumber={accountNumber}
        onAccountNumberUpdate={setAccountNumber}
        branchCode={branchCode}
        onBranchCodeUpdate={setBranchCode}
        accountType={accountType}
        onAccountTypeUpdate={setAccountType}
        vatNumber={vatNumber}
        onVatNumberUpdate={setVatNumber}
        onLogout={handleLogout}
        showroomTitle={showroomTitle}
        onShowroomTitleUpdate={setShowroomTitle}
        showroomDescription={showroomDescription}
        onShowroomDescriptionUpdate={setShowroomDescription}
        heroTattooGunImageUrl={heroTattooGunImageUrl}
        onHeroTattooGunImageUrlUpdate={setHeroTattooGunImageUrl}
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