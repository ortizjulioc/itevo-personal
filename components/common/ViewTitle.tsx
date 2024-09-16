import React from 'react';
import { useRouter } from 'next/router';

interface ViewTitleProps {
    title: string;
    showBackPage?: boolean;
    rightComponent?: React.ReactNode;
}

const ViewTitle: React.FC<ViewTitleProps> = ({ title, showBackPage = false, rightComponent }) => {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <div className="view-title">
            {showBackPage && (
                <button onClick={handleBackClick} className="back-button">
                    <span className="back-icon">🔙</span>
                </button>
            )}
            <h1>{title}</h1>
            {rightComponent && <div className="right-component">{rightComponent}</div>}
        </div>
    );
};

export default ViewTitle;
