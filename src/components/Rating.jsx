import React from 'react';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Reusable Star Rating Component
 * Renders filled, half-filled (fractional), or empty stars with optional text counter.
 */
const Rating = ({
  value = 0,
  text = '',
  size = 'w-5 h-5',
  color = 'text-amber-400',
  emptyColor = 'text-gray-600',
  showValue = false,
  className = '',
}) => {
  const numericValue = Number(value) || 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${numericValue.toFixed(1)} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((index) => {
          const fillPercentage = Math.max(0, Math.min(100, (numericValue - (index - 1)) * 100));

          if (fillPercentage >= 100) {
            return (
              <Star
                key={index}
                className={`${size} ${color} fill-current transition-colors duration-200`}
              />
            );
          } else if (fillPercentage > 0) {
            return (
              <div key={index} className="relative inline-block">
                <Star className={`${size} ${emptyColor} fill-transparent`} />
                <div
                  className="absolute top-0 left-0 overflow-hidden h-full"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${size} ${color} fill-current`} />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={index}
                className={`${size} ${emptyColor} fill-transparent transition-colors duration-200`}
              />
            );
          }
        })}
      </div>

      {showValue && (
        <span className="text-sm font-bold text-white ml-0.5">
          {numericValue.toFixed(1)}
        </span>
      )}

      {text && <span className="text-gray-400 text-sm ml-1">{text}</span>}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number,
  text: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  emptyColor: PropTypes.string,
  showValue: PropTypes.bool,
  className: PropTypes.string,
};

export default Rating;
