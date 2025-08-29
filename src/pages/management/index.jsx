import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Admin from "../../layout/Admin.jsx";
import {
    useAddBranchMutation,
    useDeleteBranchMutation,
    useEditBranchMutation,
    useFetchDashboardDataQuery
} from "../../store/slices/management/managementApi.jsx";
import ManagementCard from "./ManagementCard.jsx";
import CustomerCard from "./CustomerCard.jsx";
import { handleTitleChange } from "../../store/slices/auth/authSlice.js"
import BranchModal from "./BranchModel.jsx";
import {useNavigate} from "react-router-dom";

const Management = () => {
    const dispatch = useDispatch();
    const { data, isLoading, error, refetch } = useFetchDashboardDataQuery();
    const [addBranch] = useAddBranchMutation();
    const [editBranch] = useEditBranchMutation();
    const [deleteBranch] = useDeleteBranchMutation();

    const [branchForm, setBranchForm] = useState(getInitialBranchFormState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

    const { branches = [], companies = [] } = data || {};

    useEffect(() => {
        dispatch(handleTitleChange("Management"));
    }, [dispatch]);

    // Helper functions
    function getInitialBranchFormState() {
        return {
            branch_name: "",
            address_line1: "",
            address_line2: "",
            location: "",
            state: "",
            country: "IN",
            pincode: "",
            gst: ""
        };
    }

    const validateForm = () => {
        const errors = {};

        if (!branchForm.branch_name.trim()) {
            errors.branch_name = "Branch name is required";
        }

        if (!branchForm.address_line1.trim()) {
            errors.address_line1 = "Address is required";
        }

        if (!branchForm.gst.trim()) {
            errors.gst = "GST Number is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setBranchForm(getInitialBranchFormState());
        setFormErrors({});
        setEditingBranch(null);
        setIsEditMode(false);
    };

    // Event handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBranchForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (branch) => {
        setBranchForm(branch);
        setEditingBranch(branch);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (isEditMode) {
                await editBranch({
                    id: editingBranch.branch_id,
                    data: branchForm
                }).unwrap();
            } else {
                await addBranch({...branchForm, mgmt_id: branches[0]?.mgmt_id}).unwrap();
            }

            setIsModalOpen(false);
            resetForm();
            refetch();
        } catch (err) {
            console.error("Operation failed:", err);
            const errorMessage = err.data?.message ||
                "An error occurred. Please try again.";
            // You might want to show this error to the user
        }
    };

    const handleDelete = async (branchId) => {
        if (!window.confirm("Are you sure you want to delete this branch?")) return;

        try {
            await deleteBranch(branchId).unwrap();
            refetch(); // Refresh data after successful deletion
        } catch (err) {
            console.error("Delete failed:", err);
            const errorMessage = err.data?.message ||
                "Failed to delete branch. Please try again.";
            // You might want to show this error to the user
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    if (isLoading) {
        return (
            <Admin>
                <div className="flex items-center justify-center min-h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                </div>
            </Admin>
        );
    }

    if (error) {
        return (
            <Admin>
                <div className="flex flex-col items-center justify-center min-h-screen p-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md w-full"
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
                        </div>
                        <p className="text-red-700 mb-4">
                            Failed to load management data. Please try again later.
                        </p>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Retry
                        </button>
                    </motion.div>
                </div>
            </Admin>
        );
    }

    return (
        <Admin>
            <div className="p-6 mb-8 overflow-y-auto h-full">
                {/* Branch Section */}
                <section className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center mb-6"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Branches</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage all your business branches and their details
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openAddModal}
                            className="px-4 py-2 text-xs bg-secondary text-white rounded-lg shadow-md hover:bg-primary transition-all flex items-center font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Branch
                        </motion.button>
                    </motion.div>

                    {branches.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
                        >
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-gray-500 mb-4">No branches found. Add your first branch to get started.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openAddModal}
                                className="px-6 py-2 text-xs bg-secondary text-white rounded-lg hover:bg-primary transition-colors font-medium"
                            >
                                Add Your First Branch
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {branches?.map((branch) => (
                                <motion.div
                                    key={branch.branch_id}
                                    variants={itemVariants}
                                    layout
                                >
                                    <ManagementCard
                                        branch={branch}
                                        onEdit={() => openEditModal(branch)}
                                        onDelete={() => handleDelete(branch.branch_id)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>

                {/* Companies Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex justify-between items-center mb-6"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                View all customers associated with your branches
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/customer-onboarding")}
                            className="px-4 py-2 text-xs bg-secondary text-white rounded-lg shadow-md hover:bg-primary transition-all flex items-center font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                             Customer
                        </motion.button>
                    </motion.div>

                    {companies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
                        >
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-gray-500">No companies found</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {companies.map((company, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    layout
                                >
                                    <CustomerCard customer={company} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>
            </div>

            {/* Branch Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <BranchModal
                        isOpen={isModalOpen}
                        isEdit={isEditMode}
                        branchForm={branchForm}
                        formErrors={formErrors}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onClose={() => {
                            setIsModalOpen(false);
                            resetForm();
                        }}
                    />
                )}
            </AnimatePresence>
        </Admin>
    );
};

export default Management;