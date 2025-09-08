import {useMemo, useState} from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import moment from "moment";
import {useFetchAvailableRoomsQuery} from "../../../store/slices/management/managementApi.jsx";
import DatePickerModal from "../../../components/model/DatePickerModal.jsx";

const RoomBooking = ({roomSelection, setRoomSelection, branch_id}) => {
    const [checkAvailableDate, setCheckAvailableDate] = useState([])
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const { data: fetchRoomByBranch } = useFetchAvailableRoomsQuery(
        {
            branch_id,
            fromDate: roomSelection.start_date ||  moment().format('YYYY-MM-DD'),
            toDate: roomSelection.end_date || moment().add(1, 'months').format('YYYY-MM-DD'),
        },
        { skip: !branch_id, roomSelection }
    );

    const roomTypes = useMemo(() => fetchRoomByBranch?.data || [], [fetchRoomByBranch]);

    const handleRoomSelection = (roomId, quantity = 1) => {
        const room = roomTypes.find(r => r.id === roomId);
        if (!room) return;

        // roomAvailabilityCalendar(room.available_dates || []);

        setRoomSelection(prev => {
            const existingIndex = prev.rooms.findIndex(r => r.room_id === roomId);
            let newRooms = [...prev.rooms];

            const rate = prev.booking_type === 'monthly' ? room.monthly_cost : room.hourly_cost;

            if (existingIndex >= 0) {
                if (quantity === 0) {
                    newRooms.splice(existingIndex, 1);
                } else {
                    newRooms[existingIndex] = {
                        ...newRooms[existingIndex],
                        quantity_booked: quantity,
                        rate
                    };
                }
            } else if (quantity > 0) {
                newRooms.push({
                    room_id: room.id,
                    room_name: room.room_name,
                    room_type: room.room_type,
                    quantity_booked: quantity,
                    rate,
                    discount_applied: 0,
                    hsn: 998313,
                    auto_priced: true,
                    allocation_type: room.allocation_type === 'seater' ? 'partial_seats' : 'full_room'
                });
            }

            return { ...prev, rooms: newRooms };
        });
    };

    const calculateTotal = () => {
        let total = 0;
        roomSelection.rooms.forEach(room => {
            const roomDetails = roomTypes.find(r => r.id === room.room_id);

            if (roomDetails) {
                const rate = roomSelection.booking_type === 'monthly'
                    ? parseFloat(roomDetails.monthly_cost)
                    : parseFloat(roomDetails.hourly_cost);
                total += rate * room.quantity_booked;
            }
        });
        return total;
    };

    const filterRoomTypes = useMemo(() => {
        if (roomSelection.room_type === 'all') {
            return roomTypes;
        }
        return roomTypes.filter(room => room.room_type === roomSelection.room_type);
    }, [roomTypes, roomSelection.room_type]);


    const roomAvailabilityCalendar = (available_dates=[]) => {

        const allowedDays = available_dates.flatMap(range => {
            const start = moment(range.start);
            const end = moment(range.end);
            const days = [];
            while (start.isSameOrBefore(end, "day")) {
                days.push(start.toDate());
                start.add(1, "day");
            }
            return days;
        });
        setIsDatePickerOpen(!isDatePickerOpen)
        setCheckAvailableDate(allowedDays)

    }

    return (
        <div className='relative'>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Workspace Reservation</h2>
            </div>

            {/* Booking Configuration Section */}
            <div className=" p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
                        <select
                            value={roomSelection.booking_type}
                            onChange={(e) => setRoomSelection(prev => ({ ...prev, booking_type: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md transition-colors"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="hourly">Hourly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={roomSelection.start_date || moment().format('YYYY-MM-DD')}
                            onChange={(e) => setRoomSelection(prev => ({ ...prev, start_date: e.target.value }))}
                            min={moment().format('YYYY-MM-DD')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={roomSelection.end_date || moment().add(1, 'months').format('YYYY-MM-DD')}
                            onChange={(e) => setRoomSelection(prev => ({ ...prev, end_date: e.target.value }))}
                            min={roomSelection.start_date || moment().format('YYYY-MM-DD')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                        <select
                            value={roomSelection.room_type}
                            onChange={(e) => setRoomSelection(prev => ({ ...prev, room_type: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md transition-colors"
                        >
                            <option value="all">All</option>
                            <option value="seater">Seater</option>
                            <option value="meeting">Meeting</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Available Workspaces Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Available Workspaces</h3>
                    <span className="text-sm text-gray-500">
                        {roomTypes.length} option{roomTypes.length !== 1 ? 's' : ''} available
                      </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterRoomTypes.map(room => {
                        const isSelected = roomSelection.rooms.find(r => r.room_id === room.id);
                        const quantityBooked = isSelected ? isSelected.quantity_booked : 0;

                        return (
                            <div
                                key={room.id}
                                className={`border rounded-lg p-4 transition-all ${
                                    isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{room.room_name}</h4>
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800 capitalize">
                                                {room.room_type}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            {room.seater_capacity > 0 && (
                                                <div className="flex items-center">
                                                    {/*<Users className="h-4 w-4 mr-1" />*/}
                                                    <span>Capacity: {room.seater_capacity} people</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium text-indigo-700">
                                                  ₹{roomSelection.booking_type === 'monthly' ? room.monthly_cost : room.hourly_cost}
                                                </span>
                                                <span className="text-gray-500">/{roomSelection.booking_type === 'monthly' ? 'month' : 'hour'}</span>
                                            </div>
                                            {room.available_quantity !== undefined && (
                                                <p className={`text-xs ${room.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {room.available_quantity > 0
                                                        ? `${room.available_quantity} available`
                                                        : 'Fully booked'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <div className="ml-4 flex flex-col items-end">
                                            {room.room_type === 'seater' ? (
                                                <input
                                                    type="text"
                                                    value={quantityBooked || ''}
                                                    onChange={(e) => handleRoomSelection(room.id, parseInt(e.target.value))}
                                                    disabled={room.available_quantity === 0}
                                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-12"
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => handleRoomSelection(
                                                        room.id,
                                                        isSelected ? 0 : 1
                                                    )}
                                                    disabled={room.available_quantity === 0 && !isSelected}
                                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                        isSelected
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : room.available_quantity === 0
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                                    }`}
                                                >
                                                    {isSelected ? 'Remove' : room.available_quantity === 0 ? 'Unavailable' : 'Select'}
                                                </button>
                                            )}

                                            {quantityBooked > 0 && (
                                                <div className="mt-2 text-xs text-gray-500 text-right">
                                                    {quantityBooked} selected
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => roomAvailabilityCalendar(room.available_dates)} className="cursor-pointer mt-4 text-xs text-indigo-600 hover:underline">
                                            Choose Date
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Booking Summary */}
            {roomSelection.rooms.filter(room => room.quantity_booked > 0).length > 0 && (
                <div className="mt-8 p-6  rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

                    <div className="space-y-3 mb-2">
                        {roomSelection.rooms.filter(room => room.quantity_booked > 0).map(room => {
                            const roomData = roomTypes.find(r => r.id === room.room_id);
                            const rate = roomData ?
                                (roomSelection.booking_type === 'monthly' ? parseFloat(roomData.monthly_cost) : parseFloat(roomData.hourly_cost))
                                : 0;

                            return (
                                <div key={room.room_id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                    <div>
                                        <span className="font-medium text-gray-900">{room.room_name}</span>
                                        <span className="text-gray-500 ml-2">× {room.quantity_booked}</span>
                                    </div>
                                    <div className="text-gray-900 font-medium">
                                        ₹{(rate * room.quantity_booked).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <span className="font-medium text-secondary text-sm">
                            {roomSelection.start_date ? moment(roomSelection.start_date).format("DD MMM YYYY") : "N/A"} -{" "}
                            {roomSelection.end_date ? moment(roomSelection.end_date).format("DD MMM YYYY") : "N/A"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-300 font-semibold text-lg">
                        <span className="text-gray-800">Total Amount</span>
                        <span className="text-indigo-700">₹{calculateTotal().toLocaleString('en-IN') || 0}</span>
                    </div>
                </div>
            )}

            <DatePickerModal
                isDatePickerOpen={isDatePickerOpen}
                setIsDatePickerOpen={setIsDatePickerOpen}
                checkAvailableDate={checkAvailableDate}
                roomSelection={roomSelection}
                setRoomSelection={setRoomSelection}
            />
        </div>
    );
}

export default RoomBooking;