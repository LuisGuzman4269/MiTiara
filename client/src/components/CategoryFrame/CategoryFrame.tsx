import React from 'react';
import './CategoryFrame.css';

interface CategoryFrameProps {
  label: string;
  frameClass: string;
  onClick: () => void;
  selected: boolean;
  icon: string;
  labelWidth: string;
}

const CategoryFrame: React.FC<CategoryFrameProps> = ({
  label,
  frameClass,
  onClick,
  selected,
  icon,
  labelWidth
}) => (
  <div className={`${frameClass} category-frame ${selected ? 'selected' : ''}`} onClick={onClick}>
    <div className="icon" style={{ backgroundImage: `url(${icon})` }}></div>
    <div className="label" style={{ width: labelWidth }}>{label}</div>
    {selected && <div className="vector"></div>}
  </div>
);

export default CategoryFrame;