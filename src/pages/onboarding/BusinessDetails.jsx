const BusinessDetails = ({handleInputChange, formData, errors, branches}) => {
    return (
        <>
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Details</h3>
                <p className="text-gray-500 mb-6">Additional business information</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                            type="text"
                            name="addr1"
                            value={formData.addr1}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter address line 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter location"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter state"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter pincode"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                        <select
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
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
                            checked={formData.workflow}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="workflow" className="ml-3 block text-sm font-medium text-gray-700">
                            Default Workflow
                        </label>
                    </div>

                    {/*Todo: Need to add the workflow preview*/}
                    {/*{formData.workflow && (*/}
                    {/*    <>*/}
                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name</label>*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                name="workflow_name"*/}
                    {/*                value={formData.workflow_name}*/}
                    {/*                onChange={handleInputChange}*/}
                    {/*                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                placeholder="Enter workflow name"*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                name="description"*/}
                    {/*                value={formData.workflow_name}*/}
                    {/*                onChange={handleInputChange}*/}
                    {/*                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                placeholder="Enter workflow name"*/}
                    {/*            />*/}
                    {/*        </div>*/}

                    {/*        <label className="block text-sm font-medium text-gray-700 mb-2">Actions before due date</label>*/}
                    {/*        <div className='flex items-center md:col-span-2'>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Remainder</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <label className="block text-sm font-medium text-gray-700 mb-2">Actions after due date</label>*/}
                    {/*        <div className='flex items-center md:col-span-2'>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Remainder</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    name="description"*/}
                    {/*                    value={formData.workflow_name}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"*/}
                    {/*                    placeholder="Enter workflow name"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </>*/}
                    {/*)}*/}
                </div>
            </div>
        </>
    )
}

export default BusinessDetails;