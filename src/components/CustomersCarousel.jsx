import { useState } from 'react';
import { Icon } from '@iconify/react';

const CustomersCarousel = () => {
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Mock data for customers
    const customers = [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@company.com",
            company: "Tech Solutions Inc.",
            phone: "+91 98765 43210",
            location: "Bangaluru",
            totalBookings: 15,
            activeBookings: 3,
            totalSpent: "₹25,000",
            status: "active",
            membership: "Premium",
            joinDate: "Jan 2024"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.j@startup.co",
            company: "Innovation Labs",
            phone: "+91 87654 32109",
            location: "Mumbai",
            totalBookings: 8,
            activeBookings: 1,
            totalSpent: "₹12,500",
            status: "active",
            membership: "Standard",
            joinDate: "Mar 2024"
        },
        {
            id: 3,
            name: "Michael Chen",
            email: "mchen@enterprise.com",
            company: "Global Enterprises",
            phone: "+91 76543 21098",
            location: "Hyderabad",
            totalBookings: 22,
            activeBookings: 5,
            totalSpent: "₹45,000",
            status: "active",
            membership: "Premium",
            joinDate: "Dec 2023"
        },
        {
            id: 4,
            name: "Emily Davis",
            email: "emily.d@creative.com",
            company: "Creative Studios",
            phone: "+91 65432 10987",
            location: "Pune",
            totalBookings: 6,
            activeBookings: 0,
            totalSpent: "₹8,500",
            status: "inactive",
            membership: "Standard",
            joinDate: "Feb 2024"
        },
        {
            id: 5,
            name: "David Wilson",
            email: "dwilson@consulting.com",
            company: "Strategic Consulting",
            phone: "+91 54321 09876",
            location: "Chennai",
            totalBookings: 12,
            activeBookings: 2,
            totalSpent: "₹18,000",
            status: "active",
            membership: "Premium",
            joinDate: "Jan 2024"
        }
    ];

    const handleNext = () => {
        setCurrentCustomerIndex((prev) => (prev + 1) % customers.length);
        setSelectedCustomer(null);
    };

    const handlePrevious = () => {
        setCurrentCustomerIndex((prev) => (prev - 1 + customers.length) % customers.length);
        setSelectedCustomer(null);
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (isMinimized) {
            setSelectedCustomer(null);
        }
    };

    const currentCustomer = customers[currentCustomerIndex];

    if (isMinimized) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Icon icon="mdi:account" className="w-6 h-6 text-purple-500" />
                        <div>
                            <h3 className="font-semibold text-gray-800">{currentCustomer.name}</h3>
                            <p className="text-sm text-gray-500">{currentCustomer.company}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevious}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-500">
                            {currentCustomerIndex + 1} / {customers.length}
                        </span>
                        <button
                            onClick={handleNext}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleMinimize}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <Icon icon="mdi:account-group" className="w-6 h-6 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Management Customers</h2>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center">
                        <Icon icon="mdi:plus" className="mr-2" />
                        Manage All Customers
                    </button>
                    <button
                        onClick={toggleMinimize}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <Icon icon="mdi:chevron-up" className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Customer Card */}
            <div className="relative">
                <div 
                    className={`bg-white border border-gray-200 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCustomer?.id === currentCustomer.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleCustomerClick(currentCustomer)}
                >
                    {/* Customer Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <Icon icon="mdi:account" className="w-8 h-8 text-purple-500" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{currentCustomer.name}</h3>
                                <p className="text-sm text-gray-500">Company: {currentCustomer.company}</p>
                            </div>
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-6 h-6 text-purple-500" />
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:email" className="w-5 h-5 text-purple-500" />
                            <span className="text-gray-700 text-sm">{currentCustomer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:phone" className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700 text-sm">{currentCustomer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:map-marker" className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700 text-sm">{currentCustomer.location}</span>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center space-x-4">
                        <span className="text-green-600 font-medium">Active: {currentCustomer.activeBookings}</span>
                        <span className="text-blue-600 font-medium">Total: {currentCustomer.totalBookings}</span>
                        <span className="text-purple-600 font-medium">Spent: {currentCustomer.totalSpent}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentCustomer.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {currentCustomer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentCustomer.membership === 'Premium' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {currentCustomer.membership}
                        </span>
                    </div>
                </div>

                {/* Customer Details (Expanded View) */}
                {selectedCustomer?.id === currentCustomer.id && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{currentCustomer.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{currentCustomer.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Company:</span>
                                        <span className="font-medium">{currentCustomer.company}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-medium">{currentCustomer.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Booking Statistics</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Bookings:</span>
                                        <span className="font-medium">{currentCustomer.totalBookings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Active Bookings:</span>
                                        <span className="font-medium text-green-600">{currentCustomer.activeBookings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Spent:</span>
                                        <span className="font-medium text-purple-600">{currentCustomer.totalSpent}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Member Since:</span>
                                        <span className="font-medium">{currentCustomer.joinDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 mr-3">
                                View All Bookings
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                Edit Customer
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                    <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                    <span>Previous</span>
                </button>
                
                <div className="flex space-x-2">
                    {customers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentCustomerIndex(index);
                                setSelectedCustomer(null);
                            }}
                            className={`w-3 h-3 rounded-full ${
                                index === currentCustomerIndex ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                    <span>Next</span>
                    <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CustomersCarousel;
