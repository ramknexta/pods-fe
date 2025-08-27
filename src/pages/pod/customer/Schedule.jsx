import React, { useState } from "react";

const durations = [
    { label: "30 min", value: 30 },
    { label: "1 hr", value: 60 },
    { label: "2 hr", value: 120 },
    { label: "Custom", value: "custom" },
];

const timeSlots = [
    "9 am", "10 am", "11 am", "12 pm",
    "1 pm", "2 pm", "3 pm", "4 pm",
    "5 pm", "6 pm", "7 pm", "8 pm",
];

const Schedule = () => {
    const [date, setDate] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Example pricing logic
    const basePrice = 200;
    const priceMultiplier = selectedDuration === 120 ? 2 : 1; // example: 2hr = double price
    const totalPrice = basePrice * priceMultiplier;

    return (
        <>
            <div className="p-6 bg-white rounded-2xl shadow">

               <div className="flex justify-between items-center mb-6">
                   {/* Date Picker */}
                   <div className="mb-6">
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                           Select Date <span className="text-red-500">*</span>
                       </label>
                       <input
                           type="date"
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className="w-full border rounded-lg px-3 py-2"
                       />
                   </div>

                   {/* Duration */}
                   <div className="mb-6">
                       <p className="text-sm font-medium text-gray-700 mb-2">Duration</p>
                       <div className="grid grid-cols-4 gap-2">
                           {durations.map((d) => (
                               <button
                                   key={d.value}
                                   onClick={() => setSelectedDuration(d.value)}
                                   className={`px-3 py-2 rounded-lg ${
                                       selectedDuration === d.value
                                           ? "bg-blue-500 text-white"
                                           : "bg-gray-100 hover:bg-gray-200"
                                   }`}
                               >
                                   {d.label}
                               </button>
                           ))}
                       </div>
                   </div>
               </div>

                {/* Time Slots */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Time Slots</p>
                    <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`px-3 py-2 rounded-lg ${
                                    selectedTime === slot
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Total Price */}
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
        </>
    );
};

export default Schedule;
