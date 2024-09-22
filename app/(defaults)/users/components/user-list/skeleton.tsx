export default function UserSkeleton() {
    const rows = 5;
    return (
        <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>USUARIO</th>
                        <th>CORREO ELECTRÓNICO</th>
                        <th>TELEFONO</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td>
                                <div className="flex gap-2 items-center ml-2">
                                    <div className="rounded-full bg-gray-300 h-10 w-10" />
                                    <div className="flex flex-col space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="whitespace-nowrap h-4 bg-gray-300 rounded w-36"></div>
                            </td>
                            <td>
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </td>
                            <td>
                                <div className="flex gap-2 justify-end">
                                    <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                                    <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
