import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import RandomChallengePage from './components/RandomChallenge';
import KnownAttackChallenge from './components/KnownAttackChallenge';
import TestKnowledge from './components/TestKnowledgeChallenge';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/random-challenge" element={<RandomChallengePage />} />
                <Route path="/known-attack-challenge" element={<KnownAttackChallenge />} />
            
                <Route path="/test-knowledge" element={<TestKnowledge />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;