import Customer from "../../../layout/Customer.jsx";
import React, {useMemo, useState} from "react";
import WorkSpace from "./WorkSpace.jsx";
import Schedule from "./Schedule.jsx";
import Review from "./Review.jsx";

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
    const [step, setStep] = useState(0);

    const handleContinue = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const renderStep = useMemo(() => {
        switch (step) {
            case 0:
                return <WorkSpace />;
            case 1:
                return <Schedule />;
            case 2:
                return <Review />;
            case 3:
                return <div>Success</div>;
            default:
                return null;
        }
    }, [step]);

    return (
        <Customer>
            <section className='p-6'>
                <div className='flex justify-center gap-2 mb-5 '>
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

                {
                   renderStep
                }

                <div className="flex justify-center bottom-4 mt-8">
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
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