export default function FormSkeleton() {
    return (
        <div className="panel">
            <div className="space-y-6 animate-pulse">
                <div className="flex flex-col space-y-2">
                    <label className="w-24 h-4 bg-gray-300 rounded"></label>
                    <div className="w-full h-10 bg-gray-300 rounded"></div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="w-32 h-4 bg-gray-300 rounded"></label>
                    <div className="w-full h-10 bg-gray-300 rounded"></div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="w-20 h-4 bg-gray-300 rounded"></label>
                    <div className="w-full h-10 bg-gray-300 rounded"></div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="w-28 h-4 bg-gray-300 rounded"></label>
                    <div className="w-full h-10 bg-gray-300 rounded"></div>
                </div>

                <div className="flex justify-end mt-4">
                    <div className="w-32 h-10 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    )
}
