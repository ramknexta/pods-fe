import Admin from "../../layout/Admin.jsx";
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";
import gsap from "gsap";
import {motion} from "framer-motion";

const Settings = () => {
    const textRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(handleTitleChange("Settings"));
    }, []);

    useEffect(() => {
        gsap.fromTo(
            textRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );
    }, []);

    return (
        <Admin>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-secondary animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                        />
                    </svg>
                </motion.div>

                <motion.h1
                    ref={textRef}
                    className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
                >
                    Work In Progress 🚧
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-lg text-gray-600 max-w-lg"
                >
                    Our Settings page is under development. We’re working hard to bring you
                    the best experience soon. Stay tuned!
                </motion.p>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
                    className="h-2 bg-gradient-to-r from-neutral-300 to-stone-400 rounded-full mt-8 shadow-lg"
                ></motion.div>
            </div>
        </Admin>
    );
}

export default Settings