import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

const CustomerCard = ({ customer }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/customer-details?customer_id=${customer?.id}`)}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <Icon icon="mdi:business" className="w-6 h-6 text-red-500 mr-2" />
                    <div>
                        <h3 className="font-semibold text-gray-800">{customer?.name || 'Unknown Customer'}</h3>
                        <p className="text-sm text-gray-500">Management: {customer?.management_name || 'Unknown Management'}</p>
                    </div>
                </div>
                <button className="text-red-500 hover:text-red-700">
                    <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-3">
                <div className="flex items-center text-sm">
                    <Icon icon="mdi:map-marker" className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-gray-700">{customer?.location || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm">
                    <Icon icon="mdi:card-account-details" className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-gray-700">{customer?.gstin || 'N/A'}</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Customer ID: {customer?.id}</span>

                {customer?.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {customer?.status}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CustomerCard;