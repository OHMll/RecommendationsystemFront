import Image from "next/image";
import { Afacad } from "next/font/google"; // Import Afacad
import Home from "/src/pages/Home";

const afacadFont = Afacad({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-afacad", // ใช้ตัวแปร CSS เพื่อให้ใช้งานกับ Tailwind ได้
});

export default function Main() {
  return (
    <div className={`${afacadFont.variable} font-afacad min-h-screen`}>
      <Home/>
    </div>
  );
}
