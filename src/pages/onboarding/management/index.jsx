import {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Admin from "../../../layout/Admin.jsx";
import {useAddManagementMutation} from "../../../store/slices/management/managementApi.jsx";
import {useDispatch} from "react-redux";
import {handleTitleChange} from "../../../store/slices/auth/authSlice.js";
import toast from "react-hot-toast";

const steps = ["Company Info", "Tax Info", "Branches", "Review"];

const initialFormData= {
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    company_type: "",
    country: "",
    pan_no: "",
    mobile_number: "",
    integration: 1,
    branches: [
        {
            branch_name: "",
            address_line1: "",
            state: "",
            country: "",
            location: "",
            pincode: "",
            gst: "",
            rooms: [
                {
                    room_name: "",
                    room_type: "seater",
                    seater_capacity: 1,
                    quantity: 1,
                    monthly_cost: "",
                    hourly_cost: "",
                    default_discount: 0,
                },
            ],
        },
    ],
}

const Management = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const [addManagement] = useAddManagementMutation();

    useEffect(() => {
        dispatch(handleTitleChange("Add Management"));
    },[])

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
            if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!validateEmail(formData.email)) {
                newErrors.email = "Please enter a valid email";
            }
            if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
            if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
            if (!formData.company_type.trim()) newErrors.company_type = "Company type is required";
        } else if (step === 1) {
            if (!formData.country) newErrors.country = "Country is required";
            if (!formData.pan_no.trim()) newErrors.pan_no = "Tax ID is required";
        } else if (step === 2) {
            formData.branches.forEach((branch, bIndex) => {
                if (!branch.branch_name.trim()) newErrors[`branch_${bIndex}_name`] = "Branch name is required";
                if (!branch.address_line1.trim()) newErrors[`branch_${bIndex}_address`] = "Address is required";

                branch.rooms.forEach((room, rIndex) => {
                    if (!room.room_name.trim()) newErrors[`branch_${bIndex}_room_${rIndex}_name`] = "Room name is required";
                    if (!room.monthly_cost || parseFloat(room.monthly_cost) <= 0)
                        newErrors[`branch_${bIndex}_room_${rIndex}_monthly`] = "Valid monthly cost is required";
                });
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form handling
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBranchChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBranches = [...formData.branches];
        updatedBranches[index][name] = value;
        setFormData((prev) => ({ ...prev, branches: updatedBranches }));

        // Clear error when field is edited
        const errorKey = `branch_${index}_${name}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const addBranch = () => {
        setFormData((prev) => ({
            ...prev,
            branches: [
                ...prev.branches,
                {
                    branch_name: "",
                    address_line1: "",
                    state: "",
                    country: "",
                    pincode: "",
                    rooms: [
                        {
                            room_name: "",
                            room_type: "seater",
                            seater_capacity: 1,
                            quantity: 1,
                            monthly_cost: "",
                            hourly_cost: "",
                            default_discount: 0,
                        },
                    ],
                },
            ],
        }));
    };

    const removeBranch = (index) => {
        if (formData.branches.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            branches: prev.branches.filter((_, i) => i !== index),
        }));
    };

    // Room handling
    const handleRoomChange = (branchIndex, roomIndex, e) => {
        const { name, value } = e.target;
        const updatedBranches = [...formData.branches];
        updatedBranches[branchIndex].rooms[roomIndex][name] = value;
        setFormData((prev) => ({ ...prev, branches: updatedBranches }));

        // Clear error when field is edited
        const errorKey = `branch_${branchIndex}_room_${roomIndex}_${name}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const addRoom = (branchIndex) => {
        const updatedBranches = [...formData.branches];
        updatedBranches[branchIndex].rooms.push({
            room_name: "",
            room_type: "seater",
            seater_capacity: 1,
            quantity: 1,
            monthly_cost: "",
            hourly_cost: "",
            default_discount: 0,
        });
        setFormData((prev) => ({ ...prev, branches: updatedBranches }));
    };

    const removeRoom = (branchIndex, roomIndex) => {
        const updatedBranches = [...formData.branches];
        if (updatedBranches[branchIndex].rooms.length <= 1) return;
        updatedBranches[branchIndex].rooms.splice(roomIndex, 1);
        setFormData((prev) => ({ ...prev, branches: updatedBranches }));
    };

    // Navigation
    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            nextStep();
        }
    };

    const handleSubmit = async () => {
        if (validateStep(step)) {
            setIsSubmitting(true);
            try {
                const response = await addManagement(formData).unwrap();
                if (response.status) {
                    toast.success("Management added successfully 🚀");
                    setStep(0);
                    setFormData(initialFormData);
                }
                console.log("Final Data:", response);
            } catch (error) {
                console.error("Submission error:", error);
                alert("There was an error submitting the form. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Admin>
            <div className="max-w-7xl mx-auto p-4 md:p-6">

                {/* Stepper */}
                <div className="mb-8 relative">
                    <div className="flex items-center justify-between">
                        {steps.map((label, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 relative">
                                <div className="flex items-center w-full justify-center">
                                    <div
                                        className={`flex items-center justify-center text-xs w-8 h-8 rounded-full font-semibold z-10 relative
                                        ${
                                            index < step
                                                ? "bg-indigo-600 text-white"
                                                : index === step
                                                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                                                    : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {index < step ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                ></path>
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                </div>
                                <span
                                    className={`text-sm mt-2 font-medium text-center ${
                                        index <= step ? "text-indigo-600" : "text-gray-500"
                                    }`}
                                >
                                  {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-xl shadow-lg max-h-110 overflow-y-auto border border-gray-100">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                        >
                            {/* STEP 0 - Company Info */}
                            {step === 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Company & Personal Information
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Please provide your company details and personal information.
                                    </p>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        First Name *
                                                    </label>
                                                    <input
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleChange}
                                                        placeholder="Enter first name"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.first_name ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {errors.first_name && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Last Name *
                                                    </label>
                                                    <input
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleChange}
                                                        placeholder="Enter last name"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.last_name ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {errors.last_name && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="Enter email address"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.email ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mobile Number *
                                                    </label>
                                                    <input
                                                        name="mobile_number"
                                                        value={formData.mobile_number}
                                                        onChange={handleChange}
                                                        placeholder="Enter mobile number"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.mobile_number ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {errors.mobile_number && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-700 mb-4">Company Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Company Name *
                                                    </label>
                                                    <input
                                                        name="company_name"
                                                        value={formData.company_name}
                                                        onChange={handleChange}
                                                        placeholder="Enter company name"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.company_name ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {errors.company_name && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Company Type *
                                                    </label>
                                                    <select
                                                        name="company_type"
                                                        value={formData.company_type}
                                                        onChange={handleChange}
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                            errors.company_type ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    >
                                                        <option value="">Select company type</option>
                                                        <option value="coworking">Coworking</option>
                                                        <option value="Corporation">Corporation</option>
                                                        <option value="Partnership">Partnership</option>
                                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                                        <option value="Nonprofit">Nonprofit Organization</option>
                                                    </select>
                                                    {errors.company_type && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.company_type}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 1 - Tax Info */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Tax Information</h2>
                                    <p className="text-gray-600 mb-6">
                                        Please provide your company's tax information and country details.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country (ISO Code) *
                                            </label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                    errors.country ? "border-red-500" : "border-gray-300"
                                                }`}
                                            >
                                                <option value="">Select a country</option>
                                                <option value="US">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="IN">India</option>
                                                <option value="CA">Canada</option>
                                                <option value="AU">Australia</option>
                                                <option value="DE">Germany</option>
                                                <option value="FR">France</option>
                                                <option value="JP">Japan</option>
                                            </select>
                                            {errors.country && (
                                                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                PAN / Tax ID *
                                            </label>
                                            <input
                                                name="pan_no"
                                                value={formData.pan_no}
                                                onChange={handleChange}
                                                placeholder="Enter tax identification number"
                                                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                    errors.pan_no ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.pan_no && (
                                                <p className="mt-1 text-sm text-red-600">{errors.pan_no}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 - Branches + Rooms */}
                            {step === 2 && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Branch Details</h2>
                                            <p className="text-gray-600">
                                                Add your company branches and their room configurations.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addBranch}
                                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                ></path>
                                            </svg>
                                            Add Branch
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.branches.map((branch, bIndex) => (
                                            <motion.div
                                                key={bIndex}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border border-gray-200 rounded-xl p-6 bg-gray-50 relative"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        Branch {bIndex + 1}
                                                    </h3>
                                                    {formData.branches.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeBranch(bIndex)}
                                                            className="text-red-600 hover:text-red-800 transition flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                ></path>
                                                            </svg>
                                                            Remove Branch
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Branch Name *
                                                        </label>
                                                        <input
                                                            name="branch_name"
                                                            value={branch.branch_name}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter branch name"
                                                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                                errors[`branch_${bIndex}_name`] ? "border-red-500" : "border-gray-300"
                                                            }`}
                                                        />
                                                        {errors[`branch_${bIndex}_name`] && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[`branch_${bIndex}_name`]}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Address Line 1 *
                                                        </label>
                                                        <input
                                                            name="address_line1"
                                                            value={branch.address_line1}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter address"
                                                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                                errors[`branch_${bIndex}_address`] ? "border-red-500" : "border-gray-300"
                                                            }`}
                                                        />
                                                        {errors[`branch_${bIndex}_address`] && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[`branch_${bIndex}_address`]}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Location
                                                        </label>
                                                        <input
                                                            name="location"
                                                            value={branch.location}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter country"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            State
                                                        </label>
                                                        <input
                                                            name="state"
                                                            value={branch.state}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter state"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Country
                                                        </label>
                                                        <input
                                                            name="country"
                                                            value={branch.country}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter country"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Pincode
                                                        </label>
                                                        <input
                                                            name="pincode"
                                                            value={branch.pincode}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter pincode"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            GST
                                                        </label>
                                                        <input
                                                            name="gst"
                                                            value={branch.gst}
                                                            onChange={(e) => handleBranchChange(bIndex, e)}
                                                            placeholder="Enter your Branch GST"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Rooms Section */}
                                                <div className="mt-6 pt-4 border-t border-gray-200">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-medium text-gray-700">Rooms</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => addRoom(bIndex)}
                                                            className="flex items-center px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                ></path>
                                                            </svg>
                                                            Add Room
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {branch.rooms.map((room, rIndex) => (
                                                            <motion.div
                                                                key={rIndex}
                                                                initial={{ opacity: 0, scale: 0.98 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="border border-gray-200 rounded-lg p-4 bg-white relative"
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Room Name *
                                                                        </label>
                                                                        <input
                                                                            name="room_name"
                                                                            value={room.room_name}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            placeholder="Enter room name"
                                                                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                                                errors[`branch_${bIndex}_room_${rIndex}_name`] ? "border-red-500" : "border-gray-300"
                                                                            }`}
                                                                        />
                                                                        {errors[`branch_${bIndex}_room_${rIndex}_name`] && (
                                                                            <p className="mt-1 text-sm text-red-600">{errors[`branch_${bIndex}_room_${rIndex}_name`]}</p>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Room Type
                                                                        </label>
                                                                        <select
                                                                            name="room_type"
                                                                            value={room.room_type}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                                        >
                                                                            <option value="seater">Seater</option>
                                                                            <option value="meeting">Meeting</option>
                                                                            {/*<option value="conference">Conference</option>*/}
                                                                            {/*<option value="training">Training</option>*/}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Seater Capacity
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            name="seater_capacity"
                                                                            value={room.seater_capacity}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Quantity
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            name="quantity"
                                                                            value={room.quantity}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Monthly Cost ($) *
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            min="0"
                                                                            name="monthly_cost"
                                                                            value={room.monthly_cost}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            placeholder="0.00"
                                                                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                                                                errors[`branch_${bIndex}_room_${rIndex}_monthly`] ? "border-red-500" : "border-gray-300"
                                                                            }`}
                                                                        />
                                                                        {errors[`branch_${bIndex}_room_${rIndex}_monthly`] && (
                                                                            <p className="mt-1 text-sm text-red-600">{errors[`branch_${bIndex}_room_${rIndex}_monthly`]}</p>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Hourly Cost ($)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            min="0"
                                                                            name="hourly_cost"
                                                                            value={room.hourly_cost}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            placeholder="0.00"
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Default Discount (%)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            min="0"
                                                                            max="100"
                                                                            name="default_discount"
                                                                            value={room.default_discount}
                                                                            onChange={(e) => handleRoomChange(bIndex, rIndex, e)}
                                                                            placeholder="0"
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {branch.rooms.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeRoom(bIndex, rIndex)}
                                                                        className="mt-3 text-sm text-red-600 hover:text-red-800 transition flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                                                    >
                                                                        <svg
                                                                            className="w-4 h-4 mr-1"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            ></path>
                                                                        </svg>
                                                                        Remove Room
                                                                    </button>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* STEP 3 - Review */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h2>
                                    <p className="text-gray-600 mb-6">
                                        Please review all the information before submitting.
                                    </p>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-600">Company Name</p>
                                                <p className="font-medium">{formData.company_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Company Type</p>
                                                <p className="font-medium">{formData.company_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Country</p>
                                                <p className="font-medium">{formData.country}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">PAN/Tax ID</p>
                                                <p className="font-medium">{formData.pan_no}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Person</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium">
                                                    {formData.first_name} {formData.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{formData.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Mobile</p>
                                                <p className="font-medium">{formData.mobile_number}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Branches</h3>
                                        <div className="space-y-4">
                                            {formData.branches.map((branch, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <h4 className="font-medium text-gray-800 mb-2">
                                                        {branch.branch_name || `Branch ${index + 1}`}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {branch.address_line1}, {branch.state}, {branch.country} -{" "}
                                                        {branch.pincode}
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {branch.rooms.length} room(s) configured
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 0}
                        className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                            step === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        }`}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            ></path>
                        </svg>
                        Back
                    </button>

                    {step < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
                        >
                            Next
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                ></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
                        >
                            { isSubmitting ? "Submitting..." : "Submit" }
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </Admin>
    );
};

export default Management;