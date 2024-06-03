import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import CategoryBar from './components/CategoryBar/CategoryBar';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
        <CategoryBar />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
