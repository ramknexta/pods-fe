import React, {useState, useMemo, useCallback, useEffect} from "react";
import Admin from "../../layout/Admin.jsx";
import { Icon } from "@iconify/react";
import {PodCard} from "../../components/Card/PodCard.jsx";
import {
    useDeleteBranchRoomMutation,
    useFetchAllRoomsQuery,
    useFetchBranchByMgmtIdQuery
} from "../../store/slices/management/managementApi.jsx";
import RoomModel from "../rooms/RoomModel.jsx";
import {useSelector} from "react-redux";

const Pod = () => {
    const { mgmt_id } = useSelector((state) => state.auth);
    const [pods, setPods] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roomFilter, setRoomFilter] = useState("all");
    const [branchFilter, setBranchFilter] = useState("all")
    const [roomForm, setRoomForm] = useState({
        room_name: "",
        room_type: "seater",
        seater_capacity: "",
        quantity: "",
        monthly_cost: "",
        hourly_cost: "",
        default_discount: "",
    });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);

    const {data: branches } = useFetchBranchByMgmtIdQuery(mgmt_id, { skip: !mgmt_id});

    const {data: totalRooms, isLoading, refetch } = useFetchAllRoomsQuery();
    const [deleteBranchRoom, { isLoading: isDeleting }] = useDeleteBranchRoomMutation();

    useEffect(() => {
        if (totalRooms?.data){
            setPods(totalRooms.data || []);
        }
    }, [totalRooms]);

    const filteredPods = useMemo(() => {
        return pods.filter((pod) => {
            const matchesSearch = pod.room_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                roomFilter === "all" || (pod.room_type && pod.room_type === roomFilter);

            const matchesAvailability =
                branchFilter === "all" || (pod.branch_id && String(pod.branch_id) === String(branchFilter));

            return matchesSearch && matchesStatus && matchesAvailability;
        }) || [];
    }, [pods, searchQuery, roomFilter, branchFilter]);


    const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);
    const handleStatusFilterChange = useCallback((e) => setRoomFilter(e.target.value), []);
    const handleAvailabilityFilterChange = useCallback((e) => setBranchFilter(e.target.value), []);

    const handleEditPod = useCallback((room) => {
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
    }, []);

    const handleDeletePod = useCallback(async (podId) => {
        if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
            try {
                await deleteBranchRoom(podId).unwrap();
                refetch();
            } catch (err) {
                console.error("Failed to delete room:", err);
            }
        }
        setPods((prev) => prev.filter((pod) => pod.id !== podId));
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery("");
        setRoomFilter("all");
        setBranchFilter("all");
    }, []);


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
    };

    const closeAddModel = (() => {
        setIsAddOpen(false);
        refetch();
    })

    const closeEditModel = () => {
        setIsEditOpen(false);
        setEditingRoom(null);
        resetForm();
        refetch();
    }

    return (
        <Admin>
            <section className="p-6 max-w-7xl mx-auto h-200">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Workspace Pods</h1>
                <p className="text-gray-500 mt-2">
                    Manage your workspace pods and their availability
                </p>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                {/* Search */}
                <div className="relative w-full md:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="uil:search" className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search pods..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full border text-sm border-gray-300 rounded-lg pl-10 pr-4 py-2"
                        aria-label="Search pods"
                    />
                </div>

                {/* Filters + Actions */}
                <div className="flex flex-col text-sm sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                        <select
                            value={roomFilter}
                            onChange={handleStatusFilterChange}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            aria-label="Filter by status"
                        >
                            <option value="all">Room Types</option>
                            <option value='meeting'>Meeting</option>
                            <option value='seater'>Seater</option>
                            <option value='others'>Others</option>
                        </select>

                        <select
                            value={branchFilter}
                            onChange={handleAvailabilityFilterChange}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            aria-label="Filter by availability"
                        >
                            <option value="all">Select Branches</option>
                            {
                                branches?.data?.map((branch) => (
                                    <option key={branch.id} value={branch.branch_id}>{branch.branch_name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            aria-label="Clear filters"
                        >
                            <Icon icon="uil:filter-slash" size={18} /> Clear
                        </button>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-1 px-4 py-2 bg-secondary text-white text-sm rounded-lg hover:bg-primary transition-colors duration-200"
                            aria-label="Add new pod"
                        >
                            <Icon icon="uil:plus" size={18} /> Add Pod
                        </button>
                        {isAddOpen && (
                            <div>
                                <select
                                    value={selectedBranchId}
                                    onChange={(e) => setSelectedBranchId(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value={null}>Select Branch</option>
                                    {
                                        branches?.data?.map((branch) => (
                                            <option key={branch.id} value={branch.branch_id}>{branch.branch_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500">
                Showing {filteredPods.length} of {pods.length} pods
            </div>
            {/*Add Model*/}
            {
                isAddOpen && selectedBranchId && (
                    <RoomModel isAdd={isAddOpen} closeModel={closeAddModel} form={roomForm} branchID={selectedBranchId} />
                )
            }

            {/*Edit Model*/}
            {isEditOpen && (
                <RoomModel isEdit={isEditOpen} selectedRoom={editingRoom} closeModel={closeEditModel} form={roomForm} />
            )}
            {/* Grid */}
            {filteredPods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-h-1/2 overflow-y-auto">
                    {filteredPods.map((pod) => (
                        <PodCard
                            key={pod.id}
                            pod={pod}
                            onEdit={handleEditPod}
                            onDelete={handleDeletePod}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon icon="uil:package" className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No pods found</h3>
                    <p className="mt-2 text-gray-500">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}
            </section>
        </Admin>
    );
};

export default Pod;
