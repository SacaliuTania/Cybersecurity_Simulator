import React from 'react';

interface ChallengeButtonProps {
    label: string;
    description: string;
    onClick: () => void;
}

const ChallengeButton: React.FC<ChallengeButtonProps> = ({ label, description, onClick }) => {
    return (
        <div className="challenge-button">
            <button type="button" onClick={onClick}>
                {label}
            </button>
            <p>{description}</p>
        </div>
    );
};

export default ChallengeButton;