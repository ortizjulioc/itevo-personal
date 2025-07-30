import React from 'react';
import Tooltip from '../ui/tooltip';

interface TextEllipsisProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TextEllipsis: React.FC<TextEllipsisProps> = ({
  text,
  maxLength = 30,
  className = '',
}) => {
  const isTruncated = text.length > maxLength;
  const displayedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {isTruncated ? (
        <Tooltip title={text}>
          <span>{displayedText}</span>
        </Tooltip>
      ) : (
        <span>{displayedText}</span>
      )}
    </div>
  );
};

export default TextEllipsis;
