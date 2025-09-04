import { motion } from "framer-motion";
import Customer from "../../layout/Customer.jsx";
import {Link, useSearchParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchCustomersQuery} from "../../store/slices/customer/customerApi.js";
import React from "react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 12
        }
    }
};

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const CompanyDetails = () => {
    const { mgmt_id } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();
    const customerId = searchParams.get("customer_id");

    const { data, isLoading, error } = useFetchCustomersQuery(
        { id: customerId, mgmt_id },
        { skip: !customerId }
    );

    if (isLoading) {
        return (
            <Customer>
                <div className="flex justify-center items-center h-64">
                    <motion.div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </Customer>
        );
    }

    if (error) {
        return (
            <Customer>
                <motion.div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <p>Error loading company details. Please try again.</p>
                </motion.div>
            </Customer>
        );
    }

    if (!data || !data.data || data.data.length === 0) {
        return (
            <Customer>
                <motion.div
                    className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <p>No company data found.</p>
                </motion.div>
            </Customer>
        );
    }

    const company = data.data[0];
    const contact = company.customer_contact && company.customer_contact.length > 0
        ? company.customer_contact[0]
        : null;

    return (
        <Customer>
            <motion.div
                className="max-w-7xl mx-auto p-6 h-full overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div
                    className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-6"
                    variants={cardVariants}
                >
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {company.name ? company.name.charAt(0) : "C"}
                    </motion.div>

                    <div className="flex-1">
                        <motion.h1
                            className="text-3xl font-bold text-gray-800 mb-2"
                            variants={itemVariants}
                        >
                            {company.name}
                        </motion.h1>

                        <motion.div
                            className="flex flex-wrap gap-2 mb-4"
                            variants={itemVariants}
                        >
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {company.risk} Risk
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {company.recommendation} Recommended
                              </span>
                        </motion.div>

                        <motion.p
                            className="text-gray-600 text-sm"
                            variants={itemVariants}
                        >
                            {company.about || "No description available"}
                        </motion.p>
                    </div>

                    <Link to={`/allocation?id=${customerId}`}
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Manage Allocation
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Details Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-md p-6"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Company Information
                        </h2>

                        <motion.div className="space-y-4" variants={containerVariants}>
                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium">{company.email || "N/A"}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Website</span>
                                <span className="font-medium">{company.website || "N/A"}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">GSTIN</span>
                                <span className="font-medium">{company.gstin || "N/A"}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">DUNS</span>
                                <span className="font-medium">{company.duns || "N/A"}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Latest Invoice</span>
                                <span className="font-medium">{company.latest_invoice_no || "N/A"}</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Invoice Count</span>
                                <span className="font-medium">{company.invoice_count}</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Address Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-md p-6"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Address
                        </h2>

                        <motion.div className="space-y-4" variants={containerVariants}>
                            <motion.div variants={itemVariants}>
                                <p className="text-gray-600">Address Line 1</p>
                                <p className="font-medium">{company.addr1 || "N/A"}</p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <p className="text-gray-600">Address Line 2</p>
                                <p className="font-medium">{company.addr2 || "N/A"}</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <div>
                                    <p className="text-gray-600">Location</p>
                                    <p className="font-medium">{company.location || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600">State</p>
                                    <p className="font-medium">{company.state || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600">Pincode</p>
                                    <p className="font-medium">{company.pincode || "N/A"}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Financial Overview Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-md p-6"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Financial Overview
                        </h2>

                        <motion.div className="space-y-4" variants={containerVariants}>
                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-medium">
                  {company.total_amount ? `₹${company.total_amount}` : "N/A"}
                </span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-medium">
                  {company.total_amount_paid ? `₹${company.total_amount_paid}` : "₹0"}
                </span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Past Due Amount</span>
                                <span className="font-medium">
                  {company.past_due_amount ? `₹${company.past_due_amount}` : "₹0"}
                </span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex justify-between">
                                <span className="text-gray-600">Balance</span>
                                <span className="font-medium">
                  {company.balance ? `₹${company.balance}` : "₹0"}
                </span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Information Card */}
                    {contact && (
                        <motion.div
                            className="bg-white rounded-xl shadow-md p-6"
                            variants={cardVariants}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Primary Contact
                            </h2>

                            <motion.div className="space-y-4" variants={containerVariants}>
                                <motion.div variants={itemVariants} className="flex justify-between">
                                    <span className="text-gray-600">Name</span>
                                    <span className="font-medium">
                    {contact.first_name} {contact.last_name}
                  </span>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex justify-between">
                                    <span className="text-gray-600">Email</span>
                                    <span className="font-medium">{contact.email}</span>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex justify-between">
                                    <span className="text-gray-600">Mobile</span>
                                    <span className="font-medium">{contact.mobile}</span>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex justify-between">
                                    <span className="text-gray-600">Primary Contact</span>
                                    <span className="font-medium">
                    {contact.primary ? "Yes" : "No"}
                  </span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </Customer>
    );
};

export default CompanyDetails;