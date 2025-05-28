import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function IdeaCard({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative cursor-pointer w-full" onClick={() => setIsOpen(true)}>
      {/* Background image + Gradient */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-xl overflow-hidden">
        {!!item.image && ( 
          <Image 
            src={item.image} 
            alt={item.name} 
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D8DBBD] to-transparent opacity-70"></div>
        {/* Show name on both mobile and desktop */}
        <h2 className="absolute bottom-4 left-4 text-[#131b38] text-2xl sm:text-3xl md:text-4xl font-bold">
          {item.name}
        </h2>
      </div>

      {/* Popup Modal */}
      {isOpen && (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full h-full md:h-[80%] md:max-w-[80%] rounded-lg shadow-lg overflow-hidden relative flex flex-col md:flex-row p-8 md:p-0 box-border"
          onClick={(e) => e.stopPropagation()}
        > 
        {/* ✅ Div เฉพาะมือถือ */}
        <div className="md:hidden p-4 "></div>
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors z-10"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Section */}
          <div className="relative w-full max-w-full h-[350px] md:w-1/2 md:h-auto md:mx-0 rounded-xl overflow-hidden">
            {!!item.image && (
              <Image 
                src={item.image} 
                alt={item.name} 
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col h-full">
            {/* Static Header */}
            <div className="p-4 md:p-6">
              {/* Show room name on mobile only */}
              <h2 className="block md:hidden text-2xl font-bold mb-2">{item.name}</h2>
              <h2 className="hidden md:block text-2xl md:text-3xl font-bold mb-4">{item.name}</h2>
              <p className="text-gray-700 text-base md:text-lg">{item.description}</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-6">
              {/* Theme Colors */}
              {item.theme_color?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Theme Colors:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.theme_color.map((color, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-gray-200 text-sm">{color}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Decor */}
              {item.decor?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Decor:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {item.decor.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Lighting */}
              {item.lighting?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Lighting:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {item.lighting.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Furniture */}
              {item.furniture?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Furniture:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {item.furniture.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Plants */}
              {item.plants?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Plants:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {item.plants.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Tips */}
              {item.tips?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Tips:</h4>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {item.tips.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Any other fields */}
            </div>
          </div>
        </motion.div>
      </div>
    )}

    </div>
  );
}