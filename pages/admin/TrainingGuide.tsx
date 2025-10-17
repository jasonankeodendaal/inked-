import React, { useState, useEffect, useLayoutEffect } from 'react';

type TourKey = 'dashboard' | 'art' | 'financials' | 'settings' | 'pwa';

interface GuideStep {
    title: string;
    content: string;
    targetId: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

const tours: Record<TourKey, GuideStep[]> = {
    dashboard: [
        {
            targetId: 'welcome',
            title: "👋 Welcome to the Dashboard!",
            content: "This is your home base. It gives you an at-a-glance overview of your business, focusing on booking requests and upcoming appointments.",
        },
        {
            targetId: 'dashboard-bookings-manager',
            title: "Manage Bookings",
            content: "This is the main panel for managing all incoming booking requests, whether they come from your website or you add them manually.",
            placement: 'top',
        },
        {
            targetId: 'dashboard-booking-filters',
            title: "Filter Bookings",
            content: "Quickly filter the booking list by status. The default view is 'Pending' so you can see new requests right away.",
            placement: 'bottom',
        },
        {
            targetId: 'dashboard-manual-booking-button',
            title: "Manual Bookings",
            content: "Click this to add bookings manually. This is perfect for appointments made over the phone, in person, or for blocking out time.",
            placement: 'bottom',
        },
        {
            targetId: 'dashboard-booking-list',
            title: "Booking List",
            content: "All bookings matching your current filter appear here. You can update their status, edit details, or log supplies used for completed appointments.",
            placement: 'top',
        },
        {
            targetId: 'dashboard-calendar',
            title: "Booking Calendar",
            content: "This calendar shows which days have bookings. Click on a date to filter the list to only show appointments for that day.",
            placement: 'left',
        },
        {
            targetId: 'dashboard-reminder-clock',
            title: "Reminder Clock",
            content: "This widget automatically shows your next 5 upcoming *confirmed* appointments, helping you prepare for the days ahead.",
            placement: 'left',
        },
        {
            targetId: 'dashboard-specials-manager',
            title: "Specials Manager",
            content: "This is a quick-access panel to manage your specials and flash designs directly from the dashboard.",
            placement: 'left',
        },
    ],
    art: [
        {
            targetId: 'art-subtabs',
            title: "🎨 Art Management",
            content: "This section is split into two parts: 'Portfolio', where you manage individual art pieces, and 'Showroom', where you organize them into public-facing galleries.",
        },
        {
            targetId: 'add-new-item-button',
            title: "Add New Portfolio Item",
            content: "Click here to open the form for adding a new art piece. You can upload multiple images and even a video.",
            placement: 'bottom',
        },
        {
            targetId: 'portfolio-item-list',
            title: "Portfolio List",
            content: "All your uploaded art pieces are listed here. You can edit or delete them, and see if they have video content.",
        },
        {
            targetId: 'feature-toggle',
            title: "Feature in Hero",
            content: "Use this toggle to select which pieces are 'featured'. Featured items will appear in the animated carousel on your website's homepage.",
            placement: 'top',
        },
        {
            targetId: 'art-showroom-tab',
            title: "Showroom Tab",
            content: "Now, click the 'Showroom' tab to see how to organize your portfolio into genres for your site's 'Flash Wall'.",
            placement: 'bottom',
        },
        {
            targetId: 'add-genre-button',
            title: "Add New Genre",
            content: "Click here to create a new category for your showroom, like 'Fine-Line' or 'Sleeves'.",
            placement: 'bottom'
        },
        {
            targetId: 'showroom-genre-list',
            title: "Manage Genres",
            content: "Here you can rename genres and add available portfolio items to them. You can also drag-and-drop items between genres and reorder the genres themselves.",
        },
    ],
    financials: [
        {
            targetId: 'financials-month-navigator',
            title: '💰 Financials & Stock',
            content: "This section helps you track business performance. Use these arrows to navigate between different months.",
        },
        {
            targetId: 'financials-summary-cards',
            title: 'Monthly Summary',
            content: "These cards provide a quick summary for the selected month: total revenue from completed bookings, total logged expenses, and the resulting net profit.",
        },
        {
            targetId: 'financials-yearly-chart',
            title: 'Yearly Overview',
            content: "This chart visualizes the net profit for each month of the selected year, giving you a clear view of your financial trends.",
        },
        {
            targetId: 'financials-subtabs',
            title: 'Breakdown, Expenses, & Inventory',
            content: "Use these tabs to switch between viewing a detailed monthly breakdown, managing individual expenses, and tracking your studio's supply inventory.",
        },
        {
            targetId: 'financials-add-expense-button',
            title: 'Add an Expense',
            content: "Switch to the 'Expenses' tab and click this button to log a new business expense for the selected month.",
            placement: 'bottom',
        },
        {
            targetId: 'financials-add-inventory-button',
            title: 'Add to Inventory',
            content: "In the 'Inventory' tab, click this button to add new supplies to your stock, like inks, needles, or cleaning supplies.",
            placement: 'bottom',
        },
    ],
    settings: [
        {
            targetId: 'settings-company-details',
            title: '⚙️ Site Settings',
            content: "This page contains all the global configurations for your website. Let's start with Company Details.",
        },
        {
            targetId: 'settings-page-content',
            title: 'Page Content',
            content: "Here you can customize the titles and descriptions for sections like the Showroom (or 'Flash Wall').",
        },
        {
            targetId: 'settings-contact-info',
            title: 'Contact Information',
            content: "Update your studio's address, phone number, email, and WhatsApp number. These will be displayed in the footer and used for contact forms.",
        },
        {
            targetId: 'settings-billing-info',
            title: 'Billing & Invoicing',
            content: "Enter your bank details here. This information can be used for generating invoices in the future.",
        },
        {
            targetId: 'settings-data-management',
            title: 'Data Management',
            content: "You can download a single JSON file containing ALL of your site's data as a backup, or restore your site from a previously saved backup file.",
            placement: 'top',
        },
        {
            targetId: 'settings-danger-zone',
            title: '🚨 Danger Zone',
            content: "Be careful here! This section contains actions that permanently delete data, like clearing all the mock content from the site.",
            placement: 'top',
        },
    ],
    pwa: [
        {
            targetId: 'pwa-sw-features',
            title: '🚀 PWA Capabilities',
            content: "This panel shows the status of advanced features powered by your app's Service Worker, which runs in the background.",
        },
        {
            targetId: 'pwa-permissions',
            title: 'Request Permissions',
            content: "Some features, like Push Notifications and Periodic Sync, require the user's permission. You can test the permission prompts with these buttons.",
            placement: 'bottom',
        },
        {
            targetId: 'pwa-manifest-features',
            title: 'App Manifest Features',
            content: "This list shows all the OS-level integrations defined in your app's manifest, like Shortcuts and File Handling, which make it feel like a native application.",
            placement: 'top',
        }
    ]
};

const popoverPositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-4',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-4',
    left: 'right-full top-1/2 -translate-y-1/2 mr-4',
    right: 'left-full top-1/2 -translate-y-1/2 ml-4',
}

interface TrainingGuideProps {
    activeTour: TourKey | null;
    onClose: () => void;
}

const TrainingGuide: React.FC<TrainingGuideProps> = ({ activeTour, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState({});
    const [popoverStyle, setPopoverStyle] = useState({});
    const [currentSteps, setCurrentSteps] = useState<GuideStep[]>([]);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (activeTour) {
            setCurrentSteps(tours[activeTour] || []);
            setCurrentStep(0);
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [activeTour]);

    useLayoutEffect(() => {
        if (!activeTour || currentSteps.length === 0) return;

        const step = currentSteps[currentStep];
        if (!step) return;

        if (step.targetId === 'welcome') {
             setHighlightStyle({ display: 'none' });
             setPopoverStyle({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 202 });
             return;
        }

        const mainContent = document.getElementById('admin-main-content');
        const targetElement = document.querySelector(`[data-tour-id="${step.targetId}"]`);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            
            const updatePosition = () => {
                const rect = targetElement.getBoundingClientRect();
                 setHighlightStyle({
                    position: 'fixed',
                    top: `${rect.top - 4}px`,
                    left: `${rect.left - 4}px`,
                    width: `${rect.width + 8}px`,
                    height: `${rect.height + 8}px`,
                    display: 'block',
                    zIndex: 201,
                });
                setPopoverStyle({
                    position: 'fixed',
                    top: `${rect.top}px`,
                    left: `${rect.left}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    zIndex: 202,
                })
            };
            
            // Initial position update, then another after scroll settles
            updatePosition();
            setTimeout(updatePosition, 500);
        } else {
            console.warn(`Tour target not found: ${step.targetId}`);
            setHighlightStyle({ display: 'none' });
        }

    }, [currentStep, activeTour, currentSteps]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, currentSteps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    if (!activeTour) return null;

    const step = currentSteps[currentStep];
    if (!step) return null;
    
    const progress = ((currentStep + 1) / currentSteps.length) * 100;
    const isLastStep = currentStep === currentSteps.length - 1;

    return (
        <div className={`fixed inset-0 z-[200] transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
            
            <div className="border-4 border-admin-dark-primary rounded-lg shadow-2xl transition-all duration-500 ease-in-out pointer-events-none" style={highlightStyle}></div>
            
            <div style={popoverStyle} className="pointer-events-none">
                 <div className={`relative w-80 sm:w-96 bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-2xl text-white p-6 space-y-4 pointer-events-auto ${popoverPositions[step.placement || 'bottom']}`}>
                    <header>
                        <h2 className="text-xl font-bold">{step.title}</h2>
                        <p className="text-admin-dark-text-secondary mt-2 text-sm leading-relaxed">{step.content}</p>
                    </header>
                    <div className="w-full bg-admin-dark-bg rounded-full h-2.5">
                        <div className="bg-admin-dark-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={prevStep} disabled={currentStep === 0} className="px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition">Previous</button>
                        {isLastStep ? (
                            <button onClick={handleClose} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Finish</button>
                        ) : (
                            <button onClick={nextStep} className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Next</button>
                        )}
                    </div>
                     <button onClick={handleClose} className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-admin-dark-card border border-admin-dark-border rounded-full text-white/70 hover:text-white transition-colors" aria-label="Close training guide">&times;</button>
                 </div>
            </div>
        </div>
    );
};

export default TrainingGuide;
