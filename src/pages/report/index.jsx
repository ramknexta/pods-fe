import React, { useState } from "react";
import Admin from "../../layout/Admin.jsx";
import { useSelector } from "react-redux";
import {
    useFetchInvoiceDetailsQuery,
    useFetchInvoicesQuery, useLazyGetInvoicePdfQuery,
} from "../../store/slices/invoice/invoiceApi.js";
import { Icon } from "@iconify/react";
import {Link} from "react-router-dom";

const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(num || 0));

const fmtDateTime = (iso) => {
    try {
        const d = new Date(iso);
        return `${d.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })}`;
    } catch {
        return "-";
    }
};

const Report = () => {
    const { mgmt_id } = useSelector((state) => state.auth);

    const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data: details } = useFetchInvoiceDetailsQuery(mgmt_id);
    const { data: invoices, isLoading } = useFetchInvoicesQuery( mgmt_id, page, limit, true);
    const [fetchInvoices] = useLazyGetInvoicePdfQuery();

    const handleDownload = async (id) => {
        try {
            const blob = await fetchInvoices(id).unwrap();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${id}.pdf`); // dynamic filename
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
        } catch (err) {
            console.error("Error downloading invoice:", err);
        }
    };

    const totalInvoices = invoices?.data?.invoices.length || 0;
    const totalPages = Math.ceil(totalInvoices / limit);

    const paginatedInvoice = invoices?.data?.invoices.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    return (
        <Admin>
            <div className="p-6 space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {details?.data ? (
                        <>
                            <SummaryCard
                                icon="mdi:currency-inr"
                                label="Total Revenue"
                                value={formatINR(details.data.total_amount?.amount)}
                                color="text-orange-500"
                            />
                            <SummaryCard
                                icon="mdi:wallet-outline"
                                label="Pending Payments"
                                value={formatINR(details.data.open?.amount)}
                                color="text-blue-500"
                            />
                            <SummaryCard
                                icon="mdi:file-send-outline"
                                label="Invoice sent"
                                value={details.data.open?.count || 0}
                                color="text-green-500"
                            />
                            <SummaryCard
                                icon="mdi:cash-refund"
                                label="Refund issued"
                                value={formatINR(details.data.refund?.amount)}
                                color="text-purple-500"
                            />
                        </>
                    ) : (
                        [...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 h-24 rounded-xl animate-pulse"
                            />
                        ))
                    )}
                </div>

                {/* Filters + Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <button className="px-4 py-2 border rounded-lg text-gray-600 text-sm  flex items-center gap-2 hover:bg-gray-50">
                        <Icon icon="mdi:filter" /> Filter
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm flex items-center gap-2 hover:bg-gray-800">
                            <Icon icon="mdi:cash-refund" /> Refund
                        </button>
                        <button className="px-4 py-2 border rounded-lg text-gray-600 text-sm  flex items-center gap-2 hover:bg-gray-50">
                            <Icon icon="mdi:file-pdf-box" /> Export PDF
                        </button>
                        <button className="px-4 py-2 border rounded-lg text-gray-600 text-sm  flex items-center gap-2 hover:bg-gray-50">
                            <Icon icon="mdi:file-delimited-outline" /> Export CSV
                        </button>
                        <Link to="/invoice/create" className="px-4 py-2 border rounded-lg text-gray-600 text-sm  flex items-center gap-2 hover:bg-gray-50">
                            <Icon icon="mdi:file" /> Create Invoice
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div>
                    <div className="flex gap-6">
                        <button className="pb-2 border-b-2 border-gray-900 text-gray-900 font-medium">
                            Invoices
                        </button>
                        <button className="pb-2 text-gray-500 hover:text-gray-700">
                            Payments
                        </button>
                        <button className="pb-2 text-gray-500 hover:text-gray-700">
                            Refunds
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : invoices?.data?.invoices?.length ? (
                        <div className="h-70 overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-secondary text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Issue Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium ">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedInvoice.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3 font-medium text-gray-800">
                                            {inv.invoice_no}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700">
                                            <div>
                                                {inv.customer_name}
                                                <div className="text-xs text-gray-400">
                                                    {inv.customer_email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {fmtDateTime(inv.issue_date)}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">{fmtDateTime(inv.due_date)}</td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    inv.status === "confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                        : inv.status === "pending"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : inv.status === "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                              {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-gray-800">
                                            {inv.amount_status === "paid" ? (
                                                <span className="text-green-600">
                                                    Paid {formatINR(inv.amount)}
                                                  </span>
                                            ) : inv.amount_status === "failed" ? (
                                                <span className="text-red-600">
                                                    Failed {formatINR(inv.amount)}
                                                  </span>
                                            ) : (
                                                <span className="text-amber-600 flex flex-col items-center gap-1">
                                                    Pending
                                                    <span className='text-secondary'>{formatINR(inv.amount)}</span>
                                                  </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center text-gray-600">
                                            <Icon
                                                onClick={() => handleDownload(inv.id)}
                                                icon="mdi:dots-horizontal"
                                                className="text-2xl cursor-pointer hover:text-gray-800"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">No invoices found.</div>
                    )}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing
                            <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium">
                                        {Math.min(currentPage * limit, totalPages)}
                                    </span> of <span className="font-medium">{totalPages}</span> results
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

const SummaryCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg shadow-gray-200 flex items-center gap-4">
        <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${color}`}
        >
            <Icon icon={icon} className="text-2xl" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Report;
