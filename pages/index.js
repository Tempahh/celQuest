import { useState } from 'react';

export default function Home() {
  const [InputtedCelebrityFromUser, setInputtedCelebrityFromUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ InputtedCelebrityFromUser }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setError('No questions were generated. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Celebrity Question Generator</h1>
      <input
        type="text"
        value={InputtedCelebrityFromUser}
        onChange={(e) => setInputtedCelebrityFromUser(e.target.value)}
        placeholder="Enter celebrity name"
      />
      <button onClick={getQuestions} disabled={loading}>
        {loading ? 'Loading...' : 'Generate Questions'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {questions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Questions:</h2>
          <ol>
            {questions.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong>
                <p style={{ fontStyle: 'italic', color: '#666' }}>{q.context || 'No context provided'}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}