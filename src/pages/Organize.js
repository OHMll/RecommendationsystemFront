import { useState, useEffect, useRef  } from "react";
import Image from "next/image";
import Menubar from "@/components/Menubar";
import SearchIcon from "/public/Search_alt_fill.png";
import CardComponent from "@/components/Organizecard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Trash2 } from 'lucide-react';  // เพิ่ม Trash2

export default function Organize({ items }) {
  // State สำหรับการค้นหาและแสดงผล
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // ผลการค้นหา
  const [selectedItems, setSelectedItems] = useState([]); // รายการที่ผู้ใช้เลือก
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const itemsPerPage = 5; // ✅ แสดง 5 การ์ดต่อหน้า

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // ✅ run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // ฟังก์ชันค้นหา - แสดงเฉพาะผลการค้นหา
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  // ฟังก์ชันเพิ่มไอเทมที่เลือก
  const addItem = (item) => {
    if (!selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // ฟังก์ชัน Clear
  const handleClear = () => {
    setSelectedItems([]); // ล้างเฉพาะรายการที่เลือก
    setSelectedItemId(null);
    setSearchTerm(""); // ล้างคำค้นหา
    setSearchResults([]); // ล้างผลการค้นหา
  };

  // เพิ่มการคำนวณ startIndex และ endIndex
  const calculatePagination = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      startIndex: start,
      endIndex: Math.min(end, selectedItems.length)
    };
  };

  const { startIndex, endIndex } = calculatePagination();

  // แก้ไขฟังก์ชัน nextPage
  const nextPage = () => {
    if (endIndex < selectedItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // แก้ไขฟังก์ชัน prevPage
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-[100vh] w-[100vw]  overflow-y-auto">
      <Menubar />
      <h1 className="text-[24pt] md:text-[36pt] font-bold m-2 md:m-4">Organize</h1>

      {/* Search Bar with Clear Button */}
      <div className="flex items-center gap-2 md:gap-3">  {/* ลด gap จาก 4 เป็น 2 สำหรับ mobile และ 3 สำหรับ desktop */}
        <div className="flex items-center border-2 md:border-4 rounded-lg md:rounded-xl border-[#4F4534] bg-[#FAF6E3] p-1 md:p-2 ml-2 md:ml-4 w-full md:w-[30%]">
          <input
            type="text"
            placeholder='Search e.g. "Earring, Pants"'
            value={searchTerm}
            onChange={handleSearch}
            className="border-none outline-none bg-transparent flex-1 p-0 md:p-1 text-[12pt] md:text-[15pt] text-[#4F4534]"
          />
          <Image src={SearchIcon} alt="search" width={20} height={20} />
        </div>
        {/* Clear Button */}
        <button 
          onClick={handleClear}
          className="flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-lg bg-[#FAF6E3] border-2 border-[#4F4534] hover:bg-gray-100 transition-colors mr-2 md:mr-4" /* เพิ่ม margin-right */
        >
          <Trash2 size={isMobile ? 16 : 20} className="text-[#4F4534]" />
          <span className="text-[#4F4534] font-medium text-sm md:text-base">Clear</span>
        </button>
      </div>

      {/* แสดงผลการค้นหา */}
      {searchTerm && searchResults.length > 0 && (
        <div className="flex items-center gap-1 md:gap-3 mt-4 md:mt-7 mb-4 md:mb-7 ml-2 md:ml-4">
          <div ref={scrollRef} className="flex gap-2 md:gap-3 flex-nowrap overflow-x-auto scrollbar-hide flex-1">
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                className="bg-[#FAF6E3] border border-gray-300 p-1 md:p-2 rounded-md md:rounded-lg flex items-center gap-1 md:gap-2 shadow-sm hover:bg-gray-200 text-sm md:text-base flex-shrink-0"
              >
                {item.name} <span className="text-purple-600 font-bold">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* แสดงการ์ดที่เลือกเท่านั้น */}
      {selectedItems.length > 0 && (
        <div className="flex items-center mt-4 justify-center w-full">
          {!isMobile && (
            <button
              className={`p-2 rounded-full shadow-lg mx-2 ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : "bg-white"
              } hidden md:flex`}
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className={`
            ${isMobile 
              ? 'grid grid-cols-2 gap-4 px-4' 
              : 'flex flex-row gap-4 md:gap-4 w-[90%] justify-center items-center'
            }
          `}>
            {selectedItems.slice(startIndex, endIndex).map((item) => (
              <CardComponent
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
              />
            ))}
          </div>

          {!isMobile && (
            <button
              className={`p-2 rounded-full shadow-lg mx-2 ${
                endIndex >= selectedItems.length ? "opacity-50 cursor-not-allowed" : "bg-white"
              } hidden md:flex`}
              onClick={nextPage}
              disabled={endIndex >= selectedItems.length}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}


// ✅ ใช้ getStaticProps ดึงข้อมูลจาก API
export async function getStaticProps() {
  const res = await fetch("http://localhost:8000/api/organizeinfo");
  const data = await res.json();
  return { props: { items: data }, revalidate: 10 };
}