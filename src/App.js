import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const data = JSON.parse(jsonInput);
      const res = await axios.post('https://your-heroku-app.herokuapp.com/bfhl', { data });
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or server error');
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const renderResponse = () => {
    if (!response) return null;

    let filteredData = [];
    switch (filter) {
      case 'numbers':
        filteredData = response.numbers;
        break;
      case 'alphabets':
        filteredData = response.alphabets;
        break;
      case 'highest_lowercase_alphabet':
        filteredData = response.highest_lowercase_alphabet;
        break;
      default:
        filteredData = [
          ...response.numbers,
          ...response.alphabets,
          ...response.highest_lowercase_alphabet
        ];
    }

    return (
      <div>
        <h3>Response Data:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Flask API Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON data here, e.g., {"data": ["A", "C", "z"]}'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <label>
            Filter:
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="numbers">Numbers</option>
              <option value="alphabets">Alphabets</option>
              <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
            </select>
          </label>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
