import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useFetchRoomByBranchIdQuery,
    useAddBranchRoomMutation,
    useEditBranchRoomMutation,
    useDeleteBranchRoomMutation,
} from "../../store/slices/management/managementApi.jsx";
import Admin from "../../layout/Admin.jsx";
import { useDispatch } from "react-redux";
import { handleTitleChange } from "../../store/slices/auth/authSlice.js";

const Rooms = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const branchID = searchParams.get("branch_id");
    const branchName = searchParams.get("branch_name");

    const { data, isLoading, refetch, error } = useFetchRoomByBranchIdQuery(branchID);
    const [addBranchRoom, { isLoading: isAdding }] = useAddBranchRoomMutation();
    const [editBranchRoom, { isLoading: isEditing }] = useEditBranchRoomMutation();
    const [deleteBranchRoom, { isLoading: isDeleting }] = useDeleteBranchRoomMutation();

    // Dialog states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    // Form state
    const [roomForm, setRoomForm] = useState({
        room_name: "",
        room_type: "seater",
        seater_capacity: "",
        quantity: "",
        monthly_cost: "",
        hourly_cost: "",
        default_discount: "",
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(handleTitleChange("Room Details"));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            console.error("Error fetching rooms:", error);
        }
    }, [error]);

    const resetForm = () => {
        setRoomForm({
            room_name: "",
            room_type: "seater",
            seater_capacity: "",
            quantity: "",
            monthly_cost: "",
            hourly_cost: "",
            default_discount: "",
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        if (!roomForm.room_name.trim()) errors.room_name = "Room name is required";
        if (!roomForm.seater_capacity || roomForm.seater_capacity <= 0)
            errors.seater_capacity = "Valid capacity is required";
        if (!roomForm.quantity || roomForm.quantity <= 0)
            errors.quantity = "Valid quantity is required";
        if (!roomForm.monthly_cost || roomForm.monthly_cost < 0)
            errors.monthly_cost = "Valid monthly cost is required";
        if (!roomForm.hourly_cost || roomForm.hourly_cost < 0)
            errors.hourly_cost = "Valid hourly cost is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddRoom = async () => {
        if (!validateForm()) return;

        try {
            const payload = { branch_id: branchID, rooms: [roomForm] };
            await addBranchRoom(payload).unwrap();
            resetForm();
            setIsAddOpen(false);
            refetch();
        } catch (err) {
            console.error("Failed to add room:", err);
        }
    };

    const handleEditRoom = async () => {
        if (!validateForm()) return;
        try {
            // Fixed the edit call - pass a single object with id and data
            await editBranchRoom({
                id: editingRoom.id,
                data: { ...roomForm }
            }).unwrap();
            resetForm();
            setIsEditOpen(false);
            setEditingRoom(null);
            refetch();
        } catch (err) {
            console.error("Failed to edit room:", err);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
            try {
                await deleteBranchRoom(id).unwrap();
                refetch();
            } catch (err) {
                console.error("Failed to delete room:", err);
            }
        }
    };

    const openEditDialog = (room) => {
        setEditingRoom(room);
        setRoomForm({
            room_name: room.room_name,
            room_type: room.room_type,
            seater_capacity: room.seater_capacity || "",
            quantity: room.quantity || "",
            monthly_cost: room.monthly_cost || "",
            hourly_cost: room.hourly_cost || "",
            default_discount: room.default_discount || "",
        });
        setIsEditOpen(true);
    };

    const totalCapacity = data?.data?.reduce(
        (sum, r) => sum + (r.seater_capacity * r.quantity || 0),
        0
    );

    const Modal = ({ isOpen, onClose, title, children, actionButton }) => (
        isOpen && (
            <div className="max-w-5xl mx-auto mt-10 fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        {actionButton}
                    </div>
                </div>
            </div>
        )
    );

    const InputField = ({ label, type = "text", value, onChange, error, ...props }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );

    const SelectField = ({ label, value, onChange, options, error }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );

    const RoomCard = ({ room }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {room.room_name}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => openEditDialog(room)}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition"
                            aria-label="Edit room"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                            aria-label="Delete room"
                            disabled={isDeleting}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {room.seater_capacity} seats
                    </div>
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {room.quantity} units
                    </div>
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ₹{room.monthly_cost}/mo
                    </div>
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ₹{room.hourly_cost}/hr
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {room.room_type === 'seater' ? 'Seater Room' : 'Meeting Room'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {room.status === 'available' ? 'Available' : 'Occupied'}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <Admin>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Room Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage rooms for <strong className="text-gray-500">{branchName}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats and Action Bar */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Available Rooms ({data?.data?.length || 0})
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Total Capacity: {totalCapacity || 0} seats
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none cursor-pointer transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Room
                        </button>
                    </div>
                </div>

                {/* Rooms Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load rooms</h3>
                        <p className="text-red-600">Please try again later</p>
                        <button
                            onClick={refetch}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : data?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {data.data.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
                        <p className="text-gray-500 mb-4">Get started by adding your first room</p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-4 py-2 bg-secondary text-white rounded-md cursor-pointer hover:bg-primary transition-colors"
                        >
                            Add Room
                        </button>
                    </div>
                )}

                {/* Add Room Modal */}
                <Modal
                    isOpen={isAddOpen}
                    onClose={() => {
                        setIsAddOpen(false);
                        resetForm();
                    }}
                    title={`Add New Room to ${branchName}`}
                    actionButton={
                        <button
                            onClick={handleAddRoom}
                            disabled={isAdding}
                            className="px-4 py-2  text-sm bg-secondary text-white font-medium rounded-lg hover:bg-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        >
                            {isAdding ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </span>
                            ) : "Add Room"}
                        </button>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Room Name"
                            value={roomForm.room_name}
                            onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                            error={formErrors.room_name}
                            placeholder="e.g., Conference Room A"
                        />

                        <SelectField
                            label="Room Type"
                            value={roomForm.room_type}
                            onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                            options={[
                                { value: "seater", label: "Seater" },
                                { value: "meeting", label: "Meeting Room" }
                            ]}
                        />

                        <InputField
                            label="Seater Capacity"
                            type="number"
                            min="1"
                            value={roomForm.seater_capacity}
                            onChange={(e) => setRoomForm({ ...roomForm, seater_capacity: e.target.value })}
                            error={formErrors.seater_capacity}
                            placeholder="e.g., 10"
                        />

                        <InputField
                            label="Quantity"
                            type="number"
                            min="1"
                            value={roomForm.quantity}
                            onChange={(e) => setRoomForm({ ...roomForm, quantity: e.target.value })}
                            error={formErrors.quantity}
                            placeholder="e.g., 2"
                        />

                        <InputField
                            label="Monthly Cost (₹)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={roomForm.monthly_cost}
                            onChange={(e) => setRoomForm({ ...roomForm, monthly_cost: e.target.value })}
                            error={formErrors.monthly_cost}
                            placeholder="e.g., 5000"
                        />

                        <InputField
                            label="Hourly Cost (₹)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={roomForm.hourly_cost}
                            onChange={(e) => setRoomForm({ ...roomForm, hourly_cost: e.target.value })}
                            error={formErrors.hourly_cost}
                            placeholder="e.g., 100"
                        />

                        <InputField
                            label="Default Discount (%)"
                            type="number"
                            min="0"
                            max="100"
                            value={roomForm.default_discount}
                            onChange={(e) => setRoomForm({ ...roomForm, default_discount: e.target.value })}
                            placeholder="e.g., 10"
                        />
                    </div>
                </Modal>

                {/* Edit Room Modal */}
                <Modal
                    isOpen={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false);
                        setEditingRoom(null);
                        resetForm();
                    }}
                    title={`Edit Room - ${editingRoom?.room_name}`}
                    actionButton={
                        <button
                            onClick={handleEditRoom}
                            disabled={isEditing}
                            className="px-4 py-2 text-sm bg-secondary text-white font-medium rounded-lg cursor-pointer hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        >
                            {isEditing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : "Update Room"}
                        </button>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Room Name"
                            value={roomForm.room_name}
                            onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                            error={formErrors.room_name}
                        />

                        <SelectField
                            label="Room Type"
                            value={roomForm.room_type}
                            onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                            options={[
                                { value: "seater", label: "Seater" },
                                { value: "meeting", label: "Meeting Room" }
                            ]}
                        />

                        <InputField
                            label="Seater Capacity"
                            type="number"
                            min="1"
                            value={roomForm.seater_capacity}
                            onChange={(e) => setRoomForm({ ...roomForm, seater_capacity: e.target.value })}
                            error={formErrors.seater_capacity}
                        />

                        <InputField
                            label="Quantity"
                            type="number"
                            min="1"
                            value={roomForm.quantity}
                            onChange={(e) => setRoomForm({ ...roomForm, quantity: e.target.value })}
                            error={formErrors.quantity}
                        />

                        <InputField
                            label="Monthly Cost (₹)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={roomForm.monthly_cost}
                            onChange={(e) => setRoomForm({ ...roomForm, monthly_cost: e.target.value })}
                            error={formErrors.monthly_cost}
                        />

                        <InputField
                            label="Hourly Cost (₹)"
                            type="number"
                            min="0"
                            step="0.01"
                            value={roomForm.hourly_cost}
                            onChange={(e) => setRoomForm({ ...roomForm, hourly_cost: e.target.value })}
                            error={formErrors.hourly_cost}
                        />

                        <InputField
                            label="Default Discount (%)"
                            type="number"
                            min="0"
                            max="100"
                            value={roomForm.default_discount}
                            onChange={(e) => setRoomForm({ ...roomForm, default_discount: e.target.value })}
                        />
                    </div>
                </Modal>
            </div>
        </Admin>
    );
};

export default Rooms;