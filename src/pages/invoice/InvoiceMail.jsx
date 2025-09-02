import { useGetInvoiceByNoQuery } from "../../store/slices/invoice/invoiceApi.js";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import {Icon} from "@iconify/react";
import {useSendMailMutation, useSendWhatsappMutation} from "../../store/slices/auth/authApi.js";
import toast from "react-hot-toast";

const InvoiceMail = ({ invoiceNo, customer, onClose }) => {
    const { mgmt_id } = useSelector((state) => state.auth);

    const { data: invoice } = useGetInvoiceByNoQuery(invoiceNo, { skip: !invoiceNo });
    const [sendMail, {isLoading: mailLoading}] = useSendMailMutation();
    const [sendWhatsapp, { isLoading: whatsappLoading}] = useSendWhatsappMutation()

    // Extract attachment IDs safely
    const attachmentIds = useMemo(() => {
        const invoiceData = invoice?.data;
        if (Array.isArray(invoiceData) && invoiceData.length > 0) {
            return invoiceData[0]?.invoice_pdf?.map((pdf) => pdf.id) || [];
        }
        return [];
    }, [invoice]);


    // Form state
    const [mailSubject, setMailSubject] = useState(`Invoice #${invoiceNo}`);
    const [mailContent, setMailContent] = useState(
        `<p>Dear ${customer?.name || "Customer"},</p>
        <p>Please find attached your invoice <strong>#${invoiceNo}</strong>.</p>
        <p>Regards,<br/>Your Company</p>`
    );

    const handleMailSend = async () => {
        const payload = {
            to: [customer?.customer_contact?.[0]?.email],
            cc: [customer?.email],
            subject: mailSubject,
            htmlContent: mailContent,
            mgmt_id,
            attachments: attachmentIds,
            invoice_no: [invoiceNo],
            customer_id: customer?.id,
            customer_branch_id: customer?.customer_branch_id,
        };
        const res = await sendMail(payload).unwrap();
        if (res.status) {
            toast.success("Mail sent successfully!");
            onClose()
        }
    };

    const handleWhatsappSend = async () => {
        const payload = {
            to: customer?.customer_contact?.[0]?.mobile,
            mgmt_id,
            body: `Invoice #${invoiceNo} - Please check your mail for details.`,
            invoice: invoiceNo,
        };
        await sendWhatsapp(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    X
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Send Invoice #{invoiceNo}
                </h2>

                {/* Mail Form */}
                <div className="space-y-3">
                    <input
                        type="text"
                        value={mailSubject}
                        onChange={(e) => setMailSubject(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
                        placeholder="Mail Subject"
                    />
                    <textarea
                        rows={5}
                        value={mailContent}
                        onChange={(e) => setMailContent(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
                        placeholder="Mail Content"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        disabled={mailLoading || whatsappLoading}
                        onClick={handleMailSend}
                        className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl hover:bg-primary transition"
                    >
                        <Icon icon="mdi:email-outline" className="w-4 h-4" />
                        {
                            mailLoading ? "Sending..." : "Send Mail"
                        }
                    </button>
                    <button
                        disabled={mailLoading || whatsappLoading}
                        onClick={handleWhatsappSend}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                        <Icon icon="mdi:whatsapp" className="w-4 h-4" />
                        Send WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceMail;
