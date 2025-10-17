import React from 'react';
import { signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import { PortfolioItem, SpecialItem, Genre, Booking, SocialLink, Expense, InventoryItem } from '../App';

export interface AdminPageProps {
  user: User | null;
  onNavigate: (view: 'home' | 'admin') => void;
  onSuccessfulLogout: () => void;

  // Portfolio
  portfolioData: PortfolioItem[];
  onAddPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  onUpdatePortfolioItem: (item: PortfolioItem) => Promise<void>;
  onDeletePortfolioItem: (id: string) => Promise<void>;

  // Specials
  specialsData: SpecialItem[];
  onAddSpecialItem: (item: Omit<SpecialItem, 'id'>) => Promise<void>;
  onUpdateSpecialItem: (item: SpecialItem) => Promise<void>;
  onDeleteSpecialItem: (id: string) => Promise<void>;

  // Showroom
  showroomData: Genre[];
  onAddShowroomGenre: (item: Omit<Genre, 'id'>) => Promise<void>;
  onUpdateShowroomGenre: (item: Genre) => Promise<void>;
  onDeleteShowroomGenre: (id: string) => Promise<void>;

  // Bookings
  bookings: Booking[];
  onUpdateBooking: (booking: Booking) => Promise<void>;
  onManualAddBooking: (booking: Omit<Booking, 'id' | 'bookingType'>) => Promise<void>;

  // Expenses
  expenses: Expense[];
  onAddExpense: (newExpense: Omit<Expense, 'id'>) => Promise<void>;
  onUpdateExpense: (updatedExpense: Expense) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;

  // Inventory
  inventory: InventoryItem[];
  onAddInventoryItem: (newItem: Omit<InventoryItem, 'id'>) => Promise<void>;
  onUpdateInventoryItem: (updatedItem: InventoryItem) => Promise<void>;
  onDeleteInventoryItem: (itemId: string) => Promise<void>;
  
  // Settings
  onSaveAllSettings: (settings: any) => Promise<void>;
  onClearAllData: () => Promise<void>;

  // Pass-through settings properties
  companyName: string;
  logoUrl: string;
  aboutUsImageUrl: string;
  whatsAppNumber: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  showroomTitle: string;
  showroomDescription: string;
  heroTattooGunImageUrl: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  vatNumber: string;
  isMaintenanceMode: boolean;
  apkUrl: string;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const isAuthenticated = !!props.user;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // onAuthStateChanged in App.tsx will handle the state update.
        // This will navigate to 'home' as defined in App.tsx
        props.onSuccessfulLogout();
      })
      .catch((error) => {
        console.error("Sign out error", error);
        alert("Failed to sign out. Please check your internet connection and try again.");
      });
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} {...props} />;
  }
  
  return <AdminLoginPage onNavigate={props.onNavigate} logoUrl={props.logoUrl} />;
};

export default AdminPage;
