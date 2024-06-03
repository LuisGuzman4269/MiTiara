import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import CategoryBar from './components/CategoryBar/CategoryBar';
import ListingCard from './components/ListingSection/ListingCard';

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
        <div>
        <ListingCard imageUrl="https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg" title="Monday" rating={8} price={"AM"} onClick={() => {}} />
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
