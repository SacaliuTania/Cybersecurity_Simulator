import { useState } from 'react';

interface Feedback {
    correct_id?: boolean;
    score: number;
    feedback: string;
    correct_answer?: string;
}

const API_URL = '/api';

const attacks = [
    { key: 'sql_injection', label: 'SQL Injection' },
    { key: 'phishing', label: 'Phishing' },
    { key: 'ransomware', label: 'Ransomware' },
];

function KnownAttackChallenge() {
    const [selectedAttack, setSelectedAttack] = useState('');
    const [description, setDescription] = useState('');
    const [solution, setSolution] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function generateChallenge(attackKey: string, attackLabel: string) {
        setSelectedAttack(attackLabel);
        setDescription('');
        setSolution('');
        setFeedback(null);
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/challenge/known/${attackKey}`,
                { credentials: 'include' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

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
        if (!selectedAttack || !solution.trim() || submitting) {
            return;
        }

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
                    user_guess: selectedAttack,
                    user_answer: solution,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

            setFeedback(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Submission failed'
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main>
            <h1>Known Attack Challenge</h1>

            <div>
                {attacks.map((attack) => (
                    <button
                        key={attack.key}
                        type="button"
                        onClick={() =>
                            generateChallenge(attack.key, attack.label)
                        }
                        disabled={loading}
                    >
                        {attack.label}
                    </button>
                ))}
            </div>

            {error && <p>{error}</p>}

            {description && (
                <>
                    <h2>{selectedAttack}</h2>
                    <p>{description}</p>

                    <label htmlFor="known-solution">Solution</label>
                    <textarea
                        id="known-solution"
                        value={solution}
                        onChange={(event) =>
                            setSolution(event.target.value)
                        }
                        rows={6}
                    />

                    <button
                        type="button"
                        onClick={submitAnswer}
                        disabled={submitting || !solution.trim()}
                    >
                        {submitting ? 'Submitting...' : 'Submit answer'}
                    </button>
                </>
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

export default KnownAttackChallenge;