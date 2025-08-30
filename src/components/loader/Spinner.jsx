import {AnimatePresence, motion} from "framer-motion";

const Spinner = () => {

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mb-6"
                    />
                    <p className="text-gray-700 font-medium">Loading workflows...</p>
                    <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your data</p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default Spinner;
