import Customer from "../../layout/Customer.jsx";
import { useSelector } from "react-redux";
import { useFetchCustomerAllocationsQuery } from "../../store/slices/management/allocationApi.js";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";

const CustomerDashboard = () => {
    const { customer_id } = useSelector((state) => state.auth);
    const { data: response } = useFetchCustomerAllocationsQuery(customer_id, {
        skip: !customer_id,
    });

    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("start_date");

    // Extract bookings from response or use empty array
    const bookings = response?.data || [];

    // Filter and sort bookings
    const filteredAndSortedBookings = useMemo(() => {
        let result = [...bookings];

        // Filter by status
        if (activeFilter === "active") {
            result = result.filter(booking => booking.is_active);
        } else if (activeFilter === "upcoming") {
            const now = new Date();
            result = result.filter(booking => new Date(booking.start_date) > now);
        } else if (activeFilter === "completed") {
            const now = new Date();
            result = result.filter(booking => new Date(booking.end_date) < now);
        }

        // Sort results
        result.sort((a, b) => {
            if (sortBy === "start_date") {
                return new Date(b.start_date) - new Date(a.start_date);
            } else if (sortBy === "room_name") {
                return a.room_name.localeCompare(b.room_name);
            } else if (sortBy === "total_amount") {
                return parseFloat(b.total_amount) - parseFloat(a.total_amount);
            }
            return 0;
        });

        return result;
    }, [bookings, activeFilter, sortBy]);

    // Calculate summary statistics
    const summary = useMemo(() => {
        const activeBookings = bookings.filter(booking => booking.is_active);
        const totalSpent = bookings.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0);
        const upcomingBookings = bookings.filter(booking => new Date(booking.start_date) > new Date());

        return {
            totalBookings: bookings.length,
            activeBookings: activeBookings.length,
            totalSpent,
            upcomingBookings: upcomingBookings.length
        };
    }, [bookings]);

    // Format date for display
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate days until booking
    const daysUntilBooking = (startDate) => {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(start - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Check if booking is currently active
    const isCurrentlyActive = (startDate, endDate) => {
        const now = new Date();
        return now >= new Date(startDate) && now <= new Date(endDate);
    };

    return (
        <Customer >
            <div className="p-6 min-h-screen h-full overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
                    <p className="text-gray-600">Manage your room bookings and allocations</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                <Icon icon="mdi:calendar-month" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-800">{summary.totalBookings}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                                <Icon icon="mdi:check-circle" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-800">{summary.activeBookings}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                                <Icon icon="mdi:currency-usd" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Spent</p>
                                <h3 className="text-2xl font-bold text-gray-800">${summary.totalSpent.toFixed(2)}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
                                <Icon icon="mdi:calendar-clock" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Upcoming Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-800">{summary.upcomingBookings}</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveFilter("all")}
                                    className={`px-3 py-1 text-sm rounded-md ${activeFilter === "all" ? "bg-white shadow-sm" : ""}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setActiveFilter("active")}
                                    className={`px-3 py-1 text-sm rounded-md ${activeFilter === "active" ? "bg-white shadow-sm" : ""}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setActiveFilter("upcoming")}
                                    className={`px-3 py-1 text-sm rounded-md ${activeFilter === "upcoming" ? "bg-white shadow-sm" : ""}`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setActiveFilter("completed")}
                                    className={`px-3 py-1 text-sm rounded-md ${activeFilter === "completed" ? "bg-white shadow-sm" : ""}`}
                                >
                                    Completed
                                </button>
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-100 border-0 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="start_date">Sort by Date</option>
                                <option value="room_name">Sort by Room</option>
                                <option value="total_amount">Sort by Price</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="grid grid-cols-1 gap-6 overflow-y-auto max-h-3/4">
                    {filteredAndSortedBookings.length > 0 ? (
                        filteredAndSortedBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${isCurrentlyActive(booking.start_date, booking.end_date) ? 'bg-green-100 text-green-600' : new Date(booking.start_date) > new Date() ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Icon icon="mdi:meeting-room" className="text-2xl" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{booking.room_name}</h3>
                                                    <p className="text-gray-600">{booking.branch_name} • {booking.location}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {booking.room_type}
                            </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {booking.booking_type}
                            </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {booking.seater_capacity} seats
                            </span>
                                                        {isCurrentlyActive(booking.start_date, booking.end_date) && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Currently Active
                              </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-800">${parseFloat(booking.total_amount).toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">Rate: ${parseFloat(booking.rate).toFixed(2)}/{booking.booking_type === 'monthly' ? 'month' : 'hour'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Start Date</p>
                                            <p className="font-medium text-gray-800">{formatDate(booking.start_date)}</p>
                                            {new Date(booking.start_date) > new Date() && (
                                                <p className="text-sm text-blue-600 mt-1">
                                                    In {daysUntilBooking(booking.start_date)} days
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">End Date</p>
                                            <p className="font-medium text-gray-800">{formatDate(booking.end_date)}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Booking ID</p>
                                            <p className="font-medium text-gray-800">#{booking.id}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Created: {new Date(booking.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center">
                                        <Icon icon="mdi:information" className="mr-1" />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center"
                        >
                            <Icon icon="mdi:calendar-remove" className="text-4xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
                            <p className="text-gray-600">You don't have any bookings matching your current filters.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </Customer>
    );
};

export default CustomerDashboard;