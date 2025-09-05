import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {AVAILABILITY_STATUS, POD_STATUS, user} from "../../utils/constants.js";

const statusClasses = {
    [POD_STATUS.ACTIVE]: "bg-green-500 text-white",
    [POD_STATUS.INACTIVE]: "bg-gray-400 text-white",
};

const availabilityClasses = {
    [AVAILABILITY_STATUS.AVAILABLE]: "bg-yellow-500 text-white",
    [AVAILABILITY_STATUS.BOOKED]: "bg-red-500 text-white",
    [AVAILABILITY_STATUS.MAINTENANCE]: "bg-gray-500 text-white",
};
const DEFAULT_POD_IMAGE = "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg";

export const PodCard = React.memo(({ pod, onEdit, onDelete }) => {
    const { role } = useSelector((state) => state.auth);

    const handleEdit = useCallback(() => onEdit(pod), [onEdit, pod]);
    const handleDelete = useCallback(() => onDelete(pod.id), [onDelete, pod.id]);


    const monthlyPrice = pod.monthly_cost ? `${pod.monthly_cost}/month` : "Price not set";
    const hourlyPrice = pod.hourly_cost ? `${pod.hourly_cost}/hr` : "Price not set";
    const defaultTags = pod.room_type ? [pod.room_type] : ["workspace"];

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div className="relative">
                <img
                    src={DEFAULT_POD_IMAGE}
                    alt={`${pod.room_name || "Workspace"} pod`}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge
                        label={pod.status || POD_STATUS.INACTIVE}
                        className={statusClasses[pod.status] || statusClasses[POD_STATUS.INACTIVE]}
                    />
                    <Badge
                        label={pod.availability || AVAILABILITY_STATUS.MAINTENANCE}
                        className={availabilityClasses[pod.availability] || availabilityClasses[AVAILABILITY_STATUS.MAINTENANCE]}
                    />
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{pod.room_name || "Unnamed Pod"}</h3>
                <p className="text-gray-600 font-medium">{monthlyPrice}</p>
                <p className="text-gray-600 font-medium">{hourlyPrice}</p>
                <p className="text-gray-500 text-sm mt-1">Capacity: {pod.seater_capacity || "N/A"}</p>
                <p className="text-gray-500 text-sm mt-1">Unit: {pod.quantity || 0}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                    {defaultTags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                    {
                        role === user.CUSTOMER ? (
                            <button
                                onClick={handleEdit}
                                className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                                aria-label={`Select ${pod.room_name || "pod"}`}
                            >
                                Select
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="bg-secondary hover:bg-primary  text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                                    aria-label={`Edit ${pod.room_name || "pod"}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                                    aria-label={`Delete ${pod.room_name || "pod"}`}
                                >
                                    ✕
                                </button>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
});

const Badge = ({ label, className = "" }) => (
    <span
        className={`px-2 py-1 text-xs rounded font-medium ${className}`}
        aria-label={label}
    >
        {label}
    </span>
);

const TagChip = ({ label }) => (
    <span
        className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700"
        aria-label={`Feature: ${label}`}
    >
        {label}
    </span>
);