import React from 'react';
import './ListingCard.css'

interface ListingCardProps {
  imageUrl: string;
  title: string;
  rating: number;
  price: string;
  onClick: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ imageUrl, title, rating, price, onClick }) => {
  return (
    <div className="listing-card" onClick={onClick}>
      <div className="image-container">
        <img src={imageUrl} alt="Venue" className="venue-image" />
      </div>
      <div className="content">
        <h2 className="title">{title}</h2>
        <div className="rating">Rating: {rating}</div>
        <div className="price">Price: {price}</div>
      </div>
    </div>
  );
}

export default ListingCard;