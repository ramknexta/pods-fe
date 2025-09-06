import React, { useState } from "react";
import { Icon } from "@iconify/react";

const durations = [
    { label: "30 min", value: 30, icon: "mdi:clock-outline" },
    { label: "1 hr", value: 60, icon: "mdi:clock-time-one-outline" },
    { label: "2 hr", value: 120, icon: "mdi:clock-time-two-outline" },
    { label: "Custom", value: "custom", icon: "mdi:clock-edit-outline" },
];

const timeSlots = [
    "9 am", "10 am", "11 am", "12 pm",
    "1 pm", "2 pm", "3 pm", "4 pm",
    "5 pm", "6 pm", "7 pm", "8 pm",
];

const Schedule = ({ selectedPod }) => {
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [roomType, setRoomType] = useState("monthly");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [customDuration, setCustomDuration] = useState("");

    // Example pricing logic
    const basePrice = roomType === "monthly"
        ? parseFloat(selectedPod.monthly_cost)
        : parseFloat(selectedPod.hourly_cost);

    const priceMultiplier = selectedDuration === 120 ? 2 :
        selectedDuration === 60 ? 1 :
            selectedDuration === 30 ? 0.5 :
                customDuration ? parseFloat(customDuration) / 60 : 1;

    const totalPrice = (basePrice * priceMultiplier).toFixed(2);

    return (
        <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Room Type Selector */}
            <div className="flex gap-4 justify-between">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <Icon icon="mdi:calendar-month" className="mr-2 text-secondary" />
                        Booking Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => setRoomType("monthly")}
                            className={`flex-1 flex text-sm items-center justify-center  rounded-xl border transition-all ${
                                roomType === "monthly"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon
                                icon="mdi:calendar-blank"
                                className={`mr-2 text-lg ${roomType === "monthly" ? "text-blue-500" : "text-gray-500"}`}
                            />
                            Monthly
                        </button>
                        <button
                            onClick={() => setRoomType("hourly")}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl border transition-all ${
                                roomType === "hourly"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon
                                icon="mdi:clock-outline"
                                className={`mr-2 text-lg ${roomType === "hourly" ? "text-blue-500" : "text-gray-500"}`}
                            />
                            Hourly
                        </button>
                    </div>
                </div>

                {roomType === "hourly" && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <Icon icon="mdi:timer-sand" className="mr-2 text-blue-500" />
                            Duration
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {durations.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => {
                                        setSelectedDuration(d.value);
                                        if (d.value !== "custom") setCustomDuration("");
                                    }}
                                    className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl border transition-all ${
                                        selectedDuration === d.value
                                            ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon icon={d.icon} className="text-2xl mb-2" />
                                    <span className="text-sm font-medium">{d.label}</span>
                                </button>
                            ))}
                        </div>

                        {selectedDuration === "custom" && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Duration (minutes)
                                </label>
                                <div className="relative">
                                    <Icon
                                        icon="mdi:timer-cog-outline"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="number"
                                        min="15"
                                        step="15"
                                        value={customDuration}
                                        onChange={(e) => setCustomDuration(e.target.value)}
                                        placeholder="Enter minutes (e.g., 90)"
                                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {roomType === "monthly" && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Icon icon="mdi:calendar-range" className="mr-2 text-blue-500" />
                        Select Dates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Icon icon="mdi:calendar-start" className="mr-1 text-blue-400" />
                                Start Date <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:calendar"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Icon icon="mdi:calendar-end" className="mr-1 text-blue-400" />
                                End Date <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:calendar"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Time Slots for Hourly */}
            {roomType === "hourly" && (
                <div className="max-w-4xl mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Icon icon="mdi:clock-time-four-outline" className="mr-2 text-blue-500" />
                        Select Time
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2 rounded-xl border transition-all ${
                                    selectedTime === slot
                                        ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Pricing Summary */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm font-medium">Total Price</p>
                    <p className="text-xs text-red-500">
                        * Pricing may vary based on duration and time.
                    </p>
                </div>
                <p className="text-2xl font-bold">₹{totalPrice}</p>
            </div>
        </div>
    );
};

export default Schedule;