import React, { useState } from 'react';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import { PortfolioItem, SpecialItem, Genre, Booking, SocialLink, Expense, InventoryItem } from '../App';

export interface AdminPageProps {
  onNavigate: (view: 'home' | 'admin') => void;
  portfolioData: PortfolioItem[];
  onPortfolioUpdate: (data: PortfolioItem[]) => void;
  specialsData: SpecialItem[];
  onSpecialsUpdate: (data: SpecialItem[]) => void;
  showroomData: Genre[];
  onShowroomUpdate: (data: Genre[]) => void;
  bookings: Booking[];
  onBookingsUpdate: (data: Booking[]) => void;
  onManualAddBooking: (booking: Omit<Booking, 'id' | 'bookingType'>) => void;
  expenses: Expense[];
  onExpensesUpdate: (data: Expense[]) => void;
  onAddExpense: (newExpense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  inventory: InventoryItem[];
  onInventoryUpdate: (data: InventoryItem[]) => void;
  onAddInventoryItem: (newItem: Omit<InventoryItem, 'id'>) => void;
  onUpdateInventoryItem: (updatedItem: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
  whatsAppNumber: string;
  onWhatsAppNumberUpdate: (phone: string) => void;
  companyName: string;
  onCompanyNameUpdate: (name: string) => void;
  logoUrl: string;
  onLogoUrlUpdate: (url: string) => void;
  aboutUsImageUrl: string;
  onAboutUsImageUrlUpdate: (url: string) => void;
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
  // FIX: Add onLogout to the props interface
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    props.onNavigate('home');
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} {...props} />;
  }

  return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={props.onNavigate} logoUrl={props.logoUrl} />;
};

export default AdminPage;