import {PodCard} from "../../../components/Card/PodCard.jsx";
import {Icon} from "@iconify/react";


const WorkSpace = ({pods, selectedPod, handlePodSelect}) => {

    return (
        <div className="max-w-7xl mx-auto">
            {pods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-h-full overflow-y-auto p-2">
                    {pods.map((pod) => (
                        <PodCard
                            key={pod.id}
                            pod={pod}
                            handlePodSelect={handlePodSelect}
                            selectedPod={selectedPod}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon icon="uil:package" className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No pods found</h3>
                    <p className="mt-2 text-gray-500">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}
        </div>
    )
}

export default WorkSpace