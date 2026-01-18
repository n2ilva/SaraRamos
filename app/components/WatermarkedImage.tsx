import Image, { ImageProps } from 'next/image';

interface WatermarkedImageProps extends ImageProps {
  className?: string; // Explicitly allow className to be passed through props
}

export default function WatermarkedImage({ className = '', style, ...props }: WatermarkedImageProps) {
  // If fill is true, wrapper needs absolute positioning to match Next.js Image behavior
  const isFill = props.fill;

  return (
    <div 
      className={`relative select-none ${isFill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}
      style={style}
      onContextMenu={(e) => e.preventDefault()} // Disable right click
    >
      <Image {...props} className={`z-0 ${isFill ? 'object-cover' : ''}`} />
      
      {/* Watermark Overlay Grid */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30 flex flex-wrap content-center justify-center gap-12"
        style={{ transform: 'scale(1.5)' }} // Scale up to ensure coverage logic simplifies
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="transform -rotate-45 text-white font-bold text-lg md:text-xl mix-blend-overlay drop-shadow-md whitespace-nowrap text-center"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
          >
            Sara Ramos
            <div className="text-[60%] font-normal italic opacity-90">Pedagoga</div>
          </div>
        ))}
      </div>
    </div>
  );
}
