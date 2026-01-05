import React from 'react';
import BentoBox from './BentoBox';

const ParagraphBox = ({ content, gridArea }) => {
  const paragraphs = [
    "Welcome to our interactive bento box website! This is a space for creativity and connection. Each section is designed to provide a unique experience, from sharing thoughts to creating art.",
    "The bento grid layout represents the organized yet flexible nature of Japanese lunch boxes. Each compartment holds something special, waiting to be discovered. Refresh the page to see the layout rearrange itself in surprising ways!",
    "Technology and art converge here. Use the drawing board to express yourself visually, or share your thoughts in the message box. Everything you create is saved for later viewing and appreciation."
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