import { useState } from 'react';

interface Feedback {
    correct_id: boolean;
    score: number;
    feedback: string;
}

const API_URL = '/api';

function RandomChallengePage() {
    const [description, setDescription] = useState('');
    const [attack, setAttack] = useState('');
    const [solution, setSolution] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // async function generateChallenge() {
    //     setLoading(true);
    //     setError('');
    //     setDescription('');
    //     setFeedback(null);

    //     try {
    //         const response = await fetch(`${API_URL}/challenge/guess`, {
    //             credentials: 'include',
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP ${response.status}`);
    //         }

    //         const data = await response.json();
    //         setDescription(data.challenge_description);
    //     } catch (error) {
    //         setError(error instanceof Error ? error.message : 'Generation failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function generateChallenge() {
    setLoading(true);
    setError('');
    setDescription('');
    setAttack('');
    setSolution('');
    setFeedback(null);

    try {
        const response = await fetch(`${API_URL}/challenge/guess`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setDescription(data.challenge_description);
    } catch (error) {
        setError(
            error instanceof Error
                ? error.message
                : 'Generation failed'
        );
    } finally {
        setLoading(false);
    }
}

    async function submitAnswer() {
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/challenge/submission`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_guess: attack,
                    user_answer: solution,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

            setFeedback(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="random-challenge-page">
            <h1>Random Challenge</h1>

            <button type="button" onClick={generateChallenge} disabled={loading}>
                {loading ? 'Generating...' : 'Generate description'}
            </button>

            {error && <p className="error">{error}</p>}

            {description && (
                <div className="challenge-form">
                    <h2>Attack description</h2>
                    <p>{description}</p>

                    <label htmlFor="attack">Attack</label>
                    <input
                        id="attack"
                        type="text"
                        value={attack}
                        onChange={(event) => setAttack(event.target.value)}
                    />

                    <label htmlFor="solution">Solution</label>
                    <textarea
                        id="solution"
                        value={solution}
                        onChange={(event) => setSolution(event.target.value)}
                        rows={6}
                    />

                    <button
                        type="button"
                        onClick={submitAnswer}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit answer'}
                    </button>
                </div>
            )}

            {feedback && (
                <section>
                    <h2>Feedback</h2>
                    <p>Score: {feedback.score}</p>
                    <p>{feedback.feedback}</p>
                </section>
            )}
        </main>
    );
}

export default RandomChallengePage;