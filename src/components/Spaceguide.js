import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Popup from "./PopupCard";

export default function Spaceguide({ imageSrc, title, description, extraInfo, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTitleOverflow, setIsTitleOverflow] = useState(false);
  const [isDescOverflow, setIsDescOverflow] = useState(false);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  // ✅ ตรวจสอบว่า title และ description ยาวเกินขนาด div หรือไม่
  useEffect(() => {
    if (titleRef.current) {
      setIsTitleOverflow(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
    if (descRef.current) {
      setIsDescOverflow(descRef.current.scrollWidth > descRef.current.clientWidth);
    }
  }, [title, description]);

  return (
    <>
      {/* ✅ เพิ่ม group เพื่อจัดการ hover */}
      <div className="group relative w-full max-w-sm h-full flex rounded-[1rem] overflow-hidden shadow-lg cursor-pointer" onClick={() => setIsOpen(true)}>
        <Image 
          src={imageSrc} 
          alt={title} 
          width={300}  
          height={200}  
          className="w-full h-full object-cover" 
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#D8DBBD] to-[#ffffff00] opacity-70"></div>
        <div className="absolute bottom-4 left-4 text-white w-[80%]">
          
          {/* ✅ Hover แสดงชื่อเต็ม */}
          <div className="relative">
            <h3
              ref={titleRef}
              className={`text-black font-bold ${
                isMobile 
                  ? 'text-[16pt] w-[150px]' 
                  : 'text-[24pt] w-[200px]'
              }`}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {title}
            </h3>
            {/* ✅ Tooltip สำหรับชื่อ */}
            {isTitleOverflow && (
              <div className="invisible group-hover:visible absolute bottom-full left-0 bg-black text-white text-sm p-2 rounded-md shadow-md w-auto max-w-xs z-20 whitespace-normal">
                {title}
              </div>
            )}
          </div>

          {/* ✅ Hover แสดง description เต็ม */}
          <div className="relative mt-1">
            <p
              ref={descRef}
              className={`text-black font-bold ${
                isMobile 
                  ? 'text-[12pt] w-[150px]' 
                  : 'text-md w-[200px]'
              }`}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {description}
            </p>
            {/* ✅ Tooltip สำหรับ description */}
            {isDescOverflow && (
              <div className="invisible group-hover:visible absolute bottom-full left-0 bg-black text-white text-sm p-2 rounded-md shadow-md w-auto max-w-xs z-20 whitespace-normal">
                {description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Popup รับข้อมูลจาก extraInfo */}
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        spaceSize={description}
        imageSrc={imageSrc}
        arrangement={extraInfo?.arrangement ?? []}
        tips={extraInfo?.tips ?? []}
      />
    </>
  );
}