import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import DatePickerModal from "../../../components/model/DatePickerModal.jsx";
import moment from "moment";

const durations = [
    { label: "30 min", value: 30, icon: "mdi:clock-outline" },
    { label: "1 hr", value: 60, icon: "mdi:clock-time-one-outline" },
    { label: "2 hr", value: 120, icon: "mdi:clock-time-two-outline" },
    { label: "Custom", value: "custom", icon: "mdi:clock-edit-outline" },
];

const monthlyOptions = [
    { label: "1 Month", value: 1 },
    { label: "3 Months", value: 3 },
    { label: "6 Months", value: 6 },
    { label: "12 Months", value: 12 },
];

const Schedule = ({ selectedPod, handleSlotSelect }) => {
    const [selectDate, setSelectDate] = useState({
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment().add(1, "months").format("YYYY-MM-DD"),
    });
    const [roomType, setRoomType] = useState("monthly");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [customDuration, setCustomDuration] = useState("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const basePrice =
        roomType === "monthly"
            ? parseFloat(selectedPod.monthly_cost)
            : parseFloat(selectedPod.hourly_cost);

    // Compute price
    const totalPrice = useMemo(() => {
        if (roomType === "monthly") {
            return basePrice * (selectedDuration || 1);
        }
        const hours =
            selectedDuration === "custom"
                ? (parseInt(customDuration) || 0) / 60
                : (selectedDuration || 0) / 60;
        return basePrice * hours;
    }, [roomType, selectedDuration, customDuration, basePrice]);

    // Push changes upward
    useEffect(() => {
        handleSlotSelect({
            room_type: roomType,
            start_date: selectDate.start_date,
            end_date: selectDate.end_date,
            quantity_booked: 1,
            total_price: totalPrice,
        });
    }, [roomType, selectedDuration, customDuration, selectDate, totalPrice]);

    // Allowed booking dates
    const roomAvailabilityCalendar = useMemo(() => {
        const allowedDays = selectedPod?.available_dates?.flatMap((range) => {
            const start = moment(range.start);
            const end = moment(range.end);
            const days = [];
            while (start.isSameOrBefore(end, "day")) {
                days.push(start.toDate());
                start.add(1, "day");
            }
            return days;
        });
        return allowedDays;
    }, [selectedPod?.available_dates]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Booking form */}
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                {/* Booking Type */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Icon icon="mdi:calendar-month" className="mr-2 text-blue-500" />
                        Booking Type
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setRoomType("monthly")}
                            className={`flex items-center justify-center py-3 px-4 rounded-xl border transition-all ${
                                roomType === "monthly"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon
                                icon="mdi:calendar-blank"
                                className="mr-2 text-lg"
                            />
                            Monthly
                        </button>
                        <button
                            onClick={() => setRoomType("hourly")}
                            className={`flex items-center justify-center py-3 px-4 rounded-xl border transition-all ${
                                roomType === "hourly"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon
                                icon="mdi:clock-outline"
                                className="mr-2 text-lg"
                            />
                            Hourly
                        </button>
                    </div>
                </div>

                {/* Duration Selection */}
                {roomType === "hourly" && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
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

                {/* Monthly Options */}
                {roomType === "monthly" && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Icon icon="mdi:calendar-range" className="mr-2 text-blue-500" />
                            Monthly Options
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {monthlyOptions.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => {
                                        setSelectedDuration(d.value);
                                        if (d.value !== "custom") setCustomDuration("");
                                    }}
                                    className={`flex items-center justify-center py-3 px-4 rounded-xl border transition-all ${
                                        selectedDuration === d.value
                                            ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Date Picker */}
                <button
                    onClick={() => setIsDatePickerOpen(true)}
                    className="mt-2 w-full bg-secondary hover:bg-primary text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                    Choose Date
                </button>

                <DatePickerModal
                    isDatePickerOpen={isDatePickerOpen}
                    setIsDatePickerOpen={setIsDatePickerOpen}
                    checkAvailableDate={roomAvailabilityCalendar}
                    roomSelection={selectDate}
                    setRoomSelection={setSelectDate}
                />

                {/* Pricing Summary */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Total Price</p>
                        <p className="text-xs text-red-500">
                            * Pricing may vary based on duration and time.
                        </p>
                    </div>
                    <p className="text-2xl font-bold text-secondary">₹{totalPrice || 0}</p>
                </div>
            </div>

            {/* Right side - Booked Slots */}
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Icon icon="mdi:calendar-check" className="mr-2 text-green-500" />
                    Booked Slots
                </h3>
                { selectedPod ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">

                            <li
                                className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col"
                            >
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-700">
                                        {moment(selectDate.start_date).format("DD MMM YYYY, hh:mm A")}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {moment(selectDate.end_date).format("DD MMM YYYY, hh:mm A")}
                                    </p>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-gray-500">
                                    <span>Duration: {selectedDuration || "N/A"}</span>
                                    {/*<span>Status: {slot.status || "Booked"}</span>*/}
                                </div>
                            </li>
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">No slots booked yet.</p>
                )}
            </div>
        </div>
    );
};

export default Schedule;
