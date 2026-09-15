import { useState } from 'react';

interface Question {
    id: string;
    question: string;
    options: {
        a: string;
        b: string;
        c: string;
    };
}

interface Correction {
    number: string;
    question: string;
    correct_answer: string;
    correct_text: string;
    explanation: string;
}

const API_URL = '/api';

function TestKnowledge() {
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [corrections, setCorrections] = useState<Correction[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [visibleExplanations, setVisibleExplanations] = useState<string[]>([]);

    async function chooseDifficulty(value: string) {
        setDifficulty(value);
        setQuestions([]);
        setAnswers({});
        setCorrections([]);
        setScore(null);
        setSubmitted(false);
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/knowledge/questions/${value}`,
                {
                    credentials: 'include',
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

            setQuestions(data.questions);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Could not generate questions'
            );
        } finally {
            setLoading(false);
        }
    }

    function selectAnswer(questionId: string, answer: string) {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answer,
        }));
    }

// async function submitQuiz() {

//     if(submitted) return;
    
//     const unanswered = questions.some(
//         (question) => !answers[question.id]
//     );

//     if (unanswered) {
//         setError('Please answer all 10 questions.');
//         return;
//     }

//     setLoading(true);
//     setError('');

//     try {

//         const payload = {
//             answers: answers,
//         };


//         const response = await fetch(`${API_URL}/knowledge/submit`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ answers }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.detail || `HTTP ${response.status}`);
//         }

//         setScore(data.score);
//         setCorrections(data.corrections);
//     } catch (error) {
//         setError(
//             error instanceof Error
//                 ? error.message
//                 : 'Could not submit quiz'
//         );
//     } finally {
//         setLoading(false);
//     }
// }

async function submitQuiz() {
    if (submitted) return;

    const unanswered = questions.some(
        (question) => !answers[question.id]
    );

    if (unanswered) {
        setError('Please answer all 10 questions.');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${API_URL}/knowledge/submit`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `HTTP ${response.status}`);
        }

        setScore(data.score);
        setCorrections(data.corrections);
        setSubmitted(true);
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Could not submit quiz');
    } finally {
        setLoading(false);
    }
}
    function toggleExplanation(number: string) {
        setVisibleExplanations((previous) =>
            previous.includes(number)
                ? previous.filter((item) => item !== number)
                : [...previous, number]
        );
    }

    return (
        <main>
            <h1>Test Your Knowledge</h1>
            <h2>Choose the difficulty</h2>

            <div>
                {['easy', 'medium', 'hard'].map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => chooseDifficulty(value)}
                        disabled={loading}
                    >
                        {value}
                    </button>
                ))}
            </div>

            {error && <p>{error}</p>}

            {questions.length > 0 && (
                <section>
                    {questions.map((question, index) => (
                        <article key={question.id}>
                            <h3>
                                {index + 1}. {question.question}
                            </h3>

                            {(['a', 'b', 'c'] as const).map((option) => (
    <label
        key={option}
        style={{
            display: 'block',
            margin: '8px 0',
            cursor: 'pointer',
        }}
    >
        <input
            type="radio"
            name={`question-${question.id}`}
            checked={answers[question.id] === option}
            onChange={() => selectAnswer(question.id, option)}
        />
        {' '}{option}. {question.options[option]}
    </label>
))}
                        </article>
                    ))}

                    <button
    type="button"
    onClick={submitQuiz}
    disabled={loading || submitted || questions.length !== 10}
>
    {loading
        ? 'Submitting...'
        : submitted
            ? 'Quiz submitted'
            : 'Submit quiz'}
</button>
                </section>
            )}

            {score !== null && (
                <section>
                    <h2>
                        Score: {score} / 10
                    </h2>

                    {corrections.map((correction) => (
                        <article key={correction.number}>
                            <h3>
                                Question {correction.number}
                            </h3>

                            <p>{correction.question}</p>

                            <p>
                                Correct answer:{' '}
                                <strong>
                                    {correction.correct_answer}){' '}
                                    {correction.correct_text}
                                </strong>
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    toggleExplanation(correction.number)
                                }
                            >
                                Show explanation
                            </button>

                            {visibleExplanations.includes(
                                correction.number
                            ) && <p>{correction.explanation}</p>}
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default TestKnowledge;