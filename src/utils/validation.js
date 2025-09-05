export const validateRoomForm = (roomForm, setFormErrors) => {
    const errors = {};
    if (!roomForm.room_name.trim()) errors.room_name = "Room name is required";
    if (!roomForm.seater_capacity || roomForm.seater_capacity <= 0)
        errors.seater_capacity = "Valid capacity is required";
    if (!roomForm.quantity || roomForm.quantity <= 0)
        errors.quantity = "Valid quantity is required";
    if (!roomForm.monthly_cost || roomForm.monthly_cost < 0)
        errors.monthly_cost = "Valid monthly cost is required";
    if (!roomForm.hourly_cost || roomForm.hourly_cost < 0)
        errors.hourly_cost = "Valid hourly cost is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};