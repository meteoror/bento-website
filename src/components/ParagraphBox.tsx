import React from 'react';
import BentoBox from './BentoBox';

interface ParagraphBoxProps {
  content?: string;
  gridArea: string;
}

const ParagraphBox: React.FC<ParagraphBoxProps> = ({ content, gridArea }) => {
  const paragraphs = [
    "Welcome to Bento Space! This dynamic grid merges organization with creativity. Each compartment serves a unique purpose—from creative expression to thoughtful sharing. The layout randomizes with every refresh, creating a fresh experience each time.",
    "Inspired by Japanese lunch boxes, this layout celebrates orderly chaos. Each element has its place while contributing to a harmonious whole. Drag to draw, type to share, and enjoy the visual feast!",
    "Here, technology meets artistry. Sketch your thoughts, share your messages, and immerse yourself in curated visuals. Every interaction is preserved locally for your personal reflection."
  ];

  const displayContent = content || paragraphs[Math.floor(Math.random() * paragraphs.length)];

  return (
    <BentoBox gridArea={gridArea} className="paragraph-box">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-success rounded-circle p-2 me-3">
          <i className="bi bi-text-paragraph text-white"></i>
        </div>
        <h5 className="mb-0" style={{ color: 'var(--accent-green)' }}>
          Thoughts & Ideas
        </h5>
      </div>
      <p className="text-muted mb-0 lh-lg">
        {displayContent}
      </p>
      <div className="mt-3 pt-3 border-top border-secondary">
        <small className="text-muted">
          <i className="bi bi-arrow-repeat me-1"></i>
          Refresh for new layout
        </small>
      </div>
    </BentoBox>
  );
};

export default ParagraphBox;