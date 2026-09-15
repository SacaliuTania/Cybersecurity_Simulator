import { useNavigate } from 'react-router-dom';
import ChallengeButton from './ChallengeButton';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <main className="welcome-page">
            <h1>Welcome to the Cybersecurity Simulator</h1>
            <p>Choose a challenge type:</p>

            <div className="challenge-buttons">
                <ChallengeButton
                    label="random challenge"
                    description="You have to guess the type of attack that is described, provide a solution and receive feedback."
                    onClick={() => navigate('/random-challenge')}
                />

                <ChallengeButton
                    label="known attack challenge"
                    description="Choose your attack and provide a solution."
                    onClick={() => navigate('/known-attack-challenge')}
                />

                <ChallengeButton
                    label="test knowledge"
                    description="Test your knowledge."
                    onClick={() => navigate('/test-knowledge')}
                />
            </div>
        </main>
    );
}

export default WelcomePage;