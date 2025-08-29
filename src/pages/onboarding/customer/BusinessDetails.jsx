import {onboardingInputStyle} from "../../../utils/styles.js";

const BusinessDetails = ({handleInputChange, formData, errors, branches, defaultModelhandler, emailModelhandler, whatsappModelhandler}) => {
    return (
        <>
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Additional business information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                        <input
                            type="text"
                            name="addr1"
                            value={formData.addr1}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.addr1 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter address line 1"
                        />
                        {errors.addr1 && <p className="mt-1 text-sm text-red-500">{errors.addr1}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.location ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter location"
                        />
                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter state"
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.pincode ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter pincode"
                        />
                        {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                        <select
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                            className={`${onboardingInputStyle} ${
                                errors.branch_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            {branches.map(branch => (
                                <option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>
                            ))}
                        </select>
                        {errors.branch_id && <p className="mt-1 text-sm text-red-500">{errors.branch_id}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="workflow"
                            name="workflow"
                            onClick={!formData.workflow ? defaultModelhandler : null}
                            checked={formData.workflow}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="workflow" className="ml-3 block text-sm font-medium text-gray-700">
                            Default Workflow
                        </label>
                    </div>

                    {/*Todo: Need to add the workflow preview*/}
                    {!formData.workflow && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name</label>
                                <input
                                    type="text"
                                    name="workflow_name"
                                    value={formData.workflow_name}
                                    onChange={handleInputChange}
                                    className={`${onboardingInputStyle} ${errors.workflow_name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter workflow name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`${onboardingInputStyle} ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter the description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Actions before due date</label>
                                <div className='flex items-center md:col-span-2 gap-5'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                                        <input
                                            type="text"
                                            name="before.days"
                                            value={formData.before.days || ''}
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.before_days ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Remainder</label>
                                        <input
                                            type="text"
                                            name="before.remainder"
                                            value={formData.before.remainder || ''}
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.before_reaminder ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                        <input
                                            type="text"
                                            name="before.frequency"
                                            value={formData.before.frequency || ''}
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.before_frequency ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Actions after due date</label>
                                <div className='flex items-center md:col-span-2 gap-5'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                                        <input
                                            type="text"
                                            name="after.days"
                                            value={formData.after.days || ''}
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.after_days ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Remainder</label>
                                        <input
                                            type="text"
                                            name="after.remainder"
                                            value={formData.after.remainder || '' }
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.after_remainder ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                        <input
                                            type="text"
                                            name="after.frequency"
                                            value={formData.after.frequency || ''}
                                            onChange={handleInputChange}
                                            className={`${onboardingInputStyle} ${errors.after_frequency ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter the value"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                                <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
                                    <div className='flex items-center'>
                                        <label className="block text-sm font-medium text-gray-700 ">E-mail</label>
                                        <input
                                            type="checkbox"
                                            name="action.email"
                                            value={formData.action.email}
                                            onClick={!formData.action.email ? emailModelhandler: null}
                                            onChange={handleInputChange}
                                            className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500"
                                            placeholder="Enter the description"
                                        />
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <label className="block text-sm font-medium text-gray-700">Whatsapp</label>
                                        <input
                                            type="checkbox"
                                            name="action.whatsapp"
                                            value={formData.action.whatsapp}
                                            onClick={!formData.action.whatsapp ? whatsappModelhandler: null}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg  focus:border-indigo-500"
                                            placeholder="Enter the description"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default BusinessDetails;