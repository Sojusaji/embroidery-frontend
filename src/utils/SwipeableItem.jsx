import React, { useState, useRef, useEffect } from 'react';

export default function SwipeableItem({
  children,
  leftAction,
  rightAction,
  isConfirming = false,
  className = ""
}) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const hasMovedRef = useRef(false);
  const pointerIdRef = useRef(null);

  // Reset offset when confirmation state changes
  useEffect(() => {
    if (isConfirming) {
      setOffset(0);
    }
  }, [isConfirming]);

  const maxRight = rightAction?.width || 120;
  const maxLeft = leftAction?.width || 120;

  const rightThreshold = maxRight * 0.8;
  const leftThreshold = maxLeft * 0.8;

  const handlePointerDown = (e) => {
    if (isConfirming) return;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    currentOffsetRef.current = offset;
    hasMovedRef.current = false;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // Fallback safely if capture fails
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;

    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true;
    }

    let newOffset = currentOffsetRef.current + diff;
    const limit = maxLeft > maxRight ? maxLeft + 40 : maxRight + 40;
    
    if (newOffset < -limit) newOffset = -limit;
    if (newOffset > limit) newOffset = limit;

    setOffset(newOffset);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (pointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      } catch (err) {
        // Ignore if pointer capture was already lost
      }
      pointerIdRef.current = null;
    }

    // Snap logic based on thresholds
    if (offset < 0) {
      setOffset(Math.abs(offset) >= rightThreshold ? -maxRight : 0);
      return;
    }

    if (offset > 0) {
      setOffset(offset >= leftThreshold ? maxLeft : 0);
      return;
    }

    setOffset(0);
  };

  const handleClick = (e) => {
    if (offset !== 0 && !hasMovedRef.current) {
      e.stopPropagation();
      setOffset(0);
    }
  };

  const isSwipingLeft = offset < 0;
  const isSwipingRight = offset > 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 flex items-center z-0 bg-zinc-950 rounded-2xl overflow-hidden"
        onClick={() => setOffset(0)}
      >
        {/* Swiping Right reveals LEFT action */}
        {isSwipingRight && (
          leftAction?.node ? leftAction.node : (
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-600 flex items-center pl-6 text-white font-bold gap-2 overflow-hidden"
              style={{ width: `${maxLeft}px` }}
            >
              <span className="text-xl">✏️</span>
              <span>Edit</span>
            </div>
          )
        )}

        {/* Swiping Left reveals RIGHT action */}
        {isSwipingLeft && (
          rightAction?.node ? rightAction.node : (
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-600 flex items-center justify-end pr-6 text-white font-bold gap-2 overflow-hidden"
              style={{ width: `${maxRight}px` }}
            >
              <span>Delete</span>
              <span className="text-xl">🗑️</span>
            </div>
          )
        )}
      </div>

      {/* FOREGROUND CARD LAYER */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        style={{ 
          transform: `translateX(${offset}px)`,
          touchAction: 'pan-y' 
        }}
        className={`relative z-10 bg-zinc-900 transition-transform ${
          isDragging ? 'duration-0' : 'duration-300 ease-out'
        } select-none`}
      >
        {children}
      </div>
    </div>
  );
}