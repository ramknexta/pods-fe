import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {useRef} from "react";

const Review = ({ formData }) => {
    const containerRef = useRef();

    useGSAP(() => {
        // Animate sections to slide in from the right with staggered timing
        gsap.fromTo(".review-section",
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
        );

        // Animate data fields with a subtle fade-in effect
        gsap.fromTo(".data-field",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.3 }
        );
    }, { scope: containerRef });

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className=" p-6"
            ref={containerRef}
        >
            <motion.h3
                className="text-2xl font-bold text-gray-800 mb-3 pb-2"
                variants={itemVariants}
            >
                Review Information
            </motion.h3>

            <div className="bg-white rounded-xl overflow-hidden">
                {/* Company Information Section */}
                <motion.div
                    className="review-section p-6 border-b border-gray-100"
                    variants={itemVariants}
                >
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-5 bg-secondary rounded-full mr-3"></div>
                        <h4 className="font-semibold text-gray-800 text-lg">Company Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5">
                        {[
                            { label: "Company Name", value: formData.name },
                            { label: "Email", value: formData.email },
                            { label: "Country", value: formData.country },
                            { label: "Tax ID", value: formData.gstin }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="data-field p-3 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                                <p className="font-medium text-gray-800">{item.value || "-"}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Person Section */}
                <motion.div
                    className="review-section p-6 border-b border-gray-100"
                    variants={itemVariants}
                >
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-5 bg-secondary rounded-full mr-3"></div>
                        <h4 className="font-semibold text-gray-800 text-lg">Contact Person</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5">
                        {[
                            {
                                label: "Name",
                                value: `${formData.first_name || ""} ${formData.middle_name || ""} ${formData.last_name || ""}`.trim()
                            },
                            { label: "Contact Email", value: formData.contact_email },
                            { label: "Mobile", value: formData.mobile }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="data-field p-3 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                                <p className="font-medium text-gray-800">{item.value || "-"}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Business Details Section */}
                <motion.div
                    className="review-section p-6 border-b border-gray-100"
                    variants={itemVariants}
                >
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-5 rounded-full mr-3"></div>
                        <h4 className="font-semibold text-gray-800 text-lg">Business Details</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5">
                        {[
                            { label: "Address", value: `${formData.addr1 || ""} ${formData.addr2 || ""}`.trim() },
                            { label: "Location", value: formData.location },
                            { label: "State", value: formData.state },
                            { label: "Pincode", value: formData.pincode },
                            { label: "Branch ID", value: formData.branch_id },
                            { label: "E-Invoicing", value: formData.e_invoicing ? 'Enabled' : 'Disabled' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="data-field p-3 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                                <p className="font-medium text-gray-800">{item.value || "-"}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {formData.room_booking && (
                    <motion.div
                        className="review-section p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-5 bg-secondary rounded-full mr-3"></div>
                            <h4 className="font-semibold text-gray-800 text-lg">Room Booking</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5 mb-4">
                            {[
                                { label: "Booking Type", value: formData.room_booking.booking_type ? formData.room_booking.booking_type.charAt(0).toUpperCase() + formData.room_booking.booking_type.slice(1) : "" },
                                { label: "Start Date", value: formData.room_booking.start_date },
                                ...(formData.room_booking.end_date ? [{ label: "End Date", value: formData.room_booking.end_date }] : []),
                                {
                                    label: "Total Amount",
                                    value: formData.room_booking.total_amount ? `₹${formData.room_booking.total_amount.toLocaleString()}` : ""
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="data-field p-3 rounded-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className="font-medium text-gray-800">{item.value || "-"}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="ml-5 mt-4">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-2">Rooms Booked</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.room_booking.rooms.map((room, index) => (
                                    <motion.div
                                        key={index}
                                        className="data-field bg-blue-50 p-3 rounded-lg border border-blue-100"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                                        whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
                                    >
                                        <p className="font-medium text-gray-800">{room.room_name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {room.quantity_booked}</p>
                                        <p className="text-sm text-gray-600">Rate: ₹{room.rate.toLocaleString()}</p>
                                        <p className="text-sm font-medium text-blue-700 mt-1">
                                            Total: ₹{(room.rate * room.quantity_booked).toLocaleString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Review;