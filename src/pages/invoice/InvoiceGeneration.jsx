import Admin from "../../layout/Admin.jsx";
import { useFetchCustomersQuery } from "../../store/slices/customer/customerApi.js";
import {useDispatch, useSelector} from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { useCreateInvoiceMutation } from "../../store/slices/invoice/invoiceApi.js";
import { onboardingInputStyle } from "../../utils/styles.js";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import moment from "moment";
import InvoiceMail from "./InvoiceMail.jsx";
import toast from "react-hot-toast";
import {handleTitleChange} from "../../store/slices/auth/authSlice.js";

const InvoiceGeneration = () => {
    const { mgmt_id } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        invoice_no: "",
        issue_date: "",
        due_date: "",
        payment_terms: "",
        notes: "",
    });

    const [customers, setCustomers] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState('daily')
    const [terms, setTerms] = useState([''])
    const [isTerms, setIsTerms] = useState(false)
    const [mailModel, setMailModel] = useState(false)
    const [customFrequency, setCustomFrequency] = useState({
        every: 1,
        unit: 'days'
    })

    const [items, setItems] = useState([
        { id: 1, hsn: "", description: "", qty: 1, unit_rate: 0, sgst: 0, cgst: 0 },
    ]);

    const dispatch = useDispatch();

    const { data: customerData } = useFetchCustomersQuery({ mgmt_id });
    const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

    const containerRef = useRef();
    const summaryRef = useRef();

    const frequencyOptions = ["custom", 'daily', 'weekly', 'bi-weekly','monthly', 'quarterly', 'yearly']
    const unitOptions = ["days", "weeks", "months", "years"]


    useEffect(() => {
        dispatch(handleTitleChange("Invoice Generation"));
    },[])


    useGSAP(() => {
        gsap.from(".section-animate", {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        });

        if (showSummary) {
            gsap.fromTo(summaryRef.current,
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        } else {
            gsap.to(summaryRef.current,
                { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" }
            );
        }
    }, [showSummary]);

    useEffect(() => {
        if (customerData?.data) {
            setCustomers(customerData.data);
        }
    }, [customerData]);

    const filterCustomers = useMemo(() => {
        if (!searchCustomer) return customers;
        return customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchCustomer.toLowerCase())
        );
    }, [searchCustomer, customers]);

    const validateForm = () => {
        const newErrors = {};

        if (!selectedCustomer) newErrors.customer = "Customer is required";
        if (!formData.invoice_no) newErrors.invoice_no = "Invoice number is required";
        if (!formData.issue_date) newErrors.issue_date = "Issue date is required";
        if (!formData.due_date) newErrors.due_date = "Due date is required";

        // Validate items
        items.forEach((item, index) => {
            if (!item.description) newErrors[`item_${index}_description`] = "Description is required";
            if (!item.hsn) newErrors[`item_${index}_hsn`] = "HSN is required";
            if (item.hsn.length === 6) newErrors[`item_${index}_hsn_length`] = "HSN must be 6 digits";
            if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
            if (item.unit_rate < 0) newErrors[`item_${index}_unitPrice`] = "Unit price cannot be negative";
            if (item.cgst < 0 || item.cgst > 100) newErrors[`item_${index}_tax`] = "Tax must be between 0 and 100";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = ({ target: { value, name } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSearchCustomer(customer.name);
        setShowDropdown(false);
        // Clear customer error if any
        if (errors.customer) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.customer;
                return newErrors;
            });
        }
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = field === "description" || field === 'hsn' ? value : Number(value);
        setItems(updated);

        // Clear item errors if any
        const errorKey = `item_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const addItem = () => {
        setItems([...items, {
            id: Date.now(),
            description: "",
            hsn: "",
            qty: 1,
            unit_rate: 0,
            cgst: 0
        }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) return;

        // Animation for removing item
        const itemElement = document.getElementById(`item-${items[index].id}`);
        if (itemElement) {
            gsap.to(itemElement, {
                opacity: 0,
                x: -50,
                duration: 0.3,
                onComplete: () => {
                    setItems(items.filter((_, i) => i !== index));
                }
            });
        } else {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const subtotal = items.reduce(
        (acc, item) => acc + item.qty * item.unit_rate,
        0
    );
    const totalTax = items.reduce(
        (acc, item) => acc + (item.qty * item.unit_rate * item.cgst) / 100,
        0
    );
    const grandTotal = subtotal + totalTax;

    const handleSubmit = async () => {
        if (!validateForm()) {
            const firstErrorKey = Object.keys(errors)[0];
            const firstErrorElement = document.querySelector(`[data-error="${firstErrorKey}"]`);
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                gsap.fromTo(firstErrorElement,
                    { x: 0 },
                    { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
                );
            }
            return;
        }

        setIsSubmitting(true);
        try {

            const payload = {
                customer: selectedCustomer.name,
                invoice_no: formData.invoice_no,
                issue_date: moment(formData.issue_date).format('YYYY-MM-DD'),
                due_date: moment(formData.due_date).format('YYYY-MM-DD'),
                payment_term: Math.max(0, Math.ceil((new Date(formData.due_date) - new Date(formData.issue_date)) / (1000 * 60 * 60 * 24))),
                amount: grandTotal,
                amount_paid: 0,
                currency: 'INR',
                mgmt_id,
                branch_id: selectedCustomer.branch_id,
                inv_typ: 'invoice',
                item_list: items,
                recurring_invoice: false,
                shp_dts: {},
                frequency: frequency,
                custom_frequency: customFrequency,
            };

            if (isTerms) payload['terms_condition'] = terms

            const response = await createInvoice({data: [payload], mgmt_id, branch_id: selectedCustomer.branch_id}).unwrap();

            if (response.status)
            {
                toast.success("Invoice created successfully");
                setMailModel(true)
            }

        } catch (err) {
            console.error(err);
            gsap.fromTo(".error-message",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSummary = () => setShowSummary((prev) => !prev);

    // Animation variants for Framer Motion
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
    };

    const handleCustomFrequency = (e) => {
        const {name, value} = e.target
        setCustomFrequency(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleTerms = (index, value) => {
        const updatedTerms = [...terms];
        updatedTerms[index] = value;
        setTerms(updatedTerms);
    };

    const addTerm = () => {
        setTerms([...terms, '']);
    };

    const removeTerm = (index) => {
        if (terms.length <= 1) return;
        setTerms(terms.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setMailModel(false)
        gsap.fromTo(".success-message",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        setFormData({
            invoice_no: "",
            issue_date: "",
            due_date: "",
            payment_terms: "",
            notes: "",
        });
        setSelectedCustomer(null);
        setSearchCustomer("");
        setIsRecurring(false);
        setIsTerms(false);
        setItems([{ id: Date.now(), description: "", qty: 1, unit_rate: 0, cgst: 0 }]);
    }

    return (
        <Admin customClassName="p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-h-full overflow-y-auto bg-white rounded-2xl shadow-xs border border-gray-100"
                ref={containerRef}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                        <Icon icon="mdi:file-document-edit-outline" className="text-secondary text-3xl" />
                        Invoice Generation
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6 section-animate">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <div className="md:col-span-2 relative" data-error="customer">
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Icon icon="mdi:account-search" /> Customer
                                        {errors.customer && <span className="text-red-500 text-xs ml-auto">* {errors.customer}</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchCustomer || ""}
                                            onChange={(e) => {
                                                setSearchCustomer(e.target.value);
                                                setShowDropdown(true);
                                            }}
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                            className={`${onboardingInputStyle} ${errors.customer ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} pr-10 transition-colors`}
                                            placeholder="Search customer..."
                                        />
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {showDropdown && (
                                            <motion.ul
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute left-0 right-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto"
                                            >
                                                {filterCustomers.length > 0 ? (
                                                    filterCustomers.map((customer) => (
                                                        <motion.li
                                                            key={customer.id}
                                                            whileHover={{ backgroundColor: "#f0f4ff" }}
                                                            className="px-4 py-2 cursor-pointer transition-colors"
                                                            onClick={() => handleSelectCustomer(customer)}
                                                        >
                                                            <div className="font-medium">{customer.name}</div>
                                                            <div className="text-xs text-gray-500">{customer.email}</div>
                                                        </motion.li>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-sm text-gray-500">No customer found</div>
                                                )}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div data-error="invoice_no">
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Icon icon="mdi:identifier" /> Invoice Number
                                        {errors.invoice_no && <span className="text-red-500 text-xs ml-auto">* {errors.invoice_no}</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name="invoice_no"
                                        value={formData.invoice_no}
                                        onChange={handleInputChange}
                                        className={`${onboardingInputStyle} ${errors.invoice_no ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="INV-00001"
                                    />
                                </div>

                                <div data-error="issue_date">
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Icon icon="mdi:calendar-start" /> Issue Date
                                        {errors.issue_date && <span className="text-red-500 text-xs ml-auto">* {errors.issue_date}</span>}
                                    </label>
                                    <input
                                        type="date"
                                        name="issue_date"
                                        value={formData.issue_date}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={handleInputChange}
                                        className={`${onboardingInputStyle} ${errors.issue_date ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                </div>

                                <div data-error="due_date">
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Icon icon="mdi:calendar-end" /> Due Date
                                        {errors.due_date && <span className="text-red-500 text-xs ml-auto">* {errors.due_date}</span>}
                                    </label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        min={formData.issue_date}
                                        value={formData.due_date}
                                        onChange={handleInputChange}
                                        className={`${onboardingInputStyle} ${errors.due_date ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Icon icon="mdi:cash-multiple" /> Payment Terms
                                    </label>
                                    <input
                                        type="text"
                                        name="payment_terms"
                                        value={
                                            formData.issue_date && formData.due_date
                                                ? `${Math.max(
                                                    0,
                                                    Math.ceil(
                                                        (new Date(formData.due_date) - new Date(formData.issue_date)) /
                                                        (1000 * 60 * 60 * 24)
                                                    )
                                                )} Days`
                                                : "—"
                                        }

                                        readOnly
                                        className={`${onboardingInputStyle} bg-gray-50`}
                                        placeholder="Net 30 / Immediate"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <Icon icon="mdi:table" className="text-secondary" />
                                        Invoice Items
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={addItem}
                                        className="px-4 py-2 text-sm rounded-lg bg-secondary text-white flex items-center gap-1 hover:bg-primary transition-colors shadow-sm"
                                    >
                                        <Icon icon="mdi:plus-circle-outline" /> Add Item
                                    </motion.button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-200 rounded-lg text-sm">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">HSN</th>
                                            <th className="px-2 py-3 text-center font-medium text-gray-700">Qty</th>
                                            <th className="px-2 py-3 text-center font-medium text-gray-700">Unit Price</th>
                                            <th className="px-2 py-3 text-center font-medium text-gray-700">Tax %</th>
                                            <th className="px-2 py-3 text-center font-medium text-gray-700">Total</th>
                                            <th className="px-2 py-3 text-center font-medium text-gray-700"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <AnimatePresence>
                                            {items.map((item, idx) => (
                                                <motion.tr
                                                    key={item.id}
                                                    id={`item-${item.id}`}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="border-t border-gray-100 even:bg-gray-50/30"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={item.description}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, "description", e.target.value)
                                                                }
                                                                className={`${onboardingInputStyle} ${errors[`item_${idx}_description`] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} w-full`}
                                                                placeholder="Service / Product"
                                                                data-error={`item_${idx}_description`}
                                                            />
                                                            {errors[`item_${idx}_description`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_description`]}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={item.hsn}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, "hsn", e.target.value)
                                                                }
                                                                className={`${onboardingInputStyle} ${errors[`item_${idx}_hsn`] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} w-full`}
                                                                placeholder="HSN"
                                                                data-error={`item_${idx}_hsn`}
                                                            />
                                                            {errors[`item_${idx}_hsn`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_hsn`]}</div>
                                                            )}
                                                            {errors[`item_${idx}_hsn_length`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_hsn_length`]}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={item.qty}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, "qty", e.target.value)
                                                                }
                                                                className={`${onboardingInputStyle} ${errors[`item_${idx}_quantity`] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} text-center w-full`}
                                                                data-error={`item_${idx}_quantity`}
                                                            />
                                                            {errors[`item_${idx}_quantity`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_quantity`]}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.unit_rate}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, "unit_rate", e.target.value)
                                                                }
                                                                className={`${onboardingInputStyle} ${errors[`item_${idx}_unitPrice`] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} text-center w-full`}
                                                                data-error={`item_${idx}_unitPrice`}
                                                            />
                                                            {errors[`item_${idx}_unitPrice`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_unitPrice`]}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.1"
                                                                value={item.cgst}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, "cgst", e.target.value)
                                                                }
                                                                className={`${onboardingInputStyle} ${errors[`item_${idx}_tax`] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} text-center w-full`}
                                                                data-error={`item_${idx}_tax`}
                                                            />
                                                            {errors[`item_${idx}_tax`] && (
                                                                <div className="text-red-500 text-xs mt-1">{errors[`item_${idx}_tax`]}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-center font-medium text-gray-800">
                                                        ₹
                                                        {(
                                                            item.qty * item.unit_rate +
                                                            (item.qty * item.unit_rate * item.cgst) / 100
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        {items.length > 1 && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => removeItem(idx)}
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                                                aria-label="Remove item"
                                                            >
                                                                <Icon icon="mdi:delete-outline" className="text-lg" />
                                                            </motion.button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <Icon icon="mdi:plus-circle-outline" className="text-secondary" />
                                        Additional Options
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Terms & Conditions */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Icon icon="mdi:file-document-outline" className="text-secondary" />
                                                Terms & Conditions
                                            </label>
                                            <button
                                                onClick={() => setIsTerms(!isTerms)}
                                                className="text-xs text-secondary cursor-pointer hover:text-primary flex items-center gap-1"
                                            >
                                                {isTerms ? 'Hide' : 'Add Terms'}
                                            </button>
                                        </div>
                                        {isTerms && (
                                            <div className="space-y-3">
                                                {terms.map((term, idx) => (
                                                    <div key={idx} className="flex gap-2 items-start">
                                                        <input
                                                            type="text"
                                                            value={term}
                                                            onChange={(e) => handleTerms(idx, e.target.value)}
                                                            className={`${onboardingInputStyle} flex-1`}
                                                            placeholder={`Term ${idx + 1}`}
                                                        />
                                                        {terms.length > 1 && (
                                                            <button
                                                                onClick={() => removeTerm(idx)}
                                                                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 mt-1"
                                                            >
                                                                <Icon icon="mdi:close" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addTerm}
                                                    className="text-sm text-secondary hover:text-primary flex items-center gap-1 mt-2"
                                                >
                                                    <Icon icon="mdi:plus" className="text-base" />
                                                    Add another term
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Recurring Invoice */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Icon icon="mdi:calendar-repeat" className="text-secondary" />
                                                Recurring Invoice
                                            </label>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isRecurring}
                                                    onChange={() => setIsRecurring(!isRecurring)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                                            </label>
                                        </div>
                                        {isRecurring && (
                                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-secondary mb-2">Frequency</label>
                                                    <select
                                                        name="frequency"
                                                        value={frequency}
                                                        onChange={(e) => setFrequency(e.target.value)}
                                                        className={`${onboardingInputStyle}`}
                                                    >
                                                        {frequencyOptions.map((freq, id) => (
                                                            <option key={id} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {frequency === "custom" && (
                                                    <div className='grid grid-cols-2 gap-4'>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Every
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="every"
                                                                value={customFrequency.every}
                                                                min={1}
                                                                onChange={handleCustomFrequency}
                                                                className={`${onboardingInputStyle}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Unit
                                                            </label>
                                                            <select
                                                                name="unit"
                                                                value={customFrequency.unit}
                                                                onChange={handleCustomFrequency}
                                                                className={`${onboardingInputStyle}`}
                                                            >
                                                                {unitOptions.map((unit, id) => (
                                                                    <option key={id} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-sm text-secondary bg-gray-50 p-3 rounded-lg">
                                                    <Icon icon="mdi:information-outline" className="inline mr-1 text-secondary" />
                                                    Invoice will be generated every {frequency === 'custom' ? `${customFrequency.every} ${customFrequency.unit.toLowerCase()}` : frequency}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1 section-animate">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit sticky top-6">
                                <motion.button
                                    whileHover={{ backgroundColor: "#e0e7ff" }}
                                    onClick={toggleSummary}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition mb-3 border border-indigo-100"
                                >
                                    <span className="flex items-center gap-2 font-medium text-secondary">
                                      <Icon icon="mdi:file-eye-outline" />
                                        {showSummary ? "Hide Invoice Summary" : "Show Invoice Summary"}
                                    </span>
                                    <Icon
                                        icon={showSummary ? "mdi:chevron-up" : "mdi:chevron-down"}
                                        className="text-secondary"
                                    />
                                </motion.button>

                                <div ref={summaryRef} className="overflow-hidden">
                                    {showSummary && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="space-y-4 text-sm text-gray-700"
                                        >
                                            {selectedCustomer ? (
                                                <>
                                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                        <p className="font-semibold text-secondary">Bill To:</p>
                                                        <p className="font-medium mt-1">{selectedCustomer.name}</p>
                                                        <p className="text-gray-600">{selectedCustomer.email}</p>
                                                        <p className="text-gray-600">{selectedCustomer.location}, {selectedCustomer.state}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                                                    <Icon icon="mdi:alert-circle-outline" className="inline mr-1" />
                                                    No customer selected.
                                                </div>
                                            )}

                                            <hr className="border-gray-200" />

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Invoice No:</p>
                                                    <p className="font-medium">{formData.invoice_no || "—"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Issue Date:</p>
                                                    <p className="font-medium">{formData.issue_date || "—"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Due Date:</p>
                                                    <p className="font-medium">{formData.due_date || "—"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Payment Terms:</p>
                                                    <p className="font-medium">
                                                        {formData.issue_date && formData.due_date
                                                            ? `${Math.max(
                                                                0,
                                                                Math.ceil(
                                                                    (new Date(formData.due_date) - new Date(formData.issue_date)) /
                                                                    (1000 * 60 * 60 * 24)
                                                                )
                                                            )} Days`
                                                            : "—"}
                                                    </p>
                                                </div>
                                            </div>

                                            <hr className="border-gray-200" />

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax:</span>
                                                    <span className="font-medium">₹{totalTax.toFixed(2)}</span>
                                                </div>
                                                <hr className="border-gray-300" />
                                                <div className="flex justify-between text-lg font-bold text-secondary pt-2">
                                                    <span>Grand Total:</span>
                                                    <span>₹{grandTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm"
                            disabled={isLoading || isSubmitting}
                        >
                            Save Draft
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className="px-6 py-2.5 rounded-xl bg-secondary text-white font-medium hover:bg-primary flex items-center gap-2 transition-colors shadow-md shadow-indigo-500/30"
                            disabled={isLoading || isSubmitting}
                        >
                            {isLoading || isSubmitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Icon icon="mdi:loading" />
                                    </motion.div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Icon icon="mdi:file-check-outline" />
                                    Generate Invoice
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Toast Notifications */}
            {/*<AnimatePresence>*/}
            {/*    {isSubmitting && (*/}
            {/*        <motion.div*/}
            {/*            initial={{ opacity: 0, y: 50 }}*/}
            {/*            animate={{ opacity: 1, y: 0 }}*/}
            {/*            exit={{ opacity: 0, y: 50 }}*/}
            {/*            className="fixed bottom-4 right-4 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"*/}
            {/*        >*/}
            {/*            <Icon icon="mdi:loading" className="animate-spin" />*/}
            {/*            Processing your invoice...*/}
            {/*        </motion.div>*/}
            {/*    )}*/}
            {/*</AnimatePresence>*/}

            {
                mailModel && (
                    <InvoiceMail invoiceNo={formData.invoice_no} customer={selectedCustomer} onClose={handleClose} />
                )
            }
        </Admin>
    );
};

export default InvoiceGeneration;