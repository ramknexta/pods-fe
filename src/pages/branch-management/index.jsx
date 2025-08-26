import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const BranchManagement = () => {
    const [branches, setBranches] = useState([
        {
            id: 1,
            name: "Head office",
            address: "No.9, Old-No.523, 2nd Floor, 33rd Cross, Jaya Nagar 4th Block Bangaluru, Karnataka - 560011",
            city: "Bangaluru",
            state: "Karnataka",
            country: "India",
            pincode: "560011",
            gst: "29AADCG4992P1ZP",
            location: "Bangaluru",
            rooms: 0,
            totalCapacity: 0,
            status: "active"
        }
    ]);

    const [showAddBranchModal, setShowAddBranchModal] = useState(false);

    // Form states
    const [branchForm, setBranchForm] = useState({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        gst: '',
        location: ''
    });

    const handleBranchSubmit = (e) => {
        e.preventDefault();
        const newBranch = {
            id: Date.now(),
            name: branchForm.name,
            address: `${branchForm.addressLine1} ${branchForm.addressLine2}`.trim(),
            city: branchForm.city,
            state: branchForm.state,
            country: branchForm.country,
            pincode: branchForm.pincode,
            gst: branchForm.gst,
            location: branchForm.location,
            rooms: 0,
            totalCapacity: 0,
            status: "active"
        };
        setBranches([...branches, newBranch]);
        setShowAddBranchModal(false);
        setBranchForm({
            name: '', addressLine1: '', addressLine2: '', city: '', state: '', 
            country: '', pincode: '', gst: '', location: ''
        });
    };

    const deleteBranch = (branchId) => {
        setBranches(branches.filter(branch => branch.id !== branchId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
                                <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
                                Back to Management Companies
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                                <p className="text-gray-600">Manage branches for your management companies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Branches Section Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Branches - Knexta</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            Role: super-admin | Permissions: Add Edit Delete
                        </div>
                        <button
                            onClick={() => setShowAddBranchModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                            <Icon icon="mdi:plus" className="mr-2" />
                            Add Branch
                        </button>
                    </div>
                </div>

                {/* Branches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* Branch Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <Icon icon="mdi:map-marker" className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50">
                                        <Icon icon="mdi:eye" className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100">
                                        <Icon icon="mdi:pencil" className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteBranch(branch.id)}
                                        className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                    >
                                        <Icon icon="mdi:delete" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Branch Information */}
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{branch.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                                <p className="text-sm text-gray-500">
                                    {branch.country || 'Country not specified'}
                                </p>
                            </div>

                            {/* Branch Tags */}
                            <div className="flex space-x-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    {branch.rooms} Rooms
                                </span>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                    GST: {branch.gst}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {branches.length === 0 && (
                    <div className="text-center py-12">
                        <Icon icon="mdi:office-building" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No branches configured</h3>
                        <p className="text-gray-500 mb-4">Get started by adding your first branch.</p>
                        <button
                            onClick={() => setShowAddBranchModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add First Branch
                        </button>
                    </div>
                )}
            </div>

            {/* Add Branch Modal */}
            {showAddBranchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Branch to Knexta</h2>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <div className="flex items-start space-x-2">
                                    <Icon icon="mdi:lightbulb" className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        Recommended Fields: Branch Name, Address, and GST are required fields for branch registration.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleBranchSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={branchForm.name}
                                        onChange={(e) => setBranchForm({...branchForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Recommended: Use descriptive names like 'Main Branch' or 'Downtown Office'"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                        <input
                                            type="text"
                                            value={branchForm.addressLine1}
                                            onChange={(e) => setBranchForm({...branchForm, addressLine1: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                        <input
                                            type="text"
                                            value={branchForm.addressLine2}
                                            onChange={(e) => setBranchForm({...branchForm, addressLine2: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={branchForm.city}
                                            onChange={(e) => setBranchForm({...branchForm, city: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={branchForm.state}
                                            onChange={(e) => setBranchForm({...branchForm, state: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={branchForm.country}
                                            onChange={(e) => setBranchForm({...branchForm, country: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={branchForm.pincode}
                                            onChange={(e) => setBranchForm({...branchForm, pincode: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                                        <input
                                            type="text"
                                            required
                                            value={branchForm.gst}
                                            onChange={(e) => setBranchForm({...branchForm, gst: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                    <input
                                        type="text"
                                        required
                                        value={branchForm.location}
                                        onChange={(e) => setBranchForm({...branchForm, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddBranchModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Add Branch
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
