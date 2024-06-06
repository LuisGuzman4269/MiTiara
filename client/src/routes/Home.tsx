import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import login from '../resources/User_cicrle.png';
import './Home.css';
import CategoryBar from '../components/CategoryBar/CategoryBar';
import ListingCard from '../components/ListingSection/ListingCard';
import SearchBar from '../components/SearchBar/SearchBar';


interface Listing {
    id: number;
    category: string;
    title: string;
    rating: number;
    price: string;
    imageUrl: string;
  }

//Used for Testing Purposes, can prob populate 
  const listingsData: Listing [] = [
    { id: 1, category: 'Venue', title: 'Venue Test', rating: 5, price: '200$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
    { id: 2, category: 'Venue', title: 'Venue Test1', rating: 5, price: '2000$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
    { id: 3, category: 'Venue', title: 'Venue Test2', rating: 5, price: '20000$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
    { id: 4, category: 'Venue', title: 'Venue Test3', rating: 5, price: '20000$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
    { id: 5, category: 'Venue', title: 'Venue Test3', rating: 5, price: '20000$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
    { id: 6, category: 'Venue', title: 'Venue Test3', rating: 5, price: '20000$', imageUrl: 'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg/v1/fill/w_655,h_655,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg' },
  
  
    { id: 7, category: 'Entertainment', title: 'Entertainment Test', rating: 4, price: '100$', imageUrl: 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA' },
    { id: 8, category: 'Catering', title: 'Catering Test', rating: 3, price: '150$', imageUrl: 'url-to-image' },
    { id: 9, category: 'Decoration', title: 'Decoration Test', rating: 3, price: '150$', imageUrl: 'url-to-image' },
    { id: 10, category: 'Photo & Video', title: 'Photo & Video Test', rating: 3, price: '150$', imageUrl: 'url-to-image' },
    
  ];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  
    useEffect(() => {
      // Filter listings based on search term and category
      const filtered = listingsData.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (listing.category === selectedCategory || selectedCategory === '')
      );
      setFilteredListings(filtered);
    }, [selectedCategory, searchTerm]); 
  
    // const handleSelectCategory = (category: string) => {
    //   setSelectedCategory(category);
    //   setListings(listingsData.filter(listing => listing.category === category));
      
    // };

    const navigate = useNavigate();

    const handleLoginClick = () => {
      navigate('/login');
    };

    const handleHomeClick = () => {
      navigate('/');
    }
    
    return (
  
  
      <div className="App">
        <header className="App-header">
          <div className="logo-title-container">
            <img src={logo} className="App-logo" alt="logo" onClick={handleHomeClick}/>
            {/* <h1 className="App-title">Mi Tiara</h1> */}
            <div className='separator'/>
            <div className='login'onClick={handleLoginClick}>
              <img src={login} className="login-icon" alt="login" />
              <p className="login-text">Login/SignUp</p>
            </div>
          </div>
          <SearchBar placeholder="Search vendors..." onSearch={setSearchTerm} />
          <CategoryBar onCategorySelect={setSelectedCategory} />
        </header>
        <div className="listings-container">
          {filteredListings.map((listing: Listing) => ( 
            <ListingCard
              key={listing.id}
              imageUrl={listing.imageUrl}
              title={listing.title}
              rating={listing.rating}
              price={listing.price}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
      
    );
}

export default Home;