import Customer from "../../../layout/Customer.jsx";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import WorkSpace from "./WorkSpace.jsx";
import Schedule from "./Schedule.jsx";
import Review from "./Review.jsx";
import {useSelector} from "react-redux";
import {useFetchAvailableRoomsQuery} from "../../../store/slices/management/managementApi.jsx";
import moment from "moment";
import {useBookRoomMutation} from "../../../store/slices/customer/customerApi.js";
import toast from "react-hot-toast";

const steps = ["Workspace", "Schedule", "Review", "Success"];
const header = [
    {
        title: "Choose Your Workspace",
        desc: "Tap on an available pod to select it. Booked pods are shown in red."
    },
    {
        title: "Schedule Your Time",
        desc: "Pick your preferred date, duration, and time slot."
    },
    {
        title: "Review & Pay",
        desc: "Confirm your booking details and complete payment securely."
    },
    {
        title: "Payment Successful!",
        desc: "Your workspace is ready for you"
    },
]

const CustomerPod = () => {
    const { customer_id, branch_id, customer_branch_id } = useSelector(state => state.auth)

    const [pods, setPods] = useState([]);
    const [selectedPod, setSelectedPod] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState({
        room_type: 'all',
        booking_type: 'monthly',
        start_date: '',
        end_date: '',
        rooms: []
    });
    const [step, setStep] = useState(0);

    const {data: availableRooms, refetch} = useFetchAvailableRoomsQuery(
        {
            branch_id,
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().add(1, 'months').format('YYYY-MM-DD')
        },
        {skip: !branch_id}
    )

    const [bookRoom, {isLoading: isBooking}] = useBookRoomMutation();

    useEffect(() => {
        if (availableRooms?.data){
            setPods(availableRooms.data || [])
        }
    },[availableRooms])



    const handlePodSelect = useCallback(pod => {
        if (selectedPod?.id === pod.id) {
            setSelectedPod(null);
            return;
        }
        setSelectedPod(pod);
    },[selectedPod])

    const handleSlotSelect = useCallback(slot => {
        setSelectedSlot(slot);
    },[selectedSlot])




    const handleContinue = async () => {
        if (!selectedPod) return;
        if (step === 2) {
            const payload = {
                customer_id,
                customer_branch_id,
                branch_id,
                start_date: moment(selectedSlot.start_date).format('YYYY-MM-DD'),
                end_date: moment(selectedSlot.end_date).format('YYYY-MM-DD'),
                booking_type: selectedSlot.booking_type,
                selected_rooms: [
                    {
                        room_id: selectedPod.id,
                        room_name: selectedPod.room_name,
                        room_type: selectedPod.room_type,
                        quantity_booked: selectedSlot.quantity_booked,
                        rate: selectedSlot.total_price,
                        default_discount: selectedPod.default_discount,
                        hsn: selectedPod.hsn,
                        auto_priced: true,
                        allocation_type: selectedPod.allocation_type
                    }
                ]
            }
            try {
                const response = await bookRoom(payload).unwrap();
                if (!response.status) {
                    toast.error(response.message || "Booking Failed");
                    return;
                }
                toast.success("Pod booked successfully!");
                refetch();

                setStep(0);
                setSelectedPod(null);
                setSelectedSlot({
                    room_type: 'all',
                    booking_type: 'monthly',
                    start_date: '',
                    end_date: '',
                    rooms: []
                });

            } catch (error) {
                toast.error("Something went wrong while booking");
            }
        } else {
            if (step < steps.length - 1) setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };


    const renderStep = useMemo(() => {
        switch (step) {
            case 0:
                return <WorkSpace pods={pods} selectedPod={selectedPod} handlePodSelect={handlePodSelect} />;
            case 1:
                return <Schedule selectedPod={selectedPod} handleSlotSelect={handleSlotSelect}/>;
            case 2:
                return <Review selectedPod={selectedPod} selectedSlot={selectedSlot} onConfirm={handleContinue} onBack={handleBack} />;
            case 3:
                return <div>Success</div>;
            default:
                return null;
        }
    }, [step, pods, selectedPod, handlePodSelect]);

    return (
        <Customer>
            <section className='p-6 overflow-y-auto h-full'>
                <div className='flex justify-center gap-2 mb-5'>
                    {
                        [1, 2, 3, 4].map((i, index) => (
                            <div key={index} className={`${step === index ? 'w-20': 'w-10'} h-2 bg-gray-500 rounded-xl`}></div>
                        ))
                    }
                </div>

                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{header[step].title}</h1>
                    <p className="text-gray-500 mt-2">
                        {header[step].desc}
                    </p>
                </header>

                {renderStep}


                <div className="flex justify-center gap-8 bottom-4 mt-8">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="border border-gray-400 px-4 py-2 rounded-md"
                        >
                            Back
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button
                            onClick={handleContinue}
                            className="bg-secondary text-sm text-white px-4 py-2 rounded-md"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep(0)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md"
                        >
                            Book Another
                        </button>
                    )}
                </div>

            </section>
        </Customer>
    )
}

export default CustomerPod