import Admin from "../../layout/Admin.jsx";
import { Icon } from "@iconify/react";
import {useEffect, useState} from "react";
import {useFetchDashboardDataQuery} from "../../store/slices/management/managementApi.jsx";
import {useNavigate} from "react-router-dom";
import {useFetchAllocationListQuery, useFetchRoomStatisticsQuery} from "../../store/slices/management/allocationApi.js";
import { useDispatch } from "react-redux";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";


const statusConfig = {
    Confirmed: { color: "bg-green-100 text-green-800", icon: "mdi:check-circle" },
    Pending: { color: "bg-yellow-100 text-yellow-800", icon: "mdi:clock-time-three" },
    Cancelled: { color: "bg-red-100 text-red-800", icon: "mdi:close-circle" },
};

const paymentConfig = {
    Paid: { color: "bg-green-100 text-green-800", text: "Paid" },
    Pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
    Failed: { color: "bg-red-100 text-red-800", text: "Failed" },
};

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { data, isLoading } = useFetchDashboardDataQuery();
    const {data: allocationStats} = useFetchRoomStatisticsQuery()
    const { data: allocationList } = useFetchAllocationListQuery()

    useEffect(() => {
        dispatch(handleTitleChange("Dashboard"));
    },[])

    const bookings = allocationList?.data?.flatMap(customer =>
        customer?.allocations.map(allocation => {
            const startDate = new Date(allocation.start_date);
            const endDate = allocation.end_date ? new Date(allocation.end_date) : null;

            let duration;
            if (endDate) 
            {
                const diffMs = endDate - startDate;
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                duration = diffMins > 0 ? `${diffHrs}h ${diffMins}m` : `${diffHrs}h`;
            } else 
            {
                duration = "Ongoing";
            }

            // Payment status (dummy logic — replace with real when you have it)
            const paymentStatus = allocation.is_active
                ? `Paid ₹${allocation.total_amount}`
                : `Pending ₹${allocation.total_amount}`;

            return {
                id: allocation.id,  // allocation ID
                customer: customer.name,
                email: customer.email,
                pod: allocation.room_name,
                date: startDate.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }),
                duration,
                status: allocation.is_active ? "Confirmed" : "Pending",
                payment: paymentStatus
            };
        })
    ) || [];

    const allocationStatsCards = allocationStats?.data ? [
        {
            label: "Allocated Rooms",
            value: allocationStats.data.total_allocated_rooms,
            icon: <Icon icon='mdi:door' className="w-6 h-6 text-green-500" />,
        },
        {
            label: "Allocated Amount",
            value: `₹${allocationStats.data.total_allocated_amount.toLocaleString()}`,
            icon: <Icon icon='mdi:currency-inr' className="w-6 h-6 text-yellow-500" />,
        },
    ] : [];


    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>No data available</div>;

    const {
        total_branches,
        total_rooms,
        total_capacity,
        total_customers,
    } = data;

    const mgmtStats = [
        {
            label: "Total Branches",
            value: total_branches,
            icon: <Icon icon='mdi:office-building' className="w-6 h-6 text-purple-500" />,
            change: "+2 since last week",
            trend: "up"
        },
        {
            label: "Total Rooms",
            value: total_rooms,
            icon: <Icon icon='mdi:check-circle' className="w-6 h-6 text-green-500" />,
            change: "-1 since yesterday",
            trend: "down"
        },
        {
            label: "Capacity",
            value: total_capacity,
            icon: <Icon icon='mdi:calendar-check' className="w-6 h-6 text-blue-500" />,
            change: "No change",
            trend: "neutral"
        },
        {
            label: "Customers",
            value: total_customers,
            icon: <Icon icon='mdi:tools' className="w-6 h-6 text-red-500" />,
            change: "+1 since yesterday",
            trend: "up"
        },
    ];

    const itemsPerPage = 5;
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const paginatedBookings = bookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatClick = (stat) => {
        if (stat.label === "Total Branches") {
            navigate("/management")
        }
    };

    return (
        <Admin>
            <div className="px-6 space-y-4 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 invisible">Dashboard Overview</h1>
                    <div className="flex space-x-3">
                        {/* <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                            <Icon icon="mdi:filter" className="mr-2" />
                            Filters
                        </button> */}
                        {/* <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 flex items-center">
                            <Icon icon="mdi:plus" className="mr-2" />
                            New Booking
                        </button> */}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
                    {mgmtStats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                            onClick={() => handleStatClick(stat)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                    {allocationStatsCards.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-200 bg-secondary flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="pl-9 pr-4 py-2 border bg-white rounded-lg text-sm focus:outline-none w-full"
                            />
                            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5" />
                        </div>
                    </div>

                    <div className="h-80 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pod Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {paginatedBookings.map((b, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{b.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{b.customer}</p>
                                            <p className="text-xs text-gray-500">{b.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{b.pod}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{b.date}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{b.duration}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[b.status].color}`}>
                                        <Icon icon={statusConfig[b.status].icon} className="mr-1" />
                                          {b.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig[b.payment.split(" ")[0]].color}`}>
                                              {paymentConfig[b.payment.split(" ")[0]].text}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{b.payment.split(" ")[1]}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                                                <Icon icon="mdi:eye" className="w-5 h-5" />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                                                <Icon icon="mdi:pencil" className="w-5 h-5" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                                <Icon icon="mdi:delete" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, bookings.length)}
                            </span> of <span className="font-medium">{bookings.length}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentPage === i + 1 ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    );
};

export default Dashboard;