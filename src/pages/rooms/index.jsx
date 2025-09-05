import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    useFetchRoomByBranchIdQuery,
    useDeleteBranchRoomMutation,
} from "../../store/slices/management/managementApi.jsx";
import Admin from "../../layout/Admin.jsx";
import { useDispatch } from "react-redux";
import { handleTitleChange } from "../../store/slices/auth/authSlice.js";
import { Icon } from "@iconify/react";
import Spinner from "../../components/loader/Spinner.jsx";
import RoomModel from "./RoomModel.jsx";

const Rooms = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const branchID = searchParams.get("branch_id");
    const branchName = searchParams.get("branch_name");

    const { data, isLoading, refetch, error } = useFetchRoomByBranchIdQuery(branchID);
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

    const closeEditModel = () => {
        setIsEditOpen(false);
        setEditingRoom(null);
        resetForm();
        refetch();
    }

    const closeAddModel = () => {
        setIsAddOpen(false);
        resetForm();
        refetch();
    }

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
                    <Spinner />
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
                    <RoomModel isAdd={isAddOpen} closeModel={closeAddModel} form={roomForm} branchID={branchID} />
                )}

                {/* Edit Room Modal */}
                {isEditOpen && (
                    <RoomModel isEdit={isEditOpen} selectedRoom={editingRoom} closeModel={closeEditModel} form={roomForm} />
                )}
            </div>
        </Admin>
    );
};

export default Rooms;