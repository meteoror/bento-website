import React, { ReactNode } from 'react';

interface BentoBoxProps {
  children: ReactNode;
  gridArea: string;
  className?: string;
  style?: React.CSSProperties;
}

const BentoBox: React.FC<BentoBoxProps> = ({ children, gridArea, className = '', style = {} }) => {
  return (
    <div 
      className={`bento-box ${className}`}
      style={{
        ...style,
        gridArea: gridArea,
      }}
    >
      {children}
    </div>
  );
};

export default BentoBox;