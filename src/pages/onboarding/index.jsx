import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Onboarding = () => {
    const [searchParams] = useSearchParams();
    const isCustomer = searchParams.get('customer') === 'true';
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        branch: '',
        role: ''
    });

    const steps = [
        { id: 1, title: 'Personal Information', icon: 'mdi:account' },
        { id: 2, title: 'Company Details', icon: 'mdi:office-building' },
        { id: 3, title: 'Preferences', icon: 'mdi:cog' },
        { id: 4, title: 'Review & Submit', icon: 'mdi:check-circle' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Onboarding data:', formData);
        // Here you would typically send the data to your backend
        alert('Onboarding completed successfully!');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Company Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter branch name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your role"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="notifications" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="notifications" className="text-sm text-gray-700">Receive email notifications</label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="marketing" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="marketing" className="text-sm text-gray-700">Receive marketing communications</label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="terms" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="terms" className="text-sm text-gray-700">I agree to the terms and conditions</label>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Review & Submit</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{formData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{formData.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Company</p>
                                    <p className="font-medium">{formData.company}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Branch</p>
                                    <p className="font-medium">{formData.branch}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-medium">{formData.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isCustomer ? 'Customer Onboarding' : 'Onboarding'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Complete your profile to get started
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step.id 
                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                        : 'bg-white border-gray-300 text-gray-500'
                                }`}>
                                    {currentStep > step.id ? (
                                        <Icon icon="mdi:check" className="w-5 h-5" />
                                    ) : (
                                        <Icon icon={step.icon} className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${
                                        currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                                    }`}>
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-0.5 mx-4 ${
                                        currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`px-6 py-2 rounded-lg font-medium ${
                            currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <div className="flex space-x-3">
                        {currentStep < steps.length ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                            >
                                Complete Onboarding
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
