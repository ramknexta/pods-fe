import { Icon } from "@iconify/react";
import moment from "moment";

const Review = ({ selectedPod, selectedSlot, onConfirm, onBack }) => {
    if (!selectedPod || !selectedSlot) {
        return (
            <p className="text-gray-500 text-center py-6">
                No booking selected.
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Workspace / Pod Details */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <Icon icon="mdi:office-building" className="text-blue-600 text-2xl" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Workspace Details
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-gray-700 text-sm">
                    <p>
                        <span className="font-medium">Room Name:</span>{" "}
                        {selectedPod.room_name}
                    </p>
                    <p>
                        <span className="font-medium">Type:</span>{" "}
                        {selectedPod.room_type}
                    </p>
                    <p>
                        <span className="font-medium">Capacity:</span>{" "}
                        {selectedPod.seater_capacity}
                    </p>
                    <p>
                        <span className="font-medium">Available:</span>{" "}
                        {selectedPod.available_quantity}
                    </p>
                    <p>
                        <span className="font-medium">Monthly Cost:</span> ₹
                        {selectedPod.monthly_cost}
                    </p>
                    <p>
                        <span className="font-medium">Hourly Cost:</span> ₹
                        {selectedPod.hourly_cost}
                    </p>
                </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <Icon icon="mdi:calendar-clock" className="text-green-600 text-2xl" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Booking Details
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-gray-700 text-sm">
                    <p>
                        <span className="font-medium">Booking Type:</span>{" "}
                        {selectedSlot.room_type}
                    </p>
                    <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {moment(selectedSlot.start_date).format("DD MMM YYYY")}
                    </p>
                    <p>
                        <span className="font-medium">End Date:</span>{" "}
                        {moment(selectedSlot.end_date).format("DD MMM YYYY")}
                    </p>
                    {selectedSlot.time && (
                        <p>
                            <span className="font-medium">Time:</span>{" "}
                            {selectedSlot.time}
                        </p>
                    )}
                    {selectedSlot.duration && (
                        <p>
                            <span className="font-medium">Duration:</span>{" "}
                            {selectedSlot.duration} mins
                        </p>
                    )}
                    <p className="col-span-2 md:col-span-3 text-lg font-bold text-green-600 mt-2">
                        Total Price: ₹{selectedSlot.total_price}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Review;
