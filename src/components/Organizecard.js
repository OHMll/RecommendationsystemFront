import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

export default function OrganizeCard({ item, isSelected, onClick }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Mobile popup component
  const MobilePopup = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[90%] max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">{item.name}</h2>
        <div className="mb-4">
          <Image
            src={item.imageSrc}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <p className="text-gray-700 mb-4">{item.description}</p>
        {/* Details section */}
        <div className="space-y-4">
          {item.details?.map((detail, idx) => (
            <p key={idx} className="text-gray-600">{detail}</p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#B59F78] text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          onClick={onClick}
        >
          <div className="relative h-32">
            <Image
              src={item.imageSrc}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-bold text-[14pt] text-[#58482D] truncate">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{item.description}</p>
          </div>
        </div>
        {isSelected && <MobilePopup onClose={() => onClick()} />}
      </>
    );
  }

  // Desktop version - unchanged
  return (
    <motion.div
      initial={{ width: "30vh" }}
      animate={
        isSelected
          ? { width: '600px' }
          : { width: '250px' }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`overflow-hidden flex flex-col md:flex-row relative cursor-pointer transition-all
        ${!isSelected ? 'bg-white rounded-2xl shadow-md' : ''} 
        ${isSelected ? 'h-[40vh] md:h-[450px]' : 'h-auto md:h-[450px]'} md:bg-white md:rounded-2xl md:shadow-md`}
      onClick={onClick}
    >
      {/* รูปภาพ - ขนาดคงที่ */}
      <div className={`
        ${isSelected ? 'hidden md:block' : 'block'} 
        w-full md:w-[250px] flex-shrink-0 h-48 md:h-full relative 
        ${!isSelected ? 'rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none' : ''}`
      }>
        <Image
          src={item.imageSrc}
          alt={item.name}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-l-2xl"
        />
        {/* ✅ Gradient Overlay */}
        <div className="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-[#D8DBBD] to-transparent"></div>
        {/* ✅ ชื่อไอเท็ม */}
        <div className="absolute bottom-0 w-full p-2 text-center text-black text-[20pt] font-bold pl-3">
          {item.name}
        </div>
      </div>

      {/* ข้อมูล - ส่วนที่ขยาย */}
      {isSelected && (
        <motion.div
          initial={{ width: 20, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#FAF3E0] p-6 shadow-lg rounded-r-2xl flex-1 overflow-y-auto"
        >
          <h2 className="text-lg md:text-xl font-bold">{item.description}</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2 text-md">
            {item.details.map((detail, index) => (
              <li key={index}> {detail}</li>
            ))}
          </ul>
          <h3 className="mt-3 md:mt-4 font-bold text-base md:text-lg">DIY Ideas</h3>
          <ul className="list-disc pl-5 space-y-2 text-md">
            {item.diyIdeas.map((idea, index) => (
              <li key={index}> {idea}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}