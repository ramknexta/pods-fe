const Review = ({formData}) => {
    return (
        <>
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Review Information</h3>
                <p className="text-gray-500 mb-6">Please review all details before submitting</p>

                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">Company Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Company Name</p>
                                <p className="font-medium">{formData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{formData.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="font-medium">{formData.country}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tax ID</p>
                                <p className="font-medium">{formData.gstin}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">Contact Person</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{formData.first_name} {formData.middle_name} {formData.last_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Contact Email</p>
                                <p className="font-medium">{formData.contact_email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Mobile</p>
                                <p className="font-medium">{formData.mobile}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">Business Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{formData.addr1} {formData.addr2}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{formData.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">State</p>
                                <p className="font-medium">{formData.state}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pincode</p>
                                <p className="font-medium">{formData.pincode}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Branch ID</p>
                                <p className="font-medium">{formData.branch_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">E-Invoicing</p>
                                <p className="font-medium">{formData.e_invoicing ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </div>
                    </div>

                    {formData.room_booking && (
                        <div>
                            <h4 className="font-medium text-gray-800 mb-3 border-b pb-2">Room Booking</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Booking Type</p>
                                    <p className="font-medium capitalize">{formData.room_booking.booking_type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Start Date</p>
                                    <p className="font-medium">{formData.room_booking.start_date}</p>
                                </div>
                                {formData.room_booking.end_date && (
                                    <div>
                                        <p className="text-sm text-gray-500">End Date</p>
                                        <p className="font-medium">{formData.room_booking.end_date}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-medium">₹{formData.room_booking.total_amount.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-500 mb-2">Rooms Booked</p>
                                <ul className="list-disc list-inside">
                                    {formData.room_booking.rooms.map(room => (
                                        <li key={room.room_id} className="text-sm">
                                            {room.room_name} × {room.quantity_booked} (₹{room.rate * room.quantity_booked})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Review