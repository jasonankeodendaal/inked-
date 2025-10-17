import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import { PortfolioItem, SpecialItem, Genre, Booking, SocialLink, Expense, InventoryItem } from '../App';

export interface AdminPageProps {
  onNavigate: (view: 'home' | 'admin') => void;
  onLogout: () => void;

  // Portfolio
  portfolioData: PortfolioItem[];
  onAddPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  onUpdatePortfolioItem: (item: PortfolioItem) => void;
  onDeletePortfolioItem: (id: string) => void;

  // Specials
  specialsData: SpecialItem[];
  onAddSpecialItem: (item: Omit<SpecialItem, 'id'>) => void;
  onUpdateSpecialItem: (item: SpecialItem) => void;
  onDeleteSpecialItem: (id: string) => void;

  // Showroom
  showroomData: Genre[];
  onAddShowroomGenre: (item: Omit<Genre, 'id'>) => void;
  onUpdateShowroomGenre: (item: Genre) => void;
  onDeleteShowroomGenre: (id: string) => void;

  // Bookings
  bookings: Booking[];
  onUpdateBooking: (booking: Booking) => void;
  onManualAddBooking: (booking: Omit<Booking, 'id' | 'bookingType'>) => void;

  // Expenses
  expenses: Expense[];
  onAddExpense: (newExpense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;

  // Inventory
  inventory: InventoryItem[];
  onAddInventoryItem: (newItem: Omit<InventoryItem, 'id'>) => void;
  onUpdateInventoryItem: (updatedItem: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
  
  // Settings
  onSaveAllSettings: (settings: any) => void;
  onClearAllData: () => void;

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
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        props.onLogout(); // This navigates to 'home' as defined in App.tsx
      })
      .catch((error) => {
        console.error("Sign out error", error);
        // Still log out on the client-side even if Firebase signout fails
        setIsAuthenticated(false);
        props.onLogout();
      });
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} {...props} />;
  }
  
  return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={props.onNavigate} logoUrl={props.logoUrl} />;
};

export default AdminPage;