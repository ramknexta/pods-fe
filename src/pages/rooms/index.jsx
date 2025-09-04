import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    useFetchRoomByBranchIdQuery,
    useAddBranchRoomMutation,
    useEditBranchRoomMutation,
    useDeleteBranchRoomMutation,
} from "../../store/slices/management/managementApi.jsx";
import Admin from "../../layout/Admin.jsx";
import { useDispatch } from "react-redux";
import { handleTitleChange } from "../../store/slices/auth/authSlice.js";
import { Icon } from "@iconify/react";

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
                            <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
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
                        <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
                    <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[50vh] overflow-y-auto">
                        {data.data.map((room) => (
                            <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
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
                                                <Icon icon="mdi:pencil" className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoom(room.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                                aria-label="Delete room"
                                                disabled={isDeleting}
                                            >
                                                <Icon icon="mdi:delete" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Icon icon="mdi:account-group" className="w-4 h-4 mr-2" />
                                            {room.seater_capacity} seats
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Icon icon="mdi:package-variant" className="w-4 h-4 mr-2" />
                                            {room.quantity} units
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Icon icon="mdi:cash-monthly" className="w-4 h-4 mr-2" />
                                            ₹{room.monthly_cost}/mo
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-2" />
                                            ₹{room.hourly_cost}/hr
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {room.room_type === 'seater' ? 'Seater Room' : 'Meeting Room'}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {room.total_capacity === room.booked_quantity ? 'Occupied' : `Available: ${room.available_quantity}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <Icon icon="mdi:office-building-outline" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                {isAddOpen && (
                    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Add New Room to {branchName}</h2>
                                <button
                                    onClick={() => {
                                        setIsAddOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <Icon icon="mdi:close" className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room Name
                                        </label>
                                        <input
                                            type="text"
                                            value={roomForm.room_name}
                                            onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.room_name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., Conference Room A"
                                        />
                                        {formErrors.room_name && <p className="mt-1 text-sm text-red-600">{formErrors.room_name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room Type
                                        </label>
                                        <select
                                            value={roomForm.room_type}
                                            onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.room_type ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="seater">Seater</option>
                                            <option value="meeting">Meeting Room</option>
                                        </select>
                                        {formErrors.room_type && <p className="mt-1 text-sm text-red-600">{formErrors.room_type}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seater Capacity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={roomForm.seater_capacity}
                                            onChange={(e) => setRoomForm({ ...roomForm, seater_capacity: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.seater_capacity ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., 10"
                                        />
                                        {formErrors.seater_capacity && <p className="mt-1 text-sm text-red-600">{formErrors.seater_capacity}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={roomForm.quantity}
                                            onChange={(e) => setRoomForm({ ...roomForm, quantity: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., 2"
                                        />
                                        {formErrors.quantity && <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Monthly Cost (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={roomForm.monthly_cost}
                                            onChange={(e) => setRoomForm({ ...roomForm, monthly_cost: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.monthly_cost ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., 5000"
                                        />
                                        {formErrors.monthly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.monthly_cost}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hourly Cost (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={roomForm.hourly_cost}
                                            onChange={(e) => setRoomForm({ ...roomForm, hourly_cost: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.hourly_cost ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., 100"
                                        />
                                        {formErrors.hourly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.hourly_cost}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={roomForm.default_discount}
                                            onChange={(e) => setRoomForm({ ...roomForm, default_discount: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setIsAddOpen(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddRoom}
                                    disabled={isAdding}
                                    className="px-4 py-2 text-sm bg-secondary text-white font-medium rounded-lg hover:bg-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {isAdding ? (
                                        <span className="flex items-center">
                                            <Icon icon="mdi:loading" className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                            Adding...
                                        </span>
                                    ) : "Add Room"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Room Modal */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Edit Room - {editingRoom?.room_name}</h2>
                                <button
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setEditingRoom(null);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <Icon icon="mdi:close" className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room Name
                                        </label>
                                        <input
                                            type="text"
                                            value={roomForm.room_name}
                                            onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.room_name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.room_name && <p className="mt-1 text-sm text-red-600">{formErrors.room_name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room Type
                                        </label>
                                        <select
                                            value={roomForm.room_type}
                                            onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.room_type ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="seater">Seater</option>
                                            <option value="meeting">Meeting Room</option>
                                        </select>
                                        {formErrors.room_type && <p className="mt-1 text-sm text-red-600">{formErrors.room_type}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seater Capacity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={roomForm.seater_capacity}
                                            onChange={(e) => setRoomForm({ ...roomForm, seater_capacity: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.seater_capacity ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.seater_capacity && <p className="mt-1 text-sm text-red-600">{formErrors.seater_capacity}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={roomForm.quantity}
                                            onChange={(e) => setRoomForm({ ...roomForm, quantity: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.quantity && <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Monthly Cost (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={roomForm.monthly_cost}
                                            onChange={(e) => setRoomForm({ ...roomForm, monthly_cost: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.monthly_cost ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.monthly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.monthly_cost}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hourly Cost (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={roomForm.hourly_cost}
                                            onChange={(e) => setRoomForm({ ...roomForm, hourly_cost: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${formErrors.hourly_cost ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.hourly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.hourly_cost}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={roomForm.default_discount}
                                            onChange={(e) => setRoomForm({ ...roomForm, default_discount: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setEditingRoom(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditRoom}
                                    disabled={isEditing}
                                    className="px-4 py-2 text-sm bg-secondary text-white font-medium rounded-lg cursor-pointer hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {isEditing ? (
                                        <span className="flex items-center">
                                            <Icon icon="mdi:loading" className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                            Updating...
                                        </span>
                                    ) : "Update Room"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Admin>
    );
};

export default Rooms;