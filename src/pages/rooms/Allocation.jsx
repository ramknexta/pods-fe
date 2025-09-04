import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Admin from "../../layout/Admin.jsx";
import {
    useAllocateRoomMutation,
    useFetchAllocationListQuery,
    useGetAvailableRoomsQuery, useLazyGetAvailableRoomsQuery, useRemoveRoomAllocationMutation
} from "../../store/slices/management/allocationApi.js";
import {useDispatch, useSelector} from "react-redux";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";
import {useSearchParams} from "react-router-dom";

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
            type: "spring",
            stiffness: 120
        }
    }
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2
        }
    }
};

const RoomAllocation = () => {
    const {mgmt_id} = useSelector((state) => state.auth);
    const [customers, setCustomers] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [allocationDialog, setAllocationDialog] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [errors, setErrors] = useState({});
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, allocationId: null, roomName: "" });

    const [allocationData, setAllocationData] = useState({
        customer_id: "",
        customer_branch_id: "",
        mgmt_id: "",
        branch_id: "",
        rooms: [],
        booking_type: "monthly",
        start_date: dayjs(),
        end_date: null,
        frequency: "monthly",
        recurring_invoice: true,
        payment_term: 15,
    });

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const customerId = searchParams.get("id");

    const { data, error, isLoading:loading, refetch } = useFetchAllocationListQuery()

    const [getAvailableRooms] = useLazyGetAvailableRoomsQuery();
    const [allocateRoom] = useAllocateRoomMutation();
    const [ removeRoomAllocation ] = useRemoveRoomAllocationMutation()

    useEffect(() => {
        dispatch(handleTitleChange("Room Allocation"));
    },[])

    useEffect(() => {
        if (data?.data && customerId)
        {
            const found = data?.data.filter(c => String(c.id) === String(customerId));
            setCustomers(found || []);
        }
        else if (data?.data) {
            setCustomers(data.data);
        }
    }, [data]);

    const validateForm = () => {
        const newErrors = {};

        // Validate start date
        if (!allocationData.start_date || !dayjs(allocationData.start_date).isValid()) {
            newErrors.start_date = "Please select a valid start date";
        } else if (dayjs(allocationData.start_date).isBefore(dayjs(), 'day')) {
            newErrors.start_date = "Start date cannot be in the past";
        }

        // Validate end date if provided
        if (allocationData.end_date && dayjs(allocationData.end_date).isValid()) {
            if (dayjs(allocationData.end_date).isBefore(allocationData.start_date)) {
                newErrors.end_date = "End date cannot be before start date";
            }
        }

        // Validate rooms
        if (allocationData.rooms.length === 0) {
            newErrors.rooms = "Please add at least one room";
        } else {
            allocationData.rooms.forEach((room, index) => {
                if (!room.quantity_booked || room.quantity_booked <= 0) {
                    newErrors[`room_${index}_quantity`] = "Quantity must be greater than 0";
                }

                if (!room.rate || room.rate <= 0) {
                    newErrors[`room_${index}_rate`] = "Rate must be greater than 0";
                }

                if (room.discount_applied < 0 || room.discount_applied > 100) {
                    newErrors[`room_${index}_discount`] = "Discount must be between 0 and 100";
                }

                // Check if quantity exceeds available quantity
                const availableRoom = availableRooms.find(r => r.id === room.room_id);
                if (availableRoom && room.quantity_booked > availableRoom.available_quantity) {
                    newErrors[`room_${index}_quantity`] = `Only ${availableRoom.available_quantity} available`;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    };

    const fetchAvailableRooms = async (branchId, customerId = null) => {
        try {
            const response = await getAvailableRooms({ branchId, customerId }).unwrap();
            setAvailableRooms(response?.data || []);
        } catch (err) {
            console.error("Error fetching available rooms", err);
            showNotification("Error loading room data", "error");
        }
    };

    const handleAllocateRooms = async () => {
        try {
            if (!validateForm()) {
                showNotification("Please fix the validation errors", "error");
                return;
            }

            if (!allocationData.customer_id || !allocationData.branch_id || allocationData.rooms.length === 0) {
                showNotification("Please fill in all required fields", "error");
                return;
            }

            const apiData = {
                ...allocationData,
                customer_id: parseInt(allocationData.customer_id),
                start_date: allocationData.start_date?.toISOString(),
                end_date: allocationData.end_date ? allocationData.end_date.toISOString() : null,
            };

            const resp = await allocateRoom(apiData).unwrap();

            setAllocationDialog(false);
            refetch();
            resetAllocationData();
            showNotification("Rooms allocated successfully!");
        } catch (err) {
            console.error("Error allocating rooms", err);
            showNotification("Failed to allocate rooms", "error");
        }
    };

    const resetAllocationData = () => {
        const userMgmtId = localStorage.getItem("mgmt_id");
        setAllocationData({
            customer_id: "",
            customer_branch_id: "",
            mgmt_id: parseInt(userMgmtId),
            branch_id: "",
            rooms: [],
            booking_type: "monthly",
            start_date: dayjs(),
            end_date: null,
            frequency: "monthly",
            recurring_invoice: true,
            payment_term: 15,
        });
        setAvailableRooms([]);
        setSelectedCustomer(null);
        setErrors({});
    };

    const addRoomToAllocation = (room) => {
        if (allocationData.rooms.some((r) => r.room_id === room.id)) {
            showNotification("Room already added", "warning");
            return;
        }
        const newRoom = {
            room_id: room.id,
            room_name: room.room_name,
            room_type: room.room_type,
            quantity_booked: 1,
            rate: allocationData.booking_type === "monthly" ? room.monthly_cost : room.hourly_cost || 0,
            discount_applied: 0,
        };
        setAllocationData((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
        // Clear room errors when adding a new room
        setErrors(prev => {
            const newErrors = {...prev};
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('room_')) delete newErrors[key];
            });
            return newErrors;
        });
        showNotification(`${room.room_name} added to allocation`);
    };

    const removeRoomFromAllocation = (roomId, roomName) => {
        setAllocationData((prev) => ({
            ...prev,
            rooms: prev.rooms.filter((r) => r.room_id !== roomId),
        }));
        // Clear room errors when removing a room
        setErrors(prev => {
            const newErrors = {...prev};
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('room_')) delete newErrors[key];
            });
            return newErrors;
        });
        showNotification(`${roomName} removed from allocation`);
    };

    const updateRoomInAllocation = (roomId, field, value) => {
        setAllocationData((prev) => ({
            ...prev,
            rooms: prev.rooms.map((room) =>
                room.room_id === roomId ? { ...room, [field]: value } : room
            ),
        }));

        // Clear specific error when field is updated
        if (errors[`room_${roomId}_${field}`]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[`room_${roomId}_${field}`];
                return newErrors;
            });
        }
    };

    const calculateTotalAmount = () => {
        return allocationData.rooms.reduce((total, room) => {
            return total + room.quantity_booked * room.rate * (1 - room.discount_applied / 100);
        }, 0);
    };

    const openAllocationDialog = (customer) => {
        setAllocationData((prev) => ({
            ...prev,
            customer_id: customer.id,
            customer_branch_id: customer.customer_branch_id,
            mgmt_id: parseInt(mgmt_id),
            branch_id: customer.branch_ids,
        }));
        fetchAvailableRooms(customer.branch_ids, customer.id);
        setSelectedCustomer(customer);
        setAllocationDialog(true);
        setErrors({});
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const confirmRemoveAllocation = (id, roomName) => {
        setDeleteConfirmation({ show: true, allocationId: id, roomName });
    };

    const handleRemoveRoomAllocation = async (id) => {
        try {
            await removeRoomAllocation(id).unwrap();
            refetch();
            showNotification("Room allocation removed successfully!");
            setDeleteConfirmation({ show: false, allocationId: null, roomName: "" });
        }
        catch (e)
        {
            console.error("Error removing room allocation", e);
            showNotification("Failed to remove allocated room", "error");
            setDeleteConfirmation({ show: false, allocationId: null, roomName: "" });
        }
    }

    return (
        <Admin customClassName="p-6">
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
                            notification.type === "error"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : notification.type === "warning"
                                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                    : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">
                                {notification.type === "error" ? "❌" : notification.type === "warning" ? "⚠️" : "✅"}
                            </span>
                            <span>{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmation.show && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-opacity-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Confirm Removal</h3>
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to remove the allocation for {deleteConfirmation.roomName}?
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => handleRemoveRoomAllocation(deleteConfirmation.allocationId)}
                                >
                                    Remove
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setDeleteConfirmation({ show: false, allocationId: null, roomName: "" })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold text-gray-800">Room Allocation</h2>
                <p className="text-gray-600 mt-1">Allocate rooms to customers and manage workspace assignments</p>
            </motion.div>
            <div className="h-3/4 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "
                    >
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <motion.div
                                    key={customer.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                                >
                                    <div className="p-5">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 truncate">{customer.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1 truncate">{customer.email}</p>
                                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    <span>{customer.branch_names} ({customer.locations})</span>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                onClick={() => openAllocationDialog(customer)}
                                            >
                                                Allocate
                                            </motion.button>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">Allocated Rooms</p>
                                                    {
                                                        customer?.allocations.map((room) => (
                                                            <div className="flex items-center justify-between mt-2" key={room.id}>
                                                                <p className="text-sm text-gray-600">
                                                                    {room.room_name}
                                                                    <span className="ml-1 text-xs text-primary">
                                                                    {room.quantity_booked} x {formatCurrency(room.total_amount / room.quantity_booked)}
                                                                </span>
                                                                </p>

                                                                <button
                                                                    onClick={() => confirmRemoveAllocation(room.id, room.room_name)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                                                >
                                                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                        <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Total Amount</p>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        {formatCurrency(customer.total_allocated_amount || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
                            >
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-700">No customers found</h3>
                                <p className="mt-1 text-gray-500">Add customers to allocate rooms</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
            {/* Allocation Modal */}
            <AnimatePresence>
                {allocationDialog && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Allocate Rooms to {selectedCustomer?.name}
                                </h3>
                                <button
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setAllocationDialog(false)}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Allocation Details */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-4">Booking Details</h4>

                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Booking Type</label>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                value={allocationData.booking_type}
                                                onChange={(e) =>
                                                    setAllocationData({ ...allocationData, booking_type: e.target.value })
                                                }
                                            >
                                                <option value="monthly">Monthly</option>
                                                <option value="hourly">Hourly</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Start Date *</label>
                                            <input
                                                type="date"
                                                className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                                value={dayjs(allocationData.start_date).format('YYYY-MM-DD')}
                                                onChange={(e) => setAllocationData({ ...allocationData, start_date: dayjs(e.target.value) })}
                                            />
                                            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">End Date (Optional)</label>
                                            <input
                                                type="date"
                                                className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                                value={allocationData.end_date ? dayjs(allocationData.end_date).format('YYYY-MM-DD') : ''}
                                                onChange={(e) => setAllocationData({ ...allocationData, end_date: e.target.value ? dayjs(e.target.value) : null })}
                                            />
                                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                        </div>
                                    </div>

                                    {/* Available Rooms */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-4">Available Rooms</h4>
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                            {availableRooms.length > 0 ? (
                                                availableRooms.map((room) => (
                                                    <motion.div
                                                        key={room.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{room.room_name}</p>
                                                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                                                <span className="mr-3 capitalize">{room.room_type}</span>
                                                                <span className="flex items-center">
                                                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                                                  </svg>
                                                                    {room.available_quantity} available
                                                                  </span>
                                                            </div>
                                                            <p className="text-green-600 font-semibold mt-1">
                                                                {formatCurrency(allocationData.booking_type === "monthly" ? room.monthly_cost : room.hourly_cost)}/{allocationData.booking_type === "monthly" ? "month" : "hour"}
                                                            </p>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                                allocationData.rooms.some((r) => r.room_id === room.id)
                                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            }`}
                                                            disabled={allocationData.rooms.some((r) => r.room_id === room.id)}
                                                            onClick={() => addRoomToAllocation(room)}
                                                        >
                                                            {allocationData.rooms.some((r) => r.room_id === room.id) ? "Added" : "Add"}
                                                        </motion.button>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    No available rooms found for this branch
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Rooms Table */}
                                {allocationData.rooms.length > 0 && (
                                    <div className="mt-8">
                                        <h4 className="font-medium text-gray-700 mb-4">Selected Rooms</h4>
                                        {errors.rooms && <p className="text-red-600 text-sm mb-2">{errors.rooms}</p>}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-3 text-left font-medium text-gray-700">Room</th>
                                                    <th className="p-3 text-center font-medium text-gray-700">Qty</th>
                                                    <th className="p-3 text-center font-medium text-gray-700">Rate</th>
                                                    <th className="p-3 text-center font-medium text-gray-700">Discount %</th>
                                                    <th className="p-3 text-center font-medium text-gray-700">Total</th>
                                                    <th className="p-3 text-center font-medium text-gray-700">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                {allocationData.rooms.map((room, index) => {
                                                    const roomErrors = {};
                                                    Object.keys(errors).forEach(key => {
                                                        if (key.startsWith(`room_${index}_`)) {
                                                            const field = key.replace(`room_${index}_`, '');
                                                            roomErrors[field] = errors[key];
                                                        }
                                                    });

                                                    return (
                                                        <tr key={room.room_id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="p-3 font-medium text-gray-800">{room.room_name}</td>
                                                            <td className="p-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    className={`w-16 border ${roomErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                                                    value={room.quantity_booked}
                                                                    onChange={(e) =>
                                                                        updateRoomInAllocation(room.room_id, "quantity_booked", parseInt(e.target.value) || 1)
                                                                    }
                                                                />
                                                                {roomErrors.quantity && <p className="text-xs text-red-600 mt-1">{roomErrors.quantity}</p>}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    className={`w-20 border ${roomErrors.rate ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                                                    value={room.rate}
                                                                    onChange={(e) =>
                                                                        updateRoomInAllocation(room.room_id, "rate", parseFloat(e.target.value) || 0)
                                                                    }
                                                                />
                                                                {roomErrors.rate && <p className="text-xs text-red-600 mt-1">{roomErrors.rate}</p>}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    className={`w-16 border ${roomErrors.discount ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                                                    value={room.discount_applied}
                                                                    onChange={(e) =>
                                                                        updateRoomInAllocation(room.room_id, "discount_applied", parseFloat(e.target.value) || 0)
                                                                    }
                                                                />
                                                                {roomErrors.discount && <p className="text-xs text-red-600 mt-1">{roomErrors.discount}</p>}
                                                            </td>
                                                            <td className="p-3 text-center font-semibold text-green-600">
                                                                {formatCurrency(room.quantity_booked * room.rate * (1 - room.discount_applied / 100))}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <button
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                    onClick={() => removeRoomFromAllocation(room.room_id, room.room_name)}
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">Total Amount:</span>
                                                <span className="text-xl font-bold text-green-600">
                                                  {formatCurrency(calculateTotalAmount())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        onClick={() => setAllocationDialog(false)}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2.5 text-sm bg-secondary text-white rounded-lg font-medium hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        disabled={allocationData.rooms.length === 0}
                                        onClick={handleAllocateRooms}
                                    >
                                        Allocate {allocationData.rooms.length} Room{allocationData.rooms.length !== 1 ? 's' : ''}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Admin>
    );
};

export default RoomAllocation;