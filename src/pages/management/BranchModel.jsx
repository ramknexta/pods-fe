import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const BranchModal = ({
                         isOpen,
                         isEdit,
                         branchForm,
                         formErrors,
                         onInputChange,
                         onSubmit,
                         onClose,
                     }) => {
    const fields = [
        {
            name: "branch_name",
            label: "Branch Name",
            required: true,
            type: "text",
            placeholder: "Enter branch name",
            icon: "mdi:office-building-outline"
        },
        {
            name: "address_line1",
            label: "Address Line 1",
            required: true,
            type: "text",
            placeholder: "Street / Building / Area",
            icon: "mdi:map-marker-outline"
        },
        {
            name: "address_line2",
            label: "Address Line 2",
            required: false,
            type: "text",
            placeholder: "Landmark / Locality (optional)",
            icon: "mdi:map-marker-plus"
        },
        {
            name: "location",
            label: "Location",
            required: false,
            type: "text",
            placeholder: "Enter location",
            icon: "mdi:city"
        },
        {
            name: "state",
            label: "State",
            required: false,
            type: "text",
            placeholder: "Enter state",
            icon: "mdi:state-machine"
        },
        {
            name: "country",
            label: "Country",
            required: false,
            type: "text",
            placeholder: "Enter country",
            icon: "mdi:earth"
        },
        {
            name: "pincode",
            label: "Pincode",
            required: false,
            type: "text",
            placeholder: "Enter pincode",
            icon: "mdi:numeric"
        },
        {
            name: "gst",
            label: "GST Number",
            required: true,
            type: "text",
            placeholder: "Enter GST number",
            icon: "mdi:card-account-details-outline"
        },
    ];

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: -50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white z-10 rounded-t-xl border-b border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {isEdit ? "Edit Branch" : "Add New Branch"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isEdit ? "Update branch information" : "Add a new branch to your management"}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Icon icon="mdi:close" className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>

                        {/* Form */}
                        <form onSubmit={onSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {fields.map((field, i) => (
                                    <motion.div
                                        key={field.name}
                                        className="flex flex-col"
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                    >
                                        <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                                            <Icon icon={field.icon} className="w-4 h-4 mr-1 text-blue-500" />
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={branchForm[field.name]}
                                                onChange={onInputChange}
                                                placeholder={field.placeholder}
                                                className={`w-full border rounded-lg px-4 py-3 pl-10 text-sm focus:ring-2 focus:outline-none transition-all ${
                                                    formErrors[field.name]
                                                        ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                                                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                                }`}
                                            />
                                            <Icon
                                                icon={field.icon}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                            />
                                        </div>
                                        {formErrors[field.name] && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-xs mt-1 flex items-center"
                                            >
                                                <Icon icon="mdi:alert-circle-outline" className="w-3 h-3 mr-1" />
                                                {formErrors[field.name]}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Actions */}
                            <motion.div
                                className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                                >
                                    <Icon icon="mdi:close" className="w-4 h-4 mr-1" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium flex items-center"
                                >
                                    <Icon
                                        icon={isEdit ? "mdi:pencil" : "mdi:plus"}
                                        className="w-4 h-4 mr-1"
                                    />
                                    {isEdit ? "Update Branch" : "Add Branch"}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BranchModal;