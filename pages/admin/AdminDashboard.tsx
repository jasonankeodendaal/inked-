import React, { useState, useEffect } from 'react';
import { Booking } from '../../App';
import { AdminPageProps } from '../AdminPage';

// Import manager components
import SettingsManager from './SettingsManager';
import PortfolioManager from './PortfolioManager';
import ShowroomManager from './ShowroomManager';
import SpecialsManager from './SpecialsManager';
import FinancialsManager from './FinancialsManager';
import TrainingGuide from './TrainingGuide';
import LogSuppliesModal from './components/LogSuppliesModal';
import PWACapabilities from '../../components/PWACapabilities';


// --- ICONS ---
const IconDashboard = ({ className = 'w-6 h-6' }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>;
const IconArt = ({ className = 'w-6 h-6' }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 15.75L5.15938 12.8406C5.58694 12.4131 6.18848 12.1758 6.81562 12.1758C7.44277 12.1758 8.04431 12.4131 8.47187 12.8406L12 16.3687M12 16.3687L14.4719 13.8969C14.8994 13.4693 15.501 13.2319 16.1281 13.2319C16.7553 13.2319 17.3568 13.4693 17.7844 13.8969L21.75 17.8687M12 16.3687L18.75 20.25M21.75 19.5V6C21.75 5.20435 21.4339 4.44129 20.8839 3.89119C20.3338 3.34109 19.5706 3.025 18.75 3.025H5.25C4.45435 3.025 3.69129 3.34109 2.14119 3.89119C2.59109 4.44129 2.275 5.20435 2.275 6V18C2.275 18.7956 2.59109 19.5587 3.14119 20.1088C3.69129 20.6589 4.45435 20.975 5.25 20.975H18.75M16.5 8.25H16.508V8.258H16.5V8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSettings = ({ className = 'w-6 h-6' }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.5 12C19.5 12.418 19.4283 12.8293 19.293 13.218C18.81 14.614 17.614 15.81 16.218 16.293C15.8293 16.4283 15.418 16.5 15 16.5C13.84 16.5 12.842 16.12 12 15.75M4.5 12C4.5 11.582 4.57168 11.1707 4.70697 10.782C5.19001 9.38596 6.38596 8.19001 7.782 7.70697C8.17075 7.57168 8.582 7.5 9 7.5C10.16 7.5 11.158 7.88 12 8.25M12 4.5C12.418 4.5 12.8293 4.57168 13.218 4.70697C14.614 5.19001 15.81 6.38596 16.293 7.782C16.4283 8.17075 16.5 8.582 16.5 9C16.5 10.16 16.12 11.158 15.75 12M12 19.5C11.582 19.5 11.1707 19.4283 10.782 19.293C9.38596 18.81 8.19001 17.614 7.70697 16.218C7.57168 15.8293 7.5 15.418 7.5 15C7.5 13.84 7.88 12.842 8.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconFinancials = ({ className = 'w-6 h-6' }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 8h6m-5 4h.01M18 18H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"></path></svg>;
const IconPWA = ({ className = 'w-6 h-6' }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>;
const IconBack = () => <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const HelpIcon = ({ className = 'w-5 h-5' }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// --- BOOKING MODAL (for Create/Edit) ---
const BookingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (bookingData: Booking) => void;
    bookingToEdit?: Booking | null;
}> = ({ isOpen, onClose, onSave, bookingToEdit }) => {
    
    const getInitialFormData = (): Booking => {
        if (bookingToEdit) {
            return { ...bookingToEdit };
        }
        return {
            id: '', // Will be set on save
            name: '',
            email: '',
            message: '',
            bookingDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            bookingType: 'manual',
            totalCost: undefined,
            amountPaid: undefined,
            paymentMethod: undefined,
        };
    };

    const [formData, setFormData] = useState<Booking>(getInitialFormData());
    
    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData());
        }
    }, [isOpen, bookingToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' && value ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue === '' ? undefined : finalValue } as Booking));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-admin-dark-bg border border-admin-dark-border rounded-lg p-2.5 text-admin-dark-text focus:ring-2 focus:ring-admin-dark-primary outline-none transition";
    const selectClasses = `${inputClasses} appearance-none bg-no-repeat bg-right pr-8`;
    const isEditing = !!bookingToEdit;

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <header>
                        <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Booking' : 'Create Manual Booking'}</h2>
                        <p className="text-sm text-admin-dark-text-secondary mt-1">{isEditing ? 'Update the details for this booking.' : 'Directly add a booking to the system.'}</p>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Client Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Booking Date</label>
                            <input type="date" name="bookingDate" value={formData.bookingDate.split('T')[0]} onChange={handleChange} required className={inputClasses} style={{ colorScheme: 'dark' }} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} required className={selectClasses} style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Description / Message</label>
                         <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className={inputClasses}></textarea>
                    </div>
                    <div className="border-t border-admin-dark-border pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Financials (Optional)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div>
                                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Total Cost (R)</label>
                                <input type="number" name="totalCost" value={formData.totalCost || ''} onChange={handleChange} step="0.01" className={inputClasses}/>
                           </div>
                           <div>
                                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Amount Paid (R)</label>
                                <input type="number" name="amountPaid" value={formData.amountPaid || ''} onChange={handleChange} step="0.01" className={inputClasses}/>
                           </div>
                           <div>
                                <label className="block text-sm font-semibold mb-2 text-admin-dark-text-secondary">Payment Method</label>
                                <select name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} className={selectClasses} style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                    <option value="">Select...</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="transfer">Transfer</option>
                                    <option value="other">Other</option>
                                </select>
                           </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 border-t border-admin-dark-border">
                        <button type="button" onClick={onClose} className="bg-admin-dark-card border border-admin-dark-border px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-opacity-70 transition-opacity">Cancel</button>
                        <button type="submit" className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Save Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- BOOKINGS MANAGER ---
const BookingsManager: React.FC<{ 
    bookings: Booking[], 
    onBookingsUpdate: (data: Booking[]) => void, 
    selectedDate: string | null, 
    onClearDateFilter: () => void, 
    onAddManualBooking: () => void,
    onEditBooking: (booking: Booking) => void,
    onLogSupplies: (booking: Booking) => void,
    startTour: (tourKey: 'dashboard') => void,
}> = ({ bookings, onBookingsUpdate, selectedDate, onClearDateFilter, onAddManualBooking, onEditBooking, onLogSupplies, startTour }) => {
    type StatusFilter = Booking['status'] | 'all';
    const [filter, setFilter] = useState<StatusFilter>('pending');
    
    const filteredByDate = selectedDate
      ? bookings.filter(b => new Date(b.bookingDate).toDateString() === new Date(selectedDate).toDateString())
      : bookings;

    const filteredBookings = (filter === 'all' ? filteredByDate : filteredByDate.filter(b => b.status === filter))
      .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());

    const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
        const updatedBookings = bookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        );
        onBookingsUpdate(updatedBookings);
    };

    const statusStyles: Record<Booking['status'], string> = {
        pending: 'border-yellow-500/50',
        confirmed: 'border-green-500/50',
        completed: 'border-blue-500/50',
        cancelled: 'border-red-500/50',
    };
    
    const availableStatuses: Booking['status'][] = ['confirmed', 'completed', 'cancelled', 'pending'];
    
    return (
        <div data-tour-id="dashboard-bookings-manager" className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-6 h-full">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">Booking Requests</h2>
                    <button onClick={() => startTour('dashboard')} className="p-1.5 text-admin-dark-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Start Dashboard Tour">
                        <HelpIcon />
                    </button>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <div data-tour-id="dashboard-booking-filters" className="flex items-center flex-wrap gap-2 bg-admin-dark-bg p-1 rounded-lg self-start">
                        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as StatusFilter[]).map(status => (
                        <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${filter === status ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>
                            {status}
                        </button>
                        ))}
                    </div>
                     <button data-tour-id="dashboard-manual-booking-button" onClick={onAddManualBooking} className="flex items-center gap-2 bg-admin-dark-primary text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:opacity-90 transition-opacity">
                        + Manual Booking
                    </button>
                </div>
            </header>
            {selectedDate && (
              <div className="bg-admin-dark-bg/50 p-3 rounded-lg mb-4 text-center border border-admin-dark-border">
                  <p className="text-sm text-admin-dark-text">
                      Showing bookings for <span className="font-bold text-white">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                  <button onClick={onClearDateFilter} className="mt-2 text-xs text-admin-dark-primary hover:underline">
                      Show all dates
                  </button>
              </div>
            )}
            <div data-tour-id="dashboard-booking-list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => {
                    return (
                        <div key={booking.id} className={`bg-admin-dark-bg/50 border-l-4 rounded-lg p-4 flex flex-col gap-3 ${statusStyles[booking.status]}`}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-xl flex-shrink-0" title={booking.bookingType === 'manual' ? 'Manual Booking' : 'Online Booking'}>
                                        {booking.bookingType === 'manual' ? '✍️' : '🌐'}
                                    </span>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-white truncate">{booking.name}</p>
                                        <p className="text-xs text-admin-dark-text-secondary truncate">{booking.email}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-white text-sm">{new Date(booking.bookingDate).toLocaleDateString('en-ZA')}</p>
                                    <p className="font-bold text-xs capitalize mt-1">{booking.status}</p>
                                </div>
                            </div>

                            {booking.message && (
                                <p className="text-sm text-admin-dark-text flex-grow">{booking.message}</p>
                            )}
                            
                            {(booking.totalCost || booking.amountPaid) && (
                                <div className="mt-2 pt-3 border-t border-admin-dark-border">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-admin-dark-text-secondary">Financials:</span>
                                        <span className="font-semibold text-blue-400">
                                            R {booking.amountPaid?.toFixed(2) || '0.00'} / {booking.totalCost?.toFixed(2) || '---'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="mt-auto pt-3 border-t border-admin-dark-border">
                                <div className="flex flex-wrap items-center gap-2">
                                    {availableStatuses.filter(s => s !== booking.status).map(status => (
                                        <button key={status} onClick={() => handleStatusChange(booking.id, status)} className="text-xs font-semibold px-2 py-1 rounded-lg capitalize bg-white/5 hover:bg-white/10 transition-colors">
                                            {status}
                                        </button>
                                    ))}
                                    <button onClick={() => onEditBooking(booking)} className="ml-auto flex items-center gap-1.5 p-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 transition-colors" aria-label={`Edit booking for ${booking.name}`}>
                                        <span>✏️</span>
                                    </button>
                                </div>
                                {booking.status === 'completed' && (
                                    <button onClick={() => onLogSupplies(booking)} className="w-full mt-2 text-center bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg font-bold text-xs hover:bg-blue-500/40 transition-colors flex items-center justify-center gap-2">
                                        <span>📦</span> Log Supplies Used
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center py-8 text-admin-dark-text-secondary md:col-span-2 xl:col-span-3">No bookings found for this filter.</p>
            )}
            </div>
        </div>
    );
};


const BookingCalendarWidget: React.FC<{ bookings: Booking[], selectedDate: string | null, onDateSelect: (date: string | null) => void }> = ({ bookings, selectedDate, onDateSelect }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const bookingsByDate = bookings.reduce((acc, booking) => {
        const date = new Date(booking.bookingDate).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + delta);
            return newDate;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const upcomingConfirmed = bookings
        .filter(b => b.status === 'confirmed' && new Date(b.bookingDate) >= new Date(today.toDateString()))
        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
        .slice(0, 5);

    const daysUntil = (dateStr: string) => {
        const diffTime = new Date(dateStr).getTime() - new Date(today.toDateString()).getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-lg p-4 space-y-6">
            <div data-tour-id="dashboard-calendar">
                <h3 className="font-bold text-lg text-white mb-4">Booking Calendar</h3>
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => changeMonth(-1)} className="text-admin-dark-text-secondary hover:text-white">◀</button>
                    <span className="font-semibold text-white text-sm">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeMonth(1)} className="text-admin-dark-text-secondary hover:text-white">▶</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-admin-dark-text-secondary">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="h-6 flex items-center justify-center font-semibold">{d}</div>)}
                    {blanks.map((_, i) => <div key={`b-${i}`}></div>)}
                    {days.map(day => {
                        const dateObj = new Date(year, month, day);
                        const date = dateObj.toDateString();
                        const hasBooking = bookingsByDate[date];
                        const isSelected = selectedDate ? new Date(selectedDate).toDateString() === date : false;
                        const isToday = date === today.toDateString();
                        return (
                            <div key={day} onClick={() => onDateSelect(isSelected ? null : dateObj.toISOString())} className={`h-8 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${isSelected ? 'bg-admin-dark-primary text-white ring-2 ring-white shadow-lg' : isToday ? 'ring-1 ring-admin-dark-primary text-white' : hasBooking ? 'bg-admin-dark-primary/30 text-white font-bold hover:bg-admin-dark-primary/60' : 'hover:bg-white/10'}`}>
                                {day}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div data-tour-id="dashboard-reminder-clock">
                 <h3 className="font-bold text-lg text-white mb-4">Reminder Clock</h3>
                 <div className="space-y-3">
                    {upcomingConfirmed.length > 0 ? upcomingConfirmed.map(booking => {
                        const daysLeft = daysUntil(booking.bookingDate);
                        return (
                            <div key={booking.id} className="bg-admin-dark-bg/50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-white">{booking.name}</p>
                                    <p className="text-xs font-bold text-green-400">
                                        {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days`}
                                    </p>
                                </div>
                                <p className="text-xs text-admin-dark-text-secondary mt-1">{new Date(booking.bookingDate).toLocaleDateString('en-ZA', {weekday: 'long', day: 'numeric', month: 'short'})}</p>
                            </div>
                        );
                    }) : <p className="text-sm text-admin-dark-text-secondary text-center py-8">No upcoming confirmed bookings.</p>}
                 </div>
            </div>
        </div>
    );
};


type AdminTab = 'dashboard' | 'art' | 'financials' | 'settings' | 'pwa';
type ArtSubTab = 'portfolio' | 'showroom';
type TourKey = 'dashboard' | 'art' | 'financials' | 'settings' | 'pwa';

const AdminDashboard: React.FC<AdminPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [artSubTab, setArtSubTab] = useState<ArtSubTab>('portfolio');
  const [previousTab, setPreviousTab] = useState<AdminTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [activeTour, setActiveTour] = useState<TourKey | null>(null);
  const [isSupplyLogOpen, setIsSupplyLogOpen] = useState(false);
  const [bookingForSupplyLog, setBookingForSupplyLog] = useState<Booking | null>(null);

  const handleTabChange = (tab: AdminTab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };
  
  const handleBack = () => {
    setActiveTab(previousTab);
  };

  const handleOpenCreateModal = () => {
    setBookingToEdit(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenEditModal = (booking: Booking) => {
    setBookingToEdit(booking);
    setIsBookingModalOpen(true);
  };
  
  const handleOpenSupplyLog = (booking: Booking) => {
    setBookingForSupplyLog(booking);
    setIsSupplyLogOpen(true);
  };

  const handleSaveBooking = (bookingData: Booking) => {
    if (bookingToEdit) { // Update existing booking
        props.onBookingsUpdate(props.bookings.map(b => b.id === bookingData.id ? bookingData : b));
    } else { // Create new manual booking
        const { id, bookingType, ...newBookingData } = bookingData;
        props.onManualAddBooking(newBookingData);
    }
  };

  const renderDashboard = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
            <BookingsManager 
                bookings={props.bookings} 
                onBookingsUpdate={props.onBookingsUpdate} 
                selectedDate={selectedDate} 
                onClearDateFilter={() => setSelectedDate(null)}
                onAddManualBooking={handleOpenCreateModal}
                onEditBooking={handleOpenEditModal}
                onLogSupplies={handleOpenSupplyLog}
                startTour={setActiveTour}
            />
        </div>
        <div className="space-y-6">
            <BookingCalendarWidget bookings={props.bookings} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            <SpecialsManager specialsData={props.specialsData} onSpecialsUpdate={props.onSpecialsUpdate} />
        </div>
      </div>
  );
  
  const renderArtManagement = () => (
    <div className="space-y-6">
        <div data-tour-id="art-subtabs" className="flex items-center gap-2 bg-admin-dark-bg p-1 rounded-lg self-start max-w-sm">
            <button onClick={() => setArtSubTab('portfolio')} className={`w-full px-4 py-1.5 text-sm font-bold rounded-lg transition-colors capitalize ${artSubTab === 'portfolio' ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>Portfolio</button>
            <button data-tour-id="art-showroom-tab" onClick={() => setArtSubTab('showroom')} className={`w-full px-4 py-1.5 text-sm font-bold rounded-lg transition-colors capitalize ${artSubTab === 'showroom' ? 'bg-admin-dark-primary text-white' : 'text-admin-dark-text-secondary hover:bg-white/10'}`}>Showroom</button>
        </div>
        {artSubTab === 'portfolio' ? (
            <PortfolioManager portfolioData={props.portfolioData} onPortfolioUpdate={props.onPortfolioUpdate} startTour={setActiveTour} />
        ) : (
            <ShowroomManager showroomData={props.showroomData} onShowroomUpdate={props.onShowroomUpdate} startTour={setActiveTour} />
        )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'art':
        return renderArtManagement();
      case 'financials':
        return <FinancialsManager {...props} startTour={setActiveTour} />;
      case 'settings':
        return <SettingsManager {...props} startTour={setActiveTour} />;
      case 'pwa':
        return <PWACapabilities startTour={setActiveTour} />;
      default:
        return renderDashboard();
    }
  };
  
  const navItems: { id: AdminTab, label: string, icon: React.ReactNode }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
      { id: 'art', label: 'Art', icon: <IconArt /> },
      { id: 'financials', label: 'Financials', icon: <IconFinancials /> },
      { id: 'settings', label: 'Settings', icon: <IconSettings /> },
      { id: 'pwa', label: 'PWA', icon: <IconPWA /> },
  ];
  
  return (
    <div className="h-screen font-sans bg-admin-dark-bg text-admin-dark-text flex flex-col overflow-hidden" role="application">
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSave={handleSaveBooking}
        bookingToEdit={bookingToEdit}
      />

      <LogSuppliesModal
        isOpen={isSupplyLogOpen}
        onClose={() => setIsSupplyLogOpen(false)}
        booking={bookingForSupplyLog}
        inventory={props.inventory}
        onAddExpense={props.onAddExpense}
        onUpdateInventoryItem={props.onUpdateInventoryItem}
      />
      
      <TrainingGuide activeTour={activeTour} onClose={() => setActiveTour(null)} />

      <header className="p-4 md:p-6 flex items-center justify-between flex-wrap gap-4 border-b border-admin-dark-border flex-shrink-0">
          <div className="flex items-center gap-4">
               {activeTab !== 'dashboard' && (
                  <button onClick={handleBack} className="p-2 bg-admin-dark-card/80 rounded-full hover:bg-white/10 transition-colors">
                      <IconBack />
                  </button>
              )}
              <img src={props.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-full border-2 border-admin-dark-primary p-1" />
              <div>
                  <p className="text-admin-dark-text-secondary text-sm">Welcome back!</p>
                  <h1 className="font-bold text-xl text-white capitalize">
                      {activeTab === 'dashboard' ? 'Dashboard Overview' : `${activeTab} Management`}
                  </h1>
              </div>
          </div>
           <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <button onClick={() => props.onNavigate('home')} className="text-sm text-center py-2 px-4 text-admin-dark-text-secondary hover:text-white transition-colors">View Site</button>
              <button onClick={props.onLogout} className="bg-admin-dark-card border border-admin-dark-border px-4 py-2 rounded-lg font-bold text-sm text-red-400 hover:bg-red-500/20 transition-colors">Logout</button>
          </div>
      </header>

      <div data-tour-id="main-navigation" className="flex-shrink-0 bg-admin-dark-card/80 backdrop-blur-lg border-b border-admin-dark-border h-16">
          <nav className="container mx-auto grid grid-cols-5 h-full">
              {navItems.map(item => (
                  <button 
                      key={item.id} 
                      onClick={() => handleTabChange(item.id)}
                      className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${activeTab === item.id ? 'text-admin-dark-primary bg-admin-dark-primary/10' : 'text-admin-dark-text-secondary hover:text-white'}`}
                      aria-current={activeTab === item.id}
                  >
                      {item.icon}
                      <span className="text-[10px] font-bold capitalize">{item.label}</span>
                  </button>
              ))}
          </nav>
      </div>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto" id="admin-main-content">
        {renderContent()}
      </main>

    </div>
  );
};

export default AdminDashboard;
