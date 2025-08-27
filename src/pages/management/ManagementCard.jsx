// ManagementCard.jsx
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";

const ManagementCard = ({ branch, onEdit, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    // Prevent card navigation when clicking inside action buttons
    const stopPropagation = (e) => e.stopPropagation();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            onClick={() =>
                navigate(`/management-room?branch_id=${branch.branch_id}&branch_name=${branch.branch_name || "Branch"}`)
            }
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
        >
            {/* Background accent */}
            {/*<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>*/}

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                        <Icon
                            icon="mdi:office-building"
                            className="w-6 h-6 text-blue-600"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                            {branch.branch_name || `Branch ${branch.branch_id}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {branch.management_name || "Unknown Management"}
                        </p>
                    </div>
                </div>
                <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon
                        icon="mdi:chevron-right"
                        className="w-5 h-5 text-blue-500 hover:text-blue-700"
                    />
                </motion.div>
            </div>

            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center text-sm">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                    <Icon
                                        icon="mdi:map-marker"
                                        className="w-3 h-3 text-blue-600"
                                    />
                                </div>
                                <span className="text-gray-700 truncate">{branch.location || "N/A"}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                    <Icon
                                        icon="mdi:door"
                                        className={`w-3 h-3 ${branch.rooms_error ? "text-red-500" : "text-green-600"}`}
                                    />
                                </div>
                                <span className="text-gray-700">
                                    {branch.rooms_error
                                        ? "Error"
                                        : `${branch.room_count || 0} Rooms`}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                                    <Icon
                                        icon="mdi:account-group"
                                        className={`w-3 h-3 ${branch.rooms_error ? "text-red-500" : "text-orange-600"}`}
                                    />
                                </div>
                                <span className="text-gray-700">
                                    {branch.rooms_error
                                        ? "Error"
                                        : `${branch.total_capacity || 0} Capacity`}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                    <Icon
                                        icon="mdi:check-circle"
                                        className="w-3 h-3 text-green-600"
                                    />
                                </div>
                                <span className="text-green-700 font-medium">
                                    Available: <strong>{branch.total_available || 0}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-red-600 text-sm font-medium">
                                Booked: <strong>{branch.total_booked || 0}</strong>
                            </span>

                            {branch.status && (
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        branch.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {branch.status}
                                </span>
                            )}
                        </div>

                        {/* Edit/Delete Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            onClick={stopPropagation}
                            className="flex gap-2 mt-4 justify-end"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onEdit(branch)}
                                className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                            >
                                <Icon icon="mdi:pencil" className="w-4 h-4 mr-1" />
                                Edit
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onDelete(branch.branch_id)}
                                className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                            >
                                <Icon icon="mdi:delete" className="w-4 h-4 mr-1" />
                                Delete
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManagementCard;