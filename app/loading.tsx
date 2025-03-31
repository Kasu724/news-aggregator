// app/loading.tsx
export default function Loading() {
    // Number of skeleton cards to display
    const skeletonCards = Array.from({ length: 15 });
  
    return (
      <section className="min-h-screen grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-y-8 bg-gray-50">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="w-80 h-80 rounded-lg overflow-hidden shadow-sm flex flex-col animate-pulse bg-white"
            style={{
              animationDelay: `${index * 0.3}s`, // stagger delay for each card
              animationDuration: "1.5s", // total duration of the pulse animation
            }}
          >
            {/* Thumbnail (gray box) */}
            <div className="w-full h-50 bg-gray-400" />
    
            {/* Text area */}
            <div className="p-4 flex-grow flex flex-col justify-center">
              {/* Headline skeleton line */}
              <div className="h-4 bg-gray-300 rounded-lg w-full mb-3" />
              <div className="h-4 bg-gray-300 rounded-lg w-full mb-3" />
              {/* Publisher skeleton line */}
              <div className="h-4 bg-gray-300 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </section>
    );
  }