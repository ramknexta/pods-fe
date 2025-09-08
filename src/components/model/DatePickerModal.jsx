import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import "react-day-picker/dist/style.css";

const DatePickerModal = ({ isDatePickerOpen, setIsDatePickerOpen, checkAvailableDate, roomSelection, setRoomSelection,}) => {

    const handleClose = () => setIsDatePickerOpen(false);

    const handleDateSelect = (range) => {
        if (!range) return;
        setRoomSelection((prev) => ({
            ...prev,
            start_date: range.from ? moment(range.from).format("YYYY-MM-DD") : null,
            end_date: range.to ? moment(range.to).format("YYYY-MM-DD") : null,
        }));
    };

    const formatSelectedDate = () => {
        if (roomSelection.start_date && roomSelection.end_date) {
            return `${moment(roomSelection.start_date).format("MMM D")} - ${moment(
                roomSelection.end_date
            ).format("MMM D, YYYY")}`;
        } else if (roomSelection.start_date) {
            return moment(roomSelection.start_date).format("MMM D, YYYY");
        }
        return "Select dates";
    };

    return (
        <AnimatePresence>
            {isDatePickerOpen && checkAvailableDate.length > 0 && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-2  border-gray-100">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Select Dates
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Choose your available dates
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close date picker"
                                >
                                    <Icon
                                        icon="heroicons-outline:x"
                                        className="w-5 h-5 text-gray-500"
                                    />
                                </button>
                            </div>

                            <div className="px-6 pt-2">
                                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                                    <Icon
                                        icon="heroicons-outline:calendar"
                                        className="w-5 h-5 text-blue-600 mr-2"
                                    />
                                    <span className="text-blue-700 font-medium text-sm">
                                        {formatSelectedDate()}
                                    </span>
                                </div>
                            </div>


                            <div className="px-6 py-4">
                                <DayPicker
                                    mode="range"
                                    selected={{
                                        from: roomSelection.start_date
                                            ? new Date(roomSelection.start_date)
                                            : undefined,
                                        to: roomSelection.end_date
                                            ? new Date(roomSelection.end_date)
                                            : undefined,
                                    }}
                                    onSelect={handleDateSelect}
                                    modifiers={{
                                        available: checkAvailableDate,
                                    }}
                                    modifiersStyles={{
                                        available: {
                                            backgroundColor: "#D1FAE5",
                                            color: "#065F46",
                                            fontWeight: "500",
                                        },
                                    }}
                                    disabled={(day) =>
                                        !checkAvailableDate.some(
                                            (d) =>
                                                d.getDate() === day.getDate() &&
                                                d.getMonth() === day.getMonth() &&
                                                d.getFullYear() === day.getFullYear()
                                        )
                                    }
                                    className="border-0"
                                    styles={{
                                        caption: { color: "#111827", fontWeight: "600" },
                                        day: { borderRadius: "8px", margin: "2px" },
                                        table: { width: "100%" },
                                    }}
                                />
                            </div>
                            <div className="flex justify-end px-6 py-2 border-gray-100 gap-3">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    disabled={!roomSelection.start_date || !roomSelection.end_date}
                                >
                                    Apply Dates
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DatePickerModal;
