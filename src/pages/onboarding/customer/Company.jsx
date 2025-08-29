import {onboardingInputStyle} from "../../../utils/styles.js";

const Company = ({formData, handleInputChange, errors}) => {
    const countries = [
        'India', 'United States', 'United Kingdom', 'Australia',
        'Singapore', 'Germany', 'Other'
    ];
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Company Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${onboardingInputStyle} ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter company name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${onboardingInputStyle} ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter company email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`${onboardingInputStyle} ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.country === 'India' ? 'GSTIN *' :
                            formData.country === 'United States' ? 'EIN *' :
                                formData.country === 'United Kingdom' ? 'VAT Number *' :
                                    'Tax ID *'}
                    </label>
                    <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        className={`${onboardingInputStyle} ${
                            errors.gstin ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={
                            formData.country === 'India' ? 'e.g. 12ABCDE1234F1Z5' :
                                formData.country === 'United States' ? 'e.g. 12-3456789' :
                                    formData.country === 'United Kingdom' ? 'e.g. GB123456789' :
                                        'Enter tax identification number'
                        }
                    />
                    {errors.gstin && <p className="mt-1 text-sm text-red-500">{errors.gstin}</p>}
                </div>
            </div>
        </div>
    )
}

export default Company;