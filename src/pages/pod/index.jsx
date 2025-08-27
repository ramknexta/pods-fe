import React, { useState, useMemo, useCallback } from "react";
import Admin from "../../layout/Admin.jsx";
import { Icon } from "@iconify/react";
import {AVAILABILITY_STATUS, POD_STATUS} from "../../utils/constants.js";
import {PodCard} from "../../components/Card/PodCard.jsx";

const initialPods = [
    {
        id: 1,
        name: "Solo Room",
        price: "₹200/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "0/1",
        tags: ["WiFi", "Water", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 2,
        name: "Trio Room",
        price: "₹100/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "3/3",
        tags: ["WiFi", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 3,
        name: "Quad Room",
        price: "₹400/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.BOOKED,
        capacity: "0/4",
        tags: ["WiFi", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 4,
        name: "Hive Room",
        price: "₹600/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "5/5",
        tags: ["WiFi", "Water", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 5,
        name: "Deck Room",
        price: "₹1000/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "0/12",
        tags: ["WiFi", "Table", "A/C"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 6,
        name: "Core Room",
        price: "₹800/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.MAINTENANCE,
        capacity: "0/6",
        tags: ["WiFi", "Projector", "Whiteboard"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
];






const Pod = () => {
    const [pods, setPods] = useState(initialPods);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

    const filteredPods = useMemo(() => {
        return pods.filter((pod) => {
            const matchesSearch = pod.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || pod.status === statusFilter;
            const matchesAvailability =
                availabilityFilter === "all" || pod.availability === availabilityFilter;
            return matchesSearch && matchesStatus && matchesAvailability;
        });
    }, [pods, searchQuery, statusFilter, availabilityFilter]);


    const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);
    const handleStatusFilterChange = useCallback((e) => setStatusFilter(e.target.value), []);
    const handleAvailabilityFilterChange = useCallback((e) => setAvailabilityFilter(e.target.value), []);

    const handleEditPod = useCallback((podId) => {
        // Ideally open modal or route
        console.log("Edit pod:", podId);
    }, []);

    const handleDeletePod = useCallback((podId) => {
        // Add confirmation modal in production
        setPods((prev) => prev.filter((pod) => pod.id !== podId));
    }, []);

    const handleAddPod = useCallback(() => {
        // Ideally open modal or route
        console.log("Add new pod");
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery("");
        setStatusFilter("all");
        setAvailabilityFilter("all");
    }, []);


    return (
        <Admin>
            <section className="p-6 w-3/4 mx-auto h-200">
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
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Search pods"
                    />
                </div>

                {/* Filters + Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Filter by status"
                        >
                            <option value="all">All Statuses</option>
                            <option value={POD_STATUS.ACTIVE}>Active</option>
                            <option value={POD_STATUS.INACTIVE}>Inactive</option>
                        </select>

                        <select
                            value={availabilityFilter}
                            onChange={handleAvailabilityFilterChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Filter by availability"
                        >
                            <option value="all">All Availability</option>
                            <option value={AVAILABILITY_STATUS.AVAILABLE}>Available</option>
                            <option value={AVAILABILITY_STATUS.BOOKED}>Booked</option>
                            <option value={AVAILABILITY_STATUS.MAINTENANCE}>Maintenance</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Clear filters"
                        >
                            <Icon icon="uil:filter-slash" size={18} /> Clear
                        </button>
                        <button
                            onClick={handleAddPod}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Add new pod"
                        >
                            <Icon icon="uil:plus" size={18} /> Add Pod
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500">
                Showing {filteredPods.length} of {pods.length} pods
            </div>

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
