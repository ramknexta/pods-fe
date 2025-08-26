import { useState } from 'react';
import { Icon } from '@iconify/react';

const BranchesCarousel = () => {
    const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Mock data for branches
    const branches = [
        {
            id: 1,
            name: "Head Office",
            management: "Knexta",
            location: "Bangaluru",
            rooms: 12,
            capacity: 48,
            available: 8,
            booked: 4,
            status: "active"
        },
        {
            id: 2,
            name: "Downtown Branch",
            management: "Knexta",
            location: "Mumbai",
            rooms: 8,
            capacity: 32,
            available: 5,
            booked: 3,
            status: "active"
        },
        {
            id: 3,
            name: "Tech Hub",
            management: "Knexta",
            location: "Hyderabad",
            rooms: 15,
            capacity: 60,
            available: 10,
            booked: 5,
            status: "active"
        },
        {
            id: 4,
            name: "Innovation Center",
            management: "Knexta",
            location: "Pune",
            rooms: 6,
            capacity: 24,
            available: 3,
            booked: 3,
            status: "maintenance"
        },
        {
            id: 5,
            name: "Startup Zone",
            management: "Knexta",
            location: "Chennai",
            rooms: 10,
            capacity: 40,
            available: 7,
            booked: 3,
            status: "active"
        }
    ];

    const handleNext = () => {
        setCurrentBranchIndex((prev) => (prev + 1) % branches.length);
        setSelectedBranch(null);
    };

    const handlePrevious = () => {
        setCurrentBranchIndex((prev) => (prev - 1 + branches.length) % branches.length);
        setSelectedBranch(null);
    };

    const handleBranchClick = (branch) => {
        setSelectedBranch(selectedBranch?.id === branch.id ? null : branch);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (isMinimized) {
            setSelectedBranch(null);
        }
    };

    const currentBranch = branches[currentBranchIndex];

    if (isMinimized) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Icon icon="mdi:office-building" className="w-6 h-6 text-blue-500" />
                        <div>
                            <h3 className="font-semibold text-gray-800">{currentBranch.name}</h3>
                            <p className="text-sm text-gray-500">{currentBranch.location}</p>
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
                            {currentBranchIndex + 1} / {branches.length}
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
                    <Icon icon="mdi:office-building" className="w-6 h-6 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Management Branches</h2>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
                        <Icon icon="mdi:plus" className="mr-2" />
                        Manage All Branches
                    </button>
                    <button
                        onClick={toggleMinimize}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <Icon icon="mdi:chevron-up" className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Branch Card */}
            <div className="relative">
                <div 
                    className={`bg-white border border-gray-200 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedBranch?.id === currentBranch.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleBranchClick(currentBranch)}
                >
                    {/* Branch Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <Icon icon="mdi:office-building" className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{currentBranch.name}</h3>
                                <p className="text-sm text-gray-500">Management: {currentBranch.management}</p>
                            </div>
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* Branch Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:map-marker" className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700">{currentBranch.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:door" className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700">{currentBranch.rooms} Rooms</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:account-group" className="w-5 h-5 text-orange-500" />
                            <span className="text-gray-700">{currentBranch.capacity} Capacity</span>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center space-x-4">
                        <span className="text-green-600 font-medium">Available: {currentBranch.available}</span>
                        <span className="text-red-600 font-medium">Booked: {currentBranch.booked}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentBranch.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {currentBranch.status === 'active' ? 'Active' : 'Maintenance'}
                        </span>
                    </div>
                </div>

                {/* Branch Details (Expanded View) */}
                {selectedBranch?.id === currentBranch.id && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Branch Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Room Information</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Rooms:</span>
                                        <span className="font-medium">{currentBranch.rooms}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Available Rooms:</span>
                                        <span className="font-medium text-green-600">{currentBranch.available}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Booked Rooms:</span>
                                        <span className="font-medium text-red-600">{currentBranch.booked}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Utilization Rate:</span>
                                        <span className="font-medium">
                                            {Math.round((currentBranch.booked / currentBranch.rooms) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Capacity & Performance</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Capacity:</span>
                                        <span className="font-medium">{currentBranch.capacity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Occupancy:</span>
                                        <span className="font-medium">
                                            {Math.round((currentBranch.booked * 4 / currentBranch.capacity) * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            currentBranch.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {currentBranch.status === 'active' ? 'Active' : 'Maintenance'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                View All Bookings
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
                    {branches.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentBranchIndex(index);
                                setSelectedBranch(null);
                            }}
                            className={`w-3 h-3 rounded-full ${
                                index === currentBranchIndex ? 'bg-blue-600' : 'bg-gray-300'
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

export default BranchesCarousel;
