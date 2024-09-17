import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
interface ViewTitleProps {
    title: string;
    showBackPage?: boolean;
    rightComponent?: React.ReactNode;
}

const ViewTitle: React.FC<ViewTitleProps> = ({ title, showBackPage = false, rightComponent }) => {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBackClick = () => {
        if (isClient) {
            router.back();
        }
    };

    if (!isClient) {
        return null; // Opcional: Podrías retornar un loading spinner o algo similar
    }

    return (
        <div className="flex items-center p-4 ">
        {showBackPage && (
            <button
                onClick={handleBackClick}
                className="bg-transparent border-none cursor-pointer  text-2xl mr-4"
            >
                <MdOutlineArrowBackIosNew />
            </button>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
        {rightComponent && <div className="ml-auto flex items-center">{rightComponent}</div>}
    </div>
    );
};

export default ViewTitle;
