import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import login from '../resources/User_cicrle.png';
import './Home.css';
import CategoryBar from '../components/CategoryBar/CategoryBar';
import ListingCard from '../components/ListingSection/ListingCard';
import SearchBar from '../components/SearchBar/SearchBar';

interface VendorBio {
  bioDescription: string;
  bioImages: string[];
}

interface VendorAvailability {
  dayOfWeek: string;
  startTime: Date;
  endTime: Date;
}

interface SearchQuery {
  name: string;
  city: string;
  state: string;
  date: Date | null;
}

interface Listing {
  id: number;
  vendorName: string;
  vendorCity: string;
  vendorState: string;
  vendorBio: VendorBio;
  vendorAvailability: VendorAvailability[];
  vendorCategories: string[];
  rating: number;
  price: number;
  imageUrl: string[];
}

const listingsData: Listing [] = [
  {
    id: 1,
    vendorName: 'Venue Test',
    vendorCity: 'Test',
    vendorState: 'California',
    vendorBio: {
      bioDescription: 'A beautiful venue for all types of events.',
      bioImages: [
        'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
      ]
    },
    vendorAvailability: [
      {
        dayOfWeek: 'Friday',
        startTime: new Date('2022-06-06T09:00'),
        endTime: new Date('2025-01-01T17:00')
      }
    ],
    vendorCategories: ['Venue'],
    rating: 5,
    price: 200,
    imageUrl: [
      'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
    ]
  },
  {
    id: 2,
    vendorName: 'Venue Test2',
    vendorCity: 'Test2',
    vendorState: 'Sample State',
    vendorBio: {
      bioDescription: 'A beautiful venue for all types of events.',
      bioImages: [
        'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
      ]
    },
    vendorAvailability: [
      {
        dayOfWeek: 'Monday',
        startTime: new Date('2024-01-01T09:00'),
        endTime: new Date('2025-01-01T17:00')
      }
    ],
    vendorCategories: ['Venue'],
    rating: 5,
    price: 200,
    imageUrl: [
      'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
    ]
  },
  {
    id: 3,
    vendorName: 'Venue Test3',
    vendorCity: 'Test3',
    vendorState: 'Sample State',
    vendorBio: {
      bioDescription: 'A beautiful venue for all types of events.',
      bioImages: [
        'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
      ]
    },
    vendorAvailability: [
      {
        dayOfWeek: 'Monday',
        startTime: new Date('2024-01-01T09:00'),
        endTime: new Date('2025-01-01T17:00')
      }
    ],
    vendorCategories: ['Venue'],
    rating: 5,
    price: 200,
    imageUrl: [
      'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
    ]
  },
  {
    id: 4,
    vendorName: 'Entertainment Test',
    vendorCity: 'Sample City',
    vendorState: 'Sample State',
    vendorBio: {
      bioDescription: 'A beautiful venue for all types of events.',
      bioImages: [
        'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
      ]
    },
    vendorAvailability: [
      {
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T09:00'),
        endTime: new Date('1970-01-01T17:00')
      }
    ],
    vendorCategories: ['Entertainment'],
    rating: 5,
    price: 200,
    imageUrl: [
      'https://static.wixstatic.com/media/7ac599_f316fbd1ac2244b799a5cc4b7bdc47bc~mv2.jpg'
    ]
  },


  {
    id: 5,
    vendorName: 'Catering Test',
    vendorCity: 'Sample City',
    vendorState: 'Sample State',
    vendorBio: {
      bioDescription: 'Premier entertainment services offering diverse performances.',
      bioImages: ['https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA']
    },
    vendorAvailability: [
      {
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T18:00'),
        endTime: new Date('1970-01-01T23:00')
      }
    ],
    vendorCategories: ['Catering'],
    rating: 4,
    price: 100,
    imageUrl: [
      'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA'
    ]
  },


 


];


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({ name: '', city: '', state: '', date: null });
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listingsData);

  useEffect(() => {
    const filtered = listingsData.filter(listing =>
      (selectedCategory ? listing.vendorCategories.includes(selectedCategory) : true) &&
      (searchQuery.name ? listing.vendorName.toLowerCase().includes(searchQuery.name.toLowerCase()) : true) &&
      (searchQuery.city ? listing.vendorCity.toLowerCase() === searchQuery.city.toLowerCase() : true) &&
      (searchQuery.state ? listing.vendorState.toLowerCase() === searchQuery.state.toLowerCase() : true) &&
      (!searchQuery.date || listing.vendorAvailability.some(avail =>
        new Date(avail.startTime).toDateString() === (searchQuery.date ? new Date(searchQuery.date).toLocaleDateString() : "")
      ))
    );
    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory]);  // Ensures filtering logic runs only when searchQuery or selectedCategory changes.

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-title-container">
          <img src={logo} className="App-logo" alt="logo" onClick={handleHomeClick} />
          <div className='separator'/>
          <div className='login' onClick={handleLoginClick}>
            <img src={login} className="login-icon" alt="login" />
            <p className="login-text">Login/SignUp</p>
          </div>
        </div>
        <SearchBar placeholder="Search vendors..." onSearch={setSearchQuery} />
        <CategoryBar onCategorySelect={setSelectedCategory} />
      </header>
      <div className="listings-container">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            imageUrl={listing.imageUrl[0]}  // Assuming there is at least one image
            title={listing.vendorName}
            rating={listing.rating}
            price={`$${listing.price}`}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
