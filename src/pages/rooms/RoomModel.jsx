import {Icon} from "@iconify/react";
import {useAddBranchRoomMutation, useEditBranchRoomMutation} from "../../store/slices/management/managementApi.jsx";
import {useState} from "react";
import {validateRoomForm} from "../../utils/validation.js";

const RoomModel = ({ closeModel, selectedRoom, form, branchID, isEdit, isAdd }) => {
    const [formErrors, setFormErrors] = useState({});
    const [roomForm, setRoomForm] = useState(form);

    const [editBranchRoom, { isLoading: isEditing }] = useEditBranchRoomMutation();
    const [addBranchRoom, { isLoading: isAdding }] = useAddBranchRoomMutation();

    const handleChange = ({target: {name, value}}) => {
        setRoomForm({
            ...roomForm,
            [name]: value
        });

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    const resetForm = () => {
        setRoomForm({
            room_name: "",
            room_type: "seater",
            seater_capacity: "",
            quantity: "",
            monthly_cost: "",
            hourly_cost: "",
            default_discount: "",
        });
        setFormErrors({});
    };

    const handleAddRoom = async () => {
        if (!validateRoomForm(roomForm, setFormErrors)) return;

        try {
            const payload = { branch_id: branchID, rooms: [roomForm] };
            await addBranchRoom(payload).unwrap();
            resetForm();
            closeModel();
        } catch (err) {
            console.error("Failed to add room:", err);
        }
    };

    const handleEditRoom = async () => {
        if (!validateRoomForm(roomForm, setFormErrors)) return;
        try {
            await editBranchRoom({
                id: selectedRoom.id,
                data: { ...roomForm }
            }).unwrap();
            resetForm();
            closeModel();
        } catch (err) {
            console.error("Failed to edit room:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Room - {selectedRoom?.room_name}</h2>
                    <button
                        onClick={closeModel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <Icon icon="mdi:close" className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Name
                            </label>
                            <input
                                type="text"
                                name='room_name'
                                value={roomForm.room_name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${formErrors.room_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.room_name && <p className="mt-1 text-sm text-red-600">{formErrors.room_name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Type
                            </label>
                            <select
                                name='room_type'
                                value={roomForm.room_type}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg  transition ${formErrors.room_type ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="seater">Seater</option>
                                <option value="meeting">Meeting Room</option>
                            </select>
                            {formErrors.room_type && <p className="mt-1 text-sm text-red-600">{formErrors.room_type}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Seater Capacity
                            </label>
                            <input
                                name='seater_capacity'
                                type="number"
                                min="1"
                                value={roomForm.seater_capacity}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg transition ${formErrors.seater_capacity ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.seater_capacity && <p className="mt-1 text-sm text-red-600">{formErrors.seater_capacity}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                name='quantity'
                                value={roomForm.quantity}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg transition ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.quantity && <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monthly Cost (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name='monthly_cost'
                                value={roomForm.monthly_cost}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${formErrors.monthly_cost ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.monthly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.monthly_cost}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hourly Cost (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name='hourly_cost'
                                value={roomForm.hourly_cost}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg  outline-none transition ${formErrors.hourly_cost ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.hourly_cost && <p className="mt-1 text-sm text-red-600">{formErrors.hourly_cost}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Discount (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                name='default_discount'
                                value={roomForm.default_discount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={closeModel}
                        className="px-4 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={isAdd ? handleAddRoom : handleEditRoom}
                        disabled={isEditing}
                        className="px-4 py-2 text-sm bg-secondary text-white font-medium rounded-lg cursor-pointer hover:bg-primary focus:outline-none  disabled:opacity-50 transition-colors"
                    >
                        {
                            isEdit ? "Edit Room" : "Add Room"
                        }

                        {isEditing || isAdding && (
                            <span className="flex items-center">
                                <Icon icon="mdi:loading" className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                Loading...
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomModel