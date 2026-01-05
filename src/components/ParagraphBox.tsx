// src/components/ParagraphBox.tsx
import React from 'react';
import BentoBox from './BentoBox';

interface ParagraphBoxProps {
  content?: string;
  gridArea: string;
}

const ParagraphBox: React.FC<ParagraphBoxProps> = ({ content, gridArea }) => {
  const paragraphs = [
    "Welcome to our interactive bento box website! This is a space for creativity and connection.",
    "The bento grid layout represents the organized yet flexible nature of Japanese lunch boxes.",
    "Technology and art converge here. Use the drawing board to express yourself visually."
  ];

  const displayContent = content || paragraphs[Math.floor(Math.random() * paragraphs.length)];

  return (
    <BentoBox gridArea={gridArea} className="paragraph-box">
      <div className="content">
        {displayContent}
      </div>
    </BentoBox>
  );
};

export default ParagraphBox;