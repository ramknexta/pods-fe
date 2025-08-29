import {onboardingInputStyle} from "../../../utils/styles.js";

const Contact = ({formData, handleInputChange, errors }) => {
    return (
        <>
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Person</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.first_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter first name"
                        />
                        {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.last_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter last name"
                        />
                        {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.contact_email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter contact email"
                        />
                        {errors.contact_email && <p className="mt-1 text-sm text-red-500">{errors.contact_email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.mobile ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter mobile number"
                        />
                        {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact;