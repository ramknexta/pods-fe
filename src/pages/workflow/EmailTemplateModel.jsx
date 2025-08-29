import {
    useFetchEmailTemplateQuery,
    useLazyFetchEmailTemplateByNameQuery
} from "../../store/slices/workflow/workflowApi.js";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Spinner from "../../components/loader/Spinner.jsx";

const EmailTemplateModal = ({ onClose, beforeRemainder, afterRemainder, templateId, onTemplateIdChange }) => {
    const { mgmt_id } = useSelector((state) => state.auth);
    const [templatesDetails, setTemplatesDetails] = useState([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
    const [selectedBefore, setSelectedBefore] = useState(templateId.before || []);
    const [selectedAfter, setSelectedAfter] = useState(templateId.after || []);
    const [activeTab, setActiveTab] = useState(beforeRemainder > 0 ? "before" : "after");

    // Fetch templates
    const { data: templates } = useFetchEmailTemplateQuery(
        { mgmt_id, getall: 1 },
        { skip: !mgmt_id }
    );
    const [fetchEmailTemplateByName] = useLazyFetchEmailTemplateByNameQuery();

    const fetchTemplatesWithDelay = useCallback(async () => {
        if (!templates?.status) return;
        setIsLoadingTemplates(true);

        try {
            const emailDetails = [];
            for (const template of templates.data) {
                // Small delay to prevent overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 100));
                try {
                    const result = await fetchEmailTemplateByName({
                        tempName: template.template_name,
                        temp_id: template.id,
                        mgmt_id,
                    }).unwrap();

                    if (result.status) {
                        emailDetails.push(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching email template:", error);
                }
            }
            setTemplatesDetails(emailDetails);
        } catch (error) {
            console.error("Error in template fetching:", error);
        } finally {
            setIsLoadingTemplates(false);
        }
    }, [templates, fetchEmailTemplateByName, mgmt_id]);

    useEffect(() => {
        fetchTemplatesWithDelay();
    }, [fetchTemplatesWithDelay]);

    // Template selection handlers
    const handleSelectTemplate = (templateId, type) => {
        if (type === "before") {
            if (selectedBefore.length >= beforeRemainder) {
                alert(`You can only select ${beforeRemainder} template(s) for Before Remainder`);
                return;
            }
            if (!selectedBefore.includes(templateId) || selectedBefore.includes(templateId)) {
                const updated = [...selectedBefore, templateId];
                setSelectedBefore(updated);
                onTemplateIdChange(updated, "before");
            }
        } else {
            if (selectedAfter.length >= afterRemainder) {
                alert(`You can only select ${afterRemainder} template(s) for After Remainder`);
                return;
            }
            if (!selectedBefore.includes(templateId) || selectedBefore.includes(templateId)) {
                const updated = [...selectedAfter, templateId];
                setSelectedAfter(updated);
                onTemplateIdChange(updated, "after");
            }
        }
    };

    const handleRemoveTemplate = (templateId, type) => {
        const selectedList = type === "before" ? selectedBefore : selectedAfter;
        const setSelected = type === "before" ? setSelectedBefore : setSelectedAfter;

        const updated = selectedList.filter((id) => id !== templateId);
        setSelected(updated);
        onTemplateIdChange(updated, type);
    };

    const moveTemplate = (index, direction, type) => {
        const selectedList = type === "before" ? [...selectedBefore] : [...selectedAfter];
        const setSelected = type === "before" ? setSelectedBefore : setSelectedAfter;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= selectedList.length) return;

        [selectedList[index], selectedList[newIndex]] = [selectedList[newIndex], selectedList[index]];

        setSelected(selectedList);
        onTemplateIdChange(selectedList, type);
    };

    // Template card component
    const TemplateCard = ({ template, onSelect, isSelected, variant = "default" }) => {
        const variantStyles = {
            default: "hover:shadow-md",
            before: "shadow-sm hover:shadow-md border-blue-400",
            after: "shadow-sm hover:shadow-md border-green-400",
            selected: "bg-green-50"
        };

        return (
            <motion.div
                whileHover={{ y: -2 }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? variantStyles.selected : variantStyles[variant]
                }`}
                onClick={onSelect}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-[14px] text-gray-800 truncate">{template.template_name}</h5>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.subject}</p>
                    </div>
                    {isSelected && (
                        <Icon
                            icon="mdi:check-circle"
                            className="text-green-500 text-xl flex-shrink-0 ml-2"
                        />
                    )}
                </div>
            </motion.div>
        );
    };

    // Selected template list component
    const SelectedTemplateList = ({ selected, type }) => {
        if (selected.length === 0) {
            return (
                <div className="text-center py-6 bg-gray-50 rounded-lg ">
                    <Icon icon="mdi:email-outline" className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No templates selected</p>
                    <p className="text-gray-400 text-xs mt-1">
                        Click on templates below to add them to your sequence
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {selected.map((id, index) => {
                    const template = templatesDetails.find((t) => t.id === id);
                    if (!template) return null;

                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <span className="text-gray-600 font-medium text-sm">{index + 1}</span>
                                </div>
                                <div>
                                    <p className="text-[14px] text-gray-800">{template.template_name}</p>
                                    <p className="text-xs text-gray-600 truncate max-w-xs">{template.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => moveTemplate(index, -1, type)}
                                    disabled={index === 0}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Move up"
                                >
                                    <Icon icon="mdi:arrow-up" className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => moveTemplate(index, 1, type)}
                                    disabled={index === selected.length - 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Move down"
                                >
                                    <Icon icon="mdi:arrow-down" className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => handleRemoveTemplate(id, type)}
                                    className="p-2 rounded-lg hover:bg-red-50"
                                    title="Remove template"
                                >
                                    <Icon icon="mdi:trash-can-outline" className="text-red-500" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    // Tab navigation
    const TabButton = ({ active, onClick, children, count }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-t-lg border-b-2 font-medium transition-colors ${
                active
                    ? "border-secondary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
            {children}
            {count > 0 && (
                <span className="ml-2 bg-blue-100 text-secondary text-xs font-medium px-2 py-0.5 rounded-full">
                  {count}
                </span>
            )}
        </button>
    );

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[75vh] flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <Icon icon="mdi:email-multiple" className="text-secondary text-xl" />
                            </div>
                            <div>
                                <h2 className="text-md font-semibold text-gray-800">Email Template Sequence</h2>
                                <p className="text-xs text-gray-500">Configure templates for your workflow</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <Icon icon="mdi:close" width="20" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto">
                        {isLoadingTemplates ? (
                            <Spinner />
                        ) : (
                            <div className="px-6 py-2">
                                {/* Tab Navigation */}
                                {beforeRemainder > 0 && afterRemainder > 0 && (
                                    <div className="flex mb-3">
                                        <TabButton
                                            active={activeTab === "before"}
                                            onClick={() => setActiveTab("before")}
                                            count={selectedBefore.length}
                                        >
                                            Before Reminder
                                        </TabButton>
                                        <TabButton
                                            active={activeTab === "after"}
                                            onClick={() => setActiveTab("after")}
                                            count={selectedAfter.length}
                                        >
                                            After Reminder
                                        </TabButton>
                                    </div>
                                )}

                                {/* Before Remainder Section */}
                                {(activeTab === "before" || !afterRemainder) && beforeRemainder > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="my-6">
                                            <h3 className="text-md text-gray-800 mb-4 flex items-center">
                                                <Icon icon="mdi:clock-outline" className="text-blue-500 mr-2" />
                                                Before Reminder Templates
                                                <span className="ml-2 text-xs font-normal bg-blue-100 text-secondary px-2 py-1 rounded-full">
                                                  {selectedBefore.length} of {beforeRemainder} slots filled
                                                </span>
                                            </h3>
                                            <SelectedTemplateList selected={selectedBefore} type="before" />
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-3">Available Templates</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {templatesDetails.map((template) => (
                                                    <TemplateCard
                                                        key={template.id}
                                                        template={template}
                                                        isSelected={selectedBefore.includes(template.id)}
                                                        onSelect={() => handleSelectTemplate(template.id, "before")}
                                                        variant="before"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* After Remainder Section */}
                                {(activeTab === "after" || !beforeRemainder) && afterRemainder > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <Icon icon="mdi:clock-check-outline" className="text-green-500 mr-2" />
                                                After Reminder Templates
                                                <span className="ml-2 text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                  {selectedAfter.length} of {afterRemainder} slots filled
                                                </span>
                                            </h3>
                                            <SelectedTemplateList selected={selectedAfter} type="after" />
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-3">Available Templates</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {templatesDetails.map((template) => (
                                                    <TemplateCard
                                                        key={template.id}
                                                        template={template}
                                                        isSelected={selectedAfter.includes(template.id)}
                                                        onSelect={() => handleSelectTemplate(template.id, "after")}
                                                        variant="after"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-1 text-sm bg-secondary text-white hover:bg-primary cursor-pointer rounded-lg transition-colors shadow-sm"
                        >
                            Save Sequence
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmailTemplateModal;