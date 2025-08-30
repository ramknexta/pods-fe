import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useFetchEmailTemplateQuery,
    useFetchWhatsappTemplateQuery,
    useFetchWorkflowByBranchIdQuery,
    useLazyFetchDefaultWorkflowQuery,
    useLazyFetchEmailTemplateByNameQuery,
    useLazyFetchWhatsappTemplateByNameQuery
} from "../../store/slices/workflow/workflowApi.js";
import Spinner from "../../components/loader/Spinner.jsx";
import Error404 from "../../components/error/Error404.jsx";

const WorkflowPreviewModel = ({ isDefault, branch_id, setEmailTemplateId, setWhatsappTemplateId, setFormDataHandler, onClose }) => {
    const { mgmt_id } = useSelector((state) => state.auth);
    const [emailTemplatesDetails, setEmailTemplatesDetails] = useState([]);
    const [whatsappTemplatesDetails, setWhatsappTemplatesDetails] = useState([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
    const [activeTab, setActiveTab] = useState("workflow");
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
    const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] = useState(null);

    // Fetch workflow data
    const { data: defaultData, isLoading, isError } = useFetchWorkflowByBranchIdQuery(
        { mgmt_id, branch_id },
        { skip: !mgmt_id || !branch_id }
    );

    const [fetchDefaultWorkflow, { data: workflowData, isLoading: isFetching }] =
        useLazyFetchDefaultWorkflowQuery();

    const rules = workflowData?.data[0]?.rules[0]

    // Fetch templates
    const { data: emailTemplates } = useFetchEmailTemplateQuery(
        { mgmt_id, getall: 1 },
        { skip: !mgmt_id }
    );

    const { data: whatsappTemplates } = useFetchWhatsappTemplateQuery(
        { id: mgmt_id },
        { skip: !mgmt_id }
    );

    const [fetchEmailTemplateByName] = useLazyFetchEmailTemplateByNameQuery();
    const [fetchWhatsappTemplateByName] = useLazyFetchWhatsappTemplateByNameQuery();

    // Fetch default workflow
    useEffect(() => {
        if (defaultData?.status && isDefault) {
            const defaultWorkflows = defaultData.data.filter(d => d.name === "Default");
            if (defaultWorkflows.length > 0) {
                fetchDefaultWorkflow({
                    id: parseInt(defaultWorkflows[0].id),
                    mgmt_id,
                    branch_id,
                });
            }
        }
    }, [defaultData, isDefault, mgmt_id, branch_id, fetchDefaultWorkflow]);

    // Optimized template fetching with rate limiting
    const fetchTemplatesWithDelay = useCallback(async () => {
        if (!emailTemplates?.status || !whatsappTemplates?.status) return;

        setIsLoadingTemplates(true);

        try {
            // Process email templates with delay between requests
            const emailDetails = [];
            for (const template of emailTemplates.data) {
                await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
                try {
                    const result = await fetchEmailTemplateByName({
                        tempName: template.template_name,
                        temp_id: template.id,
                        mgmt_id
                    }).unwrap();
                    if (result.status) {
                        emailDetails.push(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching email template:", error);
                }
            }
            setEmailTemplatesDetails(emailDetails);

            // Process WhatsApp templates with delay between requests
            const whatsappDetails = [];
            for (const template of whatsappTemplates.data) {
                await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
                try {
                    const result = await fetchWhatsappTemplateByName({
                        tempName: template.template_name,
                        temp_id: template.id,
                        mgmt_id
                    }).unwrap();
                    if (result.status) {
                        whatsappDetails.push(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching WhatsApp template:", error);
                }
            }
            setWhatsappTemplatesDetails(whatsappDetails);
        } catch (error) {
            console.error("Error in template fetching:", error);
        } finally {
            setIsLoadingTemplates(false);
        }
    }, [emailTemplates, whatsappTemplates, fetchEmailTemplateByName, fetchWhatsappTemplateByName, mgmt_id]);


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplatesWithDelay();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchTemplatesWithDelay]);

    useEffect(() => {
        const actions = rules?.actions;
        const event_data = rules?.event_data;

        if (!Array.isArray(actions)) return;
        if (!event_data) return;

        setFormDataHandler(prev => ({
            ...prev,
            workflow_name: rules.event_name,
            description: rules.description,
            before: {
                days: event_data.before.days,
                remainder: event_data.before.remainder,
                frequency: event_data.before.frequency,
            },
            after: {
                days: event_data.after.days,
                remainder: event_data.after.remainder,
                frequency: event_data.after.frequency,
            },
        }))

        const emailAction = actions.find(a => a.action_type === "email");
        const whatsappAction = actions.find(a => a.action_type === "whatsapp");

        if (emailAction) {
            setEmailTemplateId({
                before: emailAction.action_data.before_template_id,
                after: emailAction.action_data.after_template_id,
            });
        }

        if (whatsappAction) {
            setWhatsappTemplateId({
                before: whatsappAction.action_data.before_template_id,
                after: whatsappAction.action_data.after_template_id,
            });
        }
    }, [rules, setEmailTemplateId, setWhatsappTemplateId]);


    if (isLoading) return <Spinner />;
    if (isError) return <Error404 onClose={onClose} />

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[70vh] overflow-hidden flex flex-col border border-gray-200"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-150 to-white">
                        <h2 className="text-2xl font-bold text-gray-800">Workflow Preview</h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-white">
                        <nav className="flex px-6 -mb-px">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab("workflow")}
                                className={`py-5 px-6 font-medium text-sm border-b-2 transition-all duration-300 ${
                                    activeTab === "workflow"
                                        ? "border-secondary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  Workflow Configuration
                                </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab("email")}
                                className={`py-5 px-6 font-medium text-sm border-b-2 transition-all duration-300 ${
                                    activeTab === "email"
                                        ? "border-secondary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Email Templates
                                </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab("whatsapp")}
                                className={`py-5 px-6 font-medium text-sm border-b-2 transition-all duration-300 ${
                                    activeTab === "whatsapp"
                                        ? "border-secondary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  WhatsApp Templates
                                </span>
                            </motion.button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                        {isFetching && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center items-center py-8 bg-white rounded-xl shadow-sm mb-6"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="rounded-full h-8 w-8 border-2 border-blue-100 border-t-blue-600"
                                />
                                <span className="ml-3 text-gray-600 font-medium">Loading default workflow details...</span>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {activeTab === "workflow" && workflowData && (
                                <motion.div
                                    key="workflow"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Workflow Rules
                                    </h3>
                                    {workflowData.data[0]?.rules?.map((rule, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-semibold text-gray-800 mb-3 text-lg flex items-center">
                                                <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm mr-2">
                                                  {index + 1}
                                                </span>
                                                {rule.description}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                                {rule.event_data.before && (
                                                    <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-100">
                                                        <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Before Due Date
                                                        </h5>
                                                        <div className="space-y-2 text-sm text-gray-700">
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Days:</span> <span className="font-semibold">{rule.event_data.before.days}</span></p>
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Reminders:</span> <span className="font-semibold">{rule.event_data.before.remainder}</span></p>
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Frequency:</span> <span className="font-semibold">Every {rule.event_data.before.frequency} days</span></p>
                                                        </div>
                                                    </div>
                                                )}
                                                {rule.event_data.after && (
                                                    <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-100">
                                                        <h5 className="text-sm font-medium text-amber-800 mb-3 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            After Due Date
                                                        </h5>
                                                        <div className="space-y-2 text-sm text-gray-700">
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Days:</span> <span className="font-semibold">{rule.event_data.after.days}</span></p>
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Reminders:</span> <span className="font-semibold">{rule.event_data.after.remainder}</span></p>
                                                            <p className="flex justify-between"><span className="font-medium text-gray-600">Frequency:</span> <span className="font-semibold">Every {rule.event_data.after.frequency} days</span></p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "email" && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email Templates
                                    </h3>
                                    {isLoadingTemplates ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm"
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="rounded-full h-10 w-10 border-2 border-blue-100 border-t-blue-600"
                                            />
                                            <span className="ml-3 text-gray-600 font-medium">Loading email templates...</span>
                                        </motion.div>
                                    ) : emailTemplatesDetails.length > 0 ? (
                                        <div>

                                        <div className="grid grid-cols-3 gap-5">
                                            {emailTemplatesDetails.map((template, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200"
                                                         onClick={() => setSelectedEmailTemplate(template)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-gray-800 text-md">{template.template_name}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                template.status_type === 'Active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {template.status_type}
                                                          </span>
                                                        </div>
                                                        {template.is_cumulative && (
                                                            <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                                                Cumulative
                                                              </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                            {
                                                selectedEmailTemplate && (
                                                    <div className="p-5">
                                                        <p className="text-sm text-gray-700 mb-4">
                                                            <span className="font-medium text-gray-600">Subject:</span> {selectedEmailTemplate.subject}
                                                        </p>
                                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                            <div
                                                                className="text-[14px] prose prose-sm max-w-none text-secondary"
                                                                dangerouslySetInnerHTML={{ __html: selectedEmailTemplate.body || selectedEmailTemplate.content }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No email templates</h3>
                                            <p className="mt-2 text-gray-500 max-w-md mx-auto">Get started by creating your first email template to enhance customer communication.</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Create Template
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "whatsapp" && (
                                <motion.div
                                    key="whatsapp"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        WhatsApp Templates
                                    </h3>
                                    {isLoadingTemplates ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm"
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="rounded-full h-10 w-10 border-2 border-green-100 border-t-green-500"
                                            />
                                            <span className="ml-3 text-gray-600 font-medium">Loading WhatsApp templates...</span>
                                        </motion.div>
                                    ) : whatsappTemplatesDetails.length > 0 ? (
                                        <div>
                                            <div className="grid grid-cols-3 gap-5">
                                                {whatsappTemplatesDetails.map((template, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-200"
                                                             onClick={() => setSelectedWhatsappTemplate(template)}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <h4 className=" text-gray-800 text-md">{template.template_name}</h4>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                    template.status_type === 'Active'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {template.status_type}
                                                                  </span>
                                                            </div>
                                                            {template.is_cumulative && (
                                                                <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                                                    Cumulative
                                                                  </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            {
                                                selectedWhatsappTemplate && (
                                                    <div className="p-5">
                                                        <p className="text-sm text-gray-700 mb-4">
                                                            <span className="font-medium text-gray-600">Subject:</span> {selectedWhatsappTemplate.subject}
                                                        </p>
                                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                            <div
                                                                className="text-[14px] prose prose-sm max-w-none text-secondary"
                                                                dangerouslySetInnerHTML={{ __html: selectedWhatsappTemplate.body || selectedWhatsappTemplate.content }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No WhatsApp templates</h3>
                                            <p className="mt-2 text-gray-500 max-w-md mx-auto">Create WhatsApp templates to engage with your customers through instant messaging.</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Create Template
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WorkflowPreviewModel;