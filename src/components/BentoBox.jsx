import React from 'react';

const BentoBox = ({ children, gridArea, className = '', style = {} }) => {
  return (
    <div 
      className={`bento-box ${className}`}
      style={{
        ...style,
        '--grid-area': gridArea,
      }}
    >
      {children}
    </div>
  );
};

export default BentoBox;