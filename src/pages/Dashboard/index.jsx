import Admin from "../../layout/Admin.jsx";
import { Icon } from "@iconify/react";
import {useState} from "react";
import {useFetchDashboardDataQuery} from "../../store/slices/management/managementApi.jsx";
import ManagementCard from "../management/ManagementCard.jsx";
import {useNavigate} from "react-router-dom";

const stats = [
    {
        label: "Total Pods",
        value: 6,
        icon: <Icon icon='mdi:office-building' className="w-6 h-6 text-purple-500" />,
        change: "+2 since last week",
        trend: "up"
    },
    {
        label: "Available",
        value: 3,
        icon: <Icon icon='mdi:check-circle' className="w-6 h-6 text-green-500" />,
        change: "-1 since yesterday",
        trend: "down"
    },
    {
        label: "Booked",
        value: 1,
        icon: <Icon icon='mdi:calendar-check' className="w-6 h-6 text-blue-500" />,
        change: "No change",
        trend: "neutral"
    },
    {
        label: "Maintenance",
        value: 2,
        icon: <Icon icon='mdi:tools' className="w-6 h-6 text-red-500" />,
        change: "+1 since yesterday",
        trend: "up"
    },
];

const bookings = [
    { id: "BK001", customer: "John Smith", email: "johnsmith@example.com", pod: "Focus Pod", date: "Aug 5, 2024 09:00 AM", duration: "2h", status: "Confirmed", payment: "Paid ₹500" },
    { id: "BK002", customer: "Emma Johnson", email: "emmaj@example.com", pod: "Collaboration Hub", date: "Aug 5, 2024 11:30 AM", duration: "1:30h", status: "Pending", payment: "Pending ₹480" },
    { id: "BK003", customer: "Michael Brown", email: "mbrown@example.com", pod: "Meeting Room Beta", date: "Aug 5, 2024 02:30 PM", duration: "2h", status: "Cancelled", payment: "Failed ₹120" },
    { id: "BK004", customer: "Sarah Williams", email: "sarahw@example.com", pod: "Creative Studio", date: "Aug 5, 2024 11:00 AM", duration: "1:30h", status: "Confirmed", payment: "Paid ₹600" },
    { id: "BK005", customer: "David Miller", email: "davidm@example.com", pod: "Quiet Zone Delta", date: "Aug 5, 2024 01:00 PM", duration: "1h", status: "Confirmed", payment: "Paid ₹315" },
    { id: "BK006", customer: "Lisa Anderson", email: "lisa@example.com", pod: "Collaboration Hub", date: "Aug 5, 2024 07:00 AM", duration: "2h", status: "Pending", payment: "Pending ₹250" },
];

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
    const { data, isLoading } = useFetchDashboardDataQuery();

    const navigate = useNavigate();


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
            <div className="p-6 space-y-6  min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 invisible">Dashboard Overview</h1>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                            <Icon icon="mdi:filter" className="mr-2" />
                            Filters
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 flex items-center">
                            <Icon icon="mdi:plus" className="mr-2" />
                            New Booking
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">*/}
                {/*    {stats.map((stat, i) => (*/}
                {/*        <div*/}
                {/*            key={i}*/}
                {/*            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"*/}
                {/*        >*/}
                {/*            <div className="flex justify-between items-start">*/}
                {/*                <div>*/}
                {/*                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>*/}
                {/*                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>*/}
                {/*                    <p className={`text-xs mt-2 flex items-center ${*/}
                {/*                        stat.trend === "up" ? "text-red-500" :*/}
                {/*                            stat.trend === "down" ? "text-green-500" : "text-gray-500"*/}
                {/*                    }`}>*/}
                {/*                        {stat.trend === "up" ? (*/}
                {/*                            <Icon icon="mdi:arrow-up" className="mr-1" />*/}
                {/*                        ) : stat.trend === "down" ? (*/}
                {/*                            <Icon icon="mdi:arrow-down" className="mr-1" />*/}
                {/*                        ) : null}*/}
                {/*                        {stat.change}*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*                <div className="bg-gray-100 p-3 rounded-lg">*/}
                {/*                    {stat.icon}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                </div>

                {/* Table Section */}
                <div className="max-h-96 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
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