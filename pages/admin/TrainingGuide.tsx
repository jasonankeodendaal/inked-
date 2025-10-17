import React, { useState, useEffect } from 'react';

interface TrainingGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const guideSteps = [
    {
        title: "👋 Welcome to the Training Guide!",
        content: "This interactive guide will walk you through every feature of your admin dashboard. Use the 'Next' and 'Previous' buttons to navigate. Let's get started!",
        highlight: 'hidden'
    },
    {
        title: "📱 Main Navigation",
        content: "This is your main navigation bar, always accessible at the bottom of the screen. It allows you to quickly switch between the main sections of your admin panel: Dashboard, Art, Financials, and Settings.",
        highlight: 'absolute bottom-0 left-0 w-full h-16 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "📊 Dashboard Overview",
        content: "This is your home base. It gives you an at-a-glance overview of your business, focusing on booking requests and upcoming appointments. On larger screens, the layout expands to show more information side-by-side.",
        highlight: 'absolute top-28 bottom-20 left-4 right-4 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "Filter Bookings",
        content: "Quickly filter the booking list by status. The default view is 'Pending' so you can see new requests right away. Click any status to change the view.",
        highlight: 'absolute top-40 left-6 w-[calc(100%-3rem)] h-14 sm:w-auto sm:left-auto sm:right-44 lg:top-40 lg:right-56 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "✍️ Manual Bookings",
        content: "Click this button to open a form for adding bookings manually. This is perfect for appointments made over the phone, in person, or for blocking out time.",
        highlight: 'absolute top-40 right-6 w-40 h-10 lg:top-40 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "🗓️ Booking Calendar",
        content: "This calendar shows which days have bookings. Click on a date to filter the 'Booking Requests' list to only show appointments for that specific day. Click it again to clear the filter.",
        highlight: 'absolute top-1/3 left-4 right-4 h-64 lg:left-[68%] lg:w-[30%] lg:top-36 lg:h-[40%] border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "⏰ Reminder Clock",
        content: "This widget automatically shows your next 5 upcoming *confirmed* appointments, helping you prepare for the days ahead without having to search for them.",
        highlight: 'absolute top-2/3 left-4 right-4 h-1/4 lg:left-[68%] lg:w-[30%] lg:top-[58%] lg:h-[38%] border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "🎨 Art Management",
        content: "The 'Art' tab is where you manage all your visual content. It's split into two sections: 'Portfolio' for individual art pieces and 'Showroom' to organize them into public-facing galleries.",
        highlight: 'absolute bottom-0 left-[25%] w-1/4 h-16 border-4 border-admin-dark-primary rounded-lg'
    },
    {
        title: "🖼️ Portfolio Manager",
        content: "Here you can add, edit, and delete every piece of artwork. You can upload a primary image, a story, a full gallery, and even a video. Use the 'Feature in Hero' toggle to showcase a piece on your homepage's main banner.",
        highlight: 'absolute top-28 bottom-20 left-4 right-4 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "🖼️ Showroom Manager",
        content: "In the 'Showroom' sub-tab, you can create genres (e.g., 'Fine-Line', 'Sleeves'). Then, you can add items from your portfolio to these genres to organize your 'Flash Wall' page for visitors.",
        highlight: 'absolute top-28 bottom-20 left-4 right-4 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "💰 Financials & Stock",
        content: "The 'Financials' tab helps you track the health of your business. It includes an Expense Tracker and an Inventory Manager for your studio supplies.",
        highlight: 'absolute bottom-0 left-[50%] w-1/4 h-16 border-4 border-admin-dark-primary rounded-lg'
    },
    {
        title: "📈 Financial Summary",
        content: "At the top of the Financials page, you'll find a quick summary of your total revenue (from completed bookings), total expenses logged, and the resulting net profit.",
        highlight: 'absolute top-40 left-4 right-4 h-24 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "⚙️ Site Settings",
        content: "The 'Settings' tab contains all the global configurations for your website, such as your company name, logo, contact details, social media links, and billing information for invoices.",
        highlight: 'absolute bottom-0 right-0 w-1/4 h-16 border-4 border-admin-dark-primary rounded-lg'
    },
     {
        title: "🚨 Danger Zone",
        content: "At the bottom of the Settings page is the 'Danger Zone'. Be very careful here! This section contains actions that can permanently delete data, like the 'Clear All Mock Data' button.",
        highlight: 'absolute bottom-24 left-4 right-4 h-40 lg:w-1/2 lg:left-1/4 border-4 border-admin-dark-primary rounded-lg shadow-lg'
    },
    {
        title: "🎉 You're all set!",
        content: "Congratulations, you've completed the tour! You now know how to manage every aspect of your website. If you ever need a refresher, just open this guide again.",
        highlight: 'hidden'
    },
];


const TrainingGuide: React.FC<TrainingGuideProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentStep(0); // Reset on open
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, guideSteps.length - 1));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    if (!isOpen) return null;

    const step = guideSteps[currentStep];
    const progress = ((currentStep + 1) / guideSteps.length) * 100;
    const isLastStep = currentStep === guideSteps.length - 1;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-end p-4 animate-fade-in" role="dialog" aria-modal="true">
            {/* Clickaway background */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Highlight Box */}
            <div className={`transition-all duration-500 ease-in-out pointer-events-none ${step.highlight}`}></div>

            {/* Content Box */}
            <div className="relative z-10 bg-admin-dark-card border border-admin-dark-border rounded-xl shadow-2xl w-full max-w-2xl text-white p-6 space-y-4">
                <header>
                    <h2 className="text-xl font-bold">{step.title}</h2>
                    <p className="text-admin-dark-text-secondary mt-2 text-sm leading-relaxed">{step.content}</p>
                </header>

                {/* Progress Bar */}
                <div className="w-full bg-admin-dark-bg rounded-full h-2.5">
                    <div className="bg-admin-dark-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-6 py-2 rounded-lg font-bold text-sm text-admin-dark-text-secondary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>
                    {isLastStep ? (
                         <button onClick={onClose} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            Finish
                        </button>
                    ) : (
                        <button onClick={nextStep} className="bg-admin-dark-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            Next
                        </button>
                    )}
                </div>
            </div>
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-2xl" aria-label="Close training guide">
                &times;
            </button>
        </div>
    );
};

export default TrainingGuide;