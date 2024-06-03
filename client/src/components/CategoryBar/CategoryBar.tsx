import React, { useState } from 'react';
import CategoryFrame from '../CategoryFrame/CategoryFrame';
import './CategoryBar.css';

import venueIcon from '../../resources/VenueFrame.png';
import entertainmentIcon from '../../resources/EntertainmentFrame.png';
import cateringIcon from '../../resources/CateringFrame.png';
import decorationIcon from '../../resources/DecorationFrame.png';
import photoVideoIcon from '../../resources/P&VFrame.png';


const categories = [
  { label: 'Venue', frameClass: 'venue-category-frame1', icon: venueIcon, labelWidth: '49px' },
  { label: 'Entertainment', frameClass: 'entertainment-category-frame2', icon: entertainmentIcon, labelWidth: '109px' },
  { label: 'Catering', frameClass: 'catering-category-frame3', icon: cateringIcon, labelWidth: '66px' },
  { label: 'Decoration', frameClass: 'decoration-category-frame4', icon: decorationIcon, labelWidth: '84px' },
  { label: 'Photo & Video', frameClass: 'photo-video-category-frame5', icon: photoVideoIcon, labelWidth: '109px' },
];

const CategoryBar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="category-bar">
      {categories.map((category, index) => (
        <CategoryFrame
          key={index}
          label={category.label}
          frameClass={category.frameClass}
          onClick={() => handleCategoryClick(category.label)}
          selected={selectedCategory === category.label}
          icon={category.icon}
          labelWidth={category.labelWidth}
        />
      ))}
    </div>
  );
};

export default CategoryBar;