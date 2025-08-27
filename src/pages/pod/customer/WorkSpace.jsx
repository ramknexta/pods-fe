import {PodCard} from "../../../components/Card/PodCard.jsx";
import {Icon} from "@iconify/react";
import React, {useState} from "react";
import {AVAILABILITY_STATUS, POD_STATUS} from "../../../utils/constants.js";

const initialPods = [
    {
        id: 1,
        name: "Solo Room",
        price: "₹200/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "0/1",
        tags: ["WiFi", "Water", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 2,
        name: "Trio Room",
        price: "₹100/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "3/3",
        tags: ["WiFi", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 3,
        name: "Quad Room",
        price: "₹400/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.BOOKED,
        capacity: "0/4",
        tags: ["WiFi", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 4,
        name: "Hive Room",
        price: "₹600/hr",
        status: POD_STATUS.ACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "5/5",
        tags: ["WiFi", "Water", "Table"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 5,
        name: "Deck Room",
        price: "₹1000/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.AVAILABLE,
        capacity: "0/12",
        tags: ["WiFi", "Table", "A/C"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
    {
        id: 6,
        name: "Core Room",
        price: "₹800/hr",
        status: POD_STATUS.INACTIVE,
        availability: AVAILABILITY_STATUS.MAINTENANCE,
        capacity: "0/6",
        tags: ["WiFi", "Projector", "Whiteboard"],
        image: "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
    },
];

const WorkSpace = () => {
    const [pods, setPods] = useState(initialPods);
    return (
        <div className="w-3/4 mx-auto h-100">
            {pods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-h-full overflow-y-auto p-2">
                    {pods.map((pod) => (
                        <PodCard
                            key={pod.id}
                            pod={pod}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon icon="uil:package" className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No pods found</h3>
                    <p className="mt-2 text-gray-500">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}
        </div>
    )
}

export default WorkSpace