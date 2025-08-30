import {useCallback, useEffect, useMemo, useState} from 'react';
import { Icon } from '@iconify/react';
import Admin from "../../../layout/Admin.jsx";
import {useFetchDashboardDataQuery, useFetchRoomByBranchIdQuery} from "../../../store/slices/management/managementApi.jsx";
import {useOnboardCustomerMutation} from "../../../store/slices/onboard/onboardApi.js";
import Contact from "./Contact.jsx";
import BusinessDetails from "./BusinessDetails.jsx";
import RoomBooking from "./RoomBooking.jsx";
import Review from "./Review.jsx";
import Company from "./Company.jsx";
import {useDispatch} from "react-redux";
import {handleTitleChange} from "../../../store/slices/auth/authSlice.js";
import {useNavigate} from "react-router-dom";
import WorkflowPreviewModel from "../../workflow/PreviewModel.jsx";
import EmailTemplateModel from "../../workflow/EmailTemplateModel.jsx";
import WhatsappTemplateModel from "../../workflow/WhatsappTemplateModel.jsx";
import toast from "react-hot-toast";

const STEP_CONFIG = [
    { id: 1, title: 'Company Details', desc: 'Basic details about your company', icon: 'mdi:office-building' },
    { id: 2, title: 'Contact Details', desc: 'Primary contact information', icon: 'mdi:account' },
    { id: 3, title: 'Business Details', desc: 'Basic details about your company', icon: 'mdi:file-document' },
    { id: 4, title: 'Room Booking', desc: 'Select and customize your workspace options', icon: 'mdi:desk' },
    { id: 5, title: 'Review', desc: 'Please review all details before submitting', icon: 'mdi:check-circle' }
];

const initialFormData = {
    name: '',
    email: '',
    website: '',
    wiki: '',
    logo: '',
    addr1: '',
    addr2: '',
    duns: '',
    gstin: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    contact_email: '',
    mobile: '',
    gst_typ: 'cgst/sgst',
    mgmt_id: '',
    branch_id: '',
    location: '',
    state: '',
    pincode: '',
    country: 'India',
    e_invoicing: false,
    workflow: false,
    is_invoice: false,
    workflow_name: 'default',
    description: '',
    action: {
        email: false,
        whatsapp: false,
    },
    before: {
        days: 0,
        remainder: 0,
        frequency: 0,
    },
    after: {
        days: 0,
        remainder: 0,
        frequency: 0,
    },
    room_booking: null
};

const CustomerOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});
    const [roomSelection, setRoomSelection] = useState({
        room_type: 'all',
        booking_type: 'monthly',
        start_date: '',
        end_date: '',
        rooms: []
    });
    const [defaultModelOpen, setDefaultModelOpen] = useState(false);
    const [emailModelOpen, setEmailModelOpen] = useState(false);
    const [whatsappModelOpen, setWhatsappModelOpen] = useState(false);
    const [emailTemplateId, setEmailTemplateId] = useState({
        before: [],
        after: [],
    });
    const [whatsappTemplateId, setWhatsappTemplateId] = useState({
        before: [],
        after: [],
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(handleTitleChange("Onboard Customer"));
    },[])

    const [onboardCustomer, { isLoading: isSubmitting }] = useOnboardCustomerMutation();
    const { data: managementData } = useFetchDashboardDataQuery();

    const { branches = [] } = managementData || {};

    const { data: fetchRoomByBranch } = useFetchRoomByBranchIdQuery(
        formData.branch_id,
        { skip: !formData.branch_id }
    );

    const roomTypes = useMemo(() => fetchRoomByBranch?.data || [], [fetchRoomByBranch]);

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.name) newErrors.name = 'Company name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

            // GST validation based on country
            if (formData.country === 'India' && !formData.gstin) {
                newErrors.gstin = 'GSTIN is required for India';
            } else if (formData.country === 'India' && formData.gstin) {
                const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
                if (!gstRegex.test(formData.gstin)) newErrors.gstin = 'Invalid GSTIN format';
            }
        }

        if (step === 2) {
            if (!formData.first_name) newErrors.first_name = 'First name is required';
            if (!formData.last_name) newErrors.last_name = 'Last name is required';
            if (!formData.contact_email) newErrors.contact_email = 'Contact email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) newErrors.contact_email = 'Contact email is invalid';
            if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
        }

        if (step === 3) {
            if (!formData.addr1) newErrors.addr1 = 'Address is required';
            if (!formData.location) newErrors.location = 'Location is required';
            if (!formData.state) newErrors.state = 'State is required';
            if (!formData.pincode) newErrors.pincode = 'Pincode is required';
            if (!formData.country) newErrors.country = 'Country is required';
            if (!formData.branch_id) newErrors.branch_id = 'Branch ID is required';

            if (!formData.workflow) {
                if (!formData.workflow_name) newErrors.workflow_name = 'Workflow name is required';
                if (!formData.description) newErrors.description = 'Description is required';
                if (!formData.action.email && !formData.action.whatsapp) newErrors.action = 'At least one action is required';
                if (!formData.before.days && !formData.before.remainder) newErrors.before = 'At least one before event is required';
                if (!formData.after.days && !formData.after.remainder) newErrors.after = 'At least one after event is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            setFormData(prev => {
                const updatedFormData = {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? checked : value
                    }
                };

                // Auto-calculate frequency when days or remainder changes in before/after
                if (parent === 'before' && (child === 'days' || child === 'remainder')) {
                    const period = updatedFormData[parent];
                    const days = parseInt(period.days) || 0;
                    const remainder = parseInt(period.remainder) || 1;

                    if (remainder > 0) {
                        const frequency = Math.floor(days / remainder);
                        updatedFormData[parent] = {
                            ...period,
                            frequency: frequency > 0 ? frequency : 0
                        };
                    }
                } else if (parent === 'action' && (child === 'email' || child === 'whatsapp')) {
                    updatedFormData[parent] = {
                        ...updatedFormData[parent],
                        [child]: type === 'checkbox' ? checked : value
                    };
                }

                return updatedFormData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRoomSelection = (roomId, quantity = 1) => {
        const room = roomTypes.find(r => r.id === roomId);
        if (!room) return;

        setRoomSelection(prev => {
            const existingIndex = prev.rooms.findIndex(r => r.room_id === roomId);
            let newRooms = [...prev.rooms];

            const rate = prev.booking_type === 'monthly' ? room.monthly_cost : room.hourly_cost;

            if (existingIndex >= 0) {
                if (quantity === 0) {
                    newRooms.splice(existingIndex, 1); // remove
                } else {
                    newRooms[existingIndex] = {
                        ...newRooms[existingIndex],
                        quantity_booked: quantity,
                        rate
                    };
                }
            } else if (quantity > 0) {
                newRooms.push({
                    room_id: room.id,
                    room_name: room.room_name,
                    room_type: room.room_type,
                    quantity_booked: quantity,
                    rate,
                    discount_applied: 0,
                    hsn: 998313,
                    auto_priced: true,
                    allocation_type: room.allocation_type === 'seater' ? 'partial_seats' : 'full_room'
                });
            }

            return { ...prev, rooms: newRooms };
        });
    };

    const calculateTotal = useMemo(() => {
        return roomSelection.rooms.reduce((total, room) => {
            const roomDetails = roomTypes.find(r => r.id === room.room_id);
            if (!roomDetails) return total;

            const rate = roomSelection.booking_type === 'monthly'
                ? parseFloat(roomDetails.monthly_cost)
                : parseFloat(roomDetails.hourly_cost);

            return total + (rate * room.quantity_booked);
        }, 0);
    }, [roomSelection, roomTypes]);

    const handleNext = useCallback(() => {
        if (validateStep(currentStep)) {
            if (currentStep === 4) {
                setFormData(prev => ({
                    ...prev,
                    room_booking: {
                        booking_type: roomSelection.booking_type,
                        start_date: roomSelection.start_date,
                        end_date: roomSelection.end_date,
                        total_amount: calculateTotal,
                        rooms: roomSelection.rooms
                    }
                }));
            }
            setCurrentStep(currentStep + 1);
        }
    },[currentStep, formData, roomSelection, calculateTotal]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const handleBack = () =>  navigate(-1)


    const handleDefaultModel = () => {
        if (!formData.workflow) {
            setEmailTemplateId(prev => ({
                ...prev,
                before: [],
                after: []
            }))
            setWhatsappTemplateId(prev => ({
                ...prev,
                before: [],
                after: []
            }))
        }
        setDefaultModelOpen(!defaultModelOpen)
        setDefaultModelOpen(!defaultModelOpen)
    };
    const handleEmailModel = () => {
        setEmailModelOpen(!emailModelOpen);
    }
    const handleWhatsappModel = () => {
        setWhatsappModelOpen(!whatsappModelOpen)
    };



    const handleEmailTemplateIdChange = (id, type) => {
        if (type === 'before') {
            setEmailTemplateId(prev => ({
                ...prev,
                before: id
            }))
        } else {
            setEmailTemplateId(prev => ({
                ...prev,
                after: id
            }))
        }
    }

    const handleWhatsappTemplateIdChange = (id, type) => {
        if (type === 'before') {
            setWhatsappTemplateId(prev => ({
                ...prev,
                before: id
            }))
        } else {
            setWhatsappTemplateId(prev => ({
                ...prev,
                after: id
            }))
        }
    }

    const handleSubmit = useCallback(async () => {
        try {
            const rulePayload = {
                rule: {
                    description: formData.description,
                    event_name:"xDaysFromInvoiceDueDate",
                    event_data: {
                        before: {
                            days: formData.before.days || 0,
                            remainder: formData.before.remainder || 0,
                            frequency: formData.before.frequency || 0,
                            description: `${formData.before.days || 0 } days, ${formData.before.frequency || 0} frequency and ${formData.before.remainder || 0} remainder`,
                        },
                        after: {
                            days: formData.after.days || 0,
                            remainder: formData.after.remainder || 0,
                            frequency: formData.after.frequency || 0,
                            description: `${formData.after.days || 0} days, ${formData.after.frequency || 0} frequency and ${formData.after.remainder || 0} remainder`,
                        },
                    },
                    workflow_id: 0,
                },
                actions: []
            }

            if (formData.workflow) {
                rulePayload.actions.push({
                    action_type: "email",
                    action_data: {
                        to: "Primary Contact",
                        before_template_id: emailTemplateId.before,
                        after_template_id:  emailTemplateId.after
                    },
                });
                rulePayload.actions.push({
                    action_type: "whatsapp",
                    action_data: {
                        to: "Primary Contact",
                        before_template_id: whatsappTemplateId.before,
                        after_template_id:  whatsappTemplateId.after,
                    },
                });
            }

            if (formData.action.email) {
                rulePayload.actions.push({
                    action_type: "email",
                    action_data: {
                        to: "Primary Contact",
                        before_template_id: emailTemplateId.before,
                        after_template_id:  emailTemplateId.after
                    },
                });
            }

            if (formData.action.whatsapp) {
                rulePayload.actions.push({
                    action_type: "whatsapp",
                    action_data: {
                        to: "Primary Contact",
                        before_template_id: whatsappTemplateId.before,
                        after_template_id:  whatsappTemplateId.after,
                    },
                });
            }

            const { after, before, description, action, ...rest } = formData;

            const customerPayload = {
                ...rest,
                mgmt_id: branches[0]?.mgmt_id || ''
            }

            const payload = {
                customer: [customerPayload],
                rule: rulePayload,
                invoice: false
            };

            await onboardCustomer(payload).unwrap();
            toast.success('Customer onboarded successfully.');
            navigate('/dashboard')

        } catch (error) {
            console.error('Onboarding failed:', error);
        }
    }, [formData, branches, onboardCustomer]);

    const renderStepContent = useCallback(() => {
        const stepProps = {
            formData,
            handleInputChange,
            errors,
            branches
        };

        switch (currentStep) {
            case 1:
                return <Company {...stepProps} />;
            case 2:
                return <Contact {...stepProps} />;
            case 3:
                return <BusinessDetails
                    {...stepProps}
                    defaultModelhandler={handleDefaultModel}
                    emailModelhandler={handleEmailModel}
                    whatsappModelhandler={handleWhatsappModel}
                    />;
            case 4:
                return (
                    <RoomBooking
                        {...stepProps}
                        roomTypes={roomTypes}
                        roomSelection={roomSelection}
                        setRoomSelection={setRoomSelection}
                        handleRoomSelection={handleRoomSelection}
                        totalAmount={calculateTotal}
                    />
                );
            case 5:
                return <Review formData={formData} />;
            default:
                return null;
        }
    }, [currentStep, formData, handleInputChange, errors, branches, roomTypes, roomSelection, handleRoomSelection, calculateTotal]);

    return (
        <Admin>
            <section className={`max-w-5xl mx-auto p-4 sm:p-6 lg:p-8`}>

            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-center gap-2">
                    {STEP_CONFIG.map((step, index) => (
                        <div key={step.id} className="flex items-center justify-center">
                            {index < STEP_CONFIG.length - 1 && (
                                <div className={`h-1.25 rounded-lg w-20 ${
                                    currentStep > step.id ? 'bg-secondary w-35' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-center text-sm text-gray-500">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{STEP_CONFIG[currentStep-1].title}</h3>
                    <p className="text-gray-500 mb-6">{STEP_CONFIG[currentStep-1].desc}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-h-100 overflow-y-auto">
                {renderStepContent()}
            </div>

            <div>
                {defaultModelOpen && (
                    <WorkflowPreviewModel
                        branch_id={formData.branch_id}
                        isDefault={formData.workflow}
                        onClose={handleDefaultModel}
                        setEmailTemplateId={setEmailTemplateId}
                        setWhatsappTemplateId={setWhatsappTemplateId}
                        setFormDataHandler={setFormData}
                    />
                )}
                {emailModelOpen && (
                    <EmailTemplateModel
                        beforeRemainder={formData.before.remainder}
                        afterRemainder={formData.after.remainder}
                        templateId={emailTemplateId}
                        onTemplateIdChange={handleEmailTemplateIdChange}
                        onClose={handleEmailModel}
                    />
                )}
                {whatsappModelOpen && (
                    <WhatsappTemplateModel
                        beforeRemainder={formData.before.remainder}
                        afterRemainder={formData.after.remainder}
                        templateId={whatsappTemplateId}
                        onTemplateIdChange={handleWhatsappTemplateIdChange}
                        onClose={handleWhatsappModel}
                    />
                )}
            </div>


                <div className="flex justify-between">
                <button
                    onClick={currentStep > 1 ? handlePrevious : handleBack}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center cursor-pointer ${
                        currentStep === 1
                            ? 'bg-gray-100 text-primary'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Icon icon="mdi:arrow-left" className="mr-2" />
                    { currentStep === 1?  "Back" : "Previous" }
                </button>

                <div>
                    {currentStep < STEP_CONFIG.length ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-primary cursor-pointer hover: flex items-center"
                        >
                            Next
                            <Icon icon="mdi:arrow-right" className="ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-secondary cursor-pointer text-white rounded-lg font-medium flex items-center"
                        >
                            {
                                isSubmitting ? "Submitting..." : "Submit"
                            }
                            <Icon icon="mdi:check" className="ml-2" />
                        </button>
                    )}
                </div>
            </div>
            </section>
        </Admin>
    );
};

export default CustomerOnboarding;