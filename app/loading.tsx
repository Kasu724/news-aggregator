export default function Loading() {
  const skeletonCards = Array.from({ length: 15 });

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-x-5 gap-y-8 bg-gray-50">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden shadow-sm flex flex-col animate-pulse bg-white"
          style={{
            animationDelay: `${index * 0.3}s`,
            animationDuration: "1.5s",
          }}
        >
          {/* Thumbnail (gray box) */}
          <div className="w-full overflow-hidden rounded-lg aspect-[16/9] bg-gray-400" />
  
          {/* Text area */}
          <div className="p-4 flex-grow flex flex-col justify-center">
            {/* Headline skeleton line */}
            <div className="h-4 bg-gray-300 rounded-lg w-full mb-3" />
            <div className="h-4 bg-gray-300 rounded-lg w-full mb-3" />
            <div className="h-4 bg-gray-300 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </section>
  );
}