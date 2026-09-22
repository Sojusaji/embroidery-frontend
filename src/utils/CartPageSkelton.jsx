export default function CartSkeleton() {
  // Render 3 dummy skeleton items to mimic a loading cart list
  const skeletonItems = [1, 2, 3];

  return (
    <div className="space-y-4">
      {skeletonItems.map((index) => (
        <div
          key={index}
          className="flex gap-4 p-3 rounded-2xl glass-panel bg-white/5 animate-pulse"
        >
          {/* Skeleton for Product Image */}
          <div className="w-20 h-24 rounded-xl bg-gray-700/50 shrink-0" />

          {/* Skeleton for Content Area */}
          <div className="flex-1 flex flex-col justify-between py-1">
            {/* Top Row: Title and Delete Button */}
            <div className="flex justify-between items-start">
              {/* Title Skeleton */}
              <div className="h-4 bg-gray-700/50 rounded-md w-3/5" />
              {/* Trash Icon Skeleton */}
              <div className="w-6 h-6 bg-gray-700/50 rounded-md" />
            </div>

            {/* Bottom Row: Price and Quantity Controls */}
            <div className="flex justify-between items-center mt-2">
              {/* Price Skeleton */}
              <div className="h-5 bg-gray-700/50 rounded-md w-16" />

              {/* Quantity Pill Controls Skeleton */}
              <div className="flex items-center gap-3 bg-black/20 rounded-full px-3 py-1.5 w-24 h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}