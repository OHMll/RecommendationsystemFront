import Image from "next/image";

export default function Popup({
  isOpen,
  onClose,
  title,
  spaceSize,
  imageSrc,
  arrangement = [],
  tips = [],
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Figma style */}
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40
          md:hidden
        `}
      >
        <div className="bg-[#D8C3A4] rounded-[18px] w-[90vw] max-w-[340px] mx-auto p-0 relative flex flex-col">
          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-2xl text-[#58482D] font-bold z-10"
            onClick={onClose}
          >
            ×
          </button>
          {/* Image */}
          <div className="w-full flex justify-center mt-4">
            <div className="rounded-[1rem] overflow-hidden w-[90%] h-[180px] bg-white flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={title}
                width={260}
                height={180}
                className="object-cover w-full h-full"
                style={{ objectPosition: "center" }}
              />
            </div>
          </div>
          {/* Title & Size */}
          <div className="px-5 mt-3 mb-2">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[20pt] text-[#2A3663]">{title}</h2>
              <span className="bg-white rounded px-2 py-1 text-[10pt] text-[#58482D] font-bold">
                {spaceSize}
              </span>
            </div>
          </div>
          {/* Arrangement Order */}
          <div className="px-5 mb-2">
            <div className="font-bold text-[13pt] text-[#2A3663] mb-1">
              Arrangement Order
            </div>
            <ol className="list-decimal ml-5 text-[11pt] text-[#58482D] font-medium">
              {arrangement.map((item, idx) => (
                <li key={idx} className="mb-1">
                  {item}
                </li>
              ))}
            </ol>
          </div>
          {/* Little Tips */}
          {tips && tips.length > 0 && (
            <div className="px-5 mb-4">
              <div className="font-bold text-[13pt] text-[#2A3663] mb-1">
                Little Tips!
              </div>
              <ul className="list-disc ml-5 text-[11pt] text-[#58482D] font-medium">
                {tips.map((tip, idx) => (
                  <li key={idx} className="mb-1">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Desktop: เดิม */}
      <div className="fixed inset-0 flex items-center justify-center bg-[#B6AD9D] bg-opacity-50 z-50 hidden md:flex">
        <div className="bg-[#F5EAD6] p-6 rounded-lg shadow-lg w-[100vh] h-[70vh] relative flex flex-col">
          {/* ปุ่มปิด */}
          <button
            className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>

          {/* ✅ Header ส่วนหัว */}
          <div className="flex justify-between items-center bg-[#DAC7A3] px-4 py-2 rounded-md">
            <h2 className="text-2xl font-bold underline">{title}</h2>
            <p className="text-md font-semibold">Space: {spaceSize}</p>
          </div>

          {/* ✅ เนื้อหาหลัก */}
          <div className="flex mt-4">
            {/* 📌 คอลัมน์ซ้าย: รูปภาพ */}
            <div className="w-1/2 flex justify-center items-center">
              <Image
                src={imageSrc}
                alt="Popup Image"
                width={300} // ✅ เพิ่ม width
                height={200} // ✅ เพิ่ม height
                className="w-[90%] h-[90%] object-contain rounded-lg shadow-md"
              />
            </div>

            {/* 📌 คอลัมน์ขวา: ข้อมูล Arrangement Order & Tips */}
            <div className="w-1/2 flex flex-col justify-start p-4 bg-[#FDF8E3] rounded-md shadow-inner">
              {/* ✅ Arrangement Order */}
              <h3 className="text-lg font-bold mb-2">Arrangement Order</h3>
              <ul className="list-decimal list-inside text-gray-700 text-md">
                {arrangement.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* ✅ Little Tips */}
              <h3 className="text-lg font-bold mt-4">Little Tips!</h3>
              <ul className="list-disc list-inside text-gray-600 text-md">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
