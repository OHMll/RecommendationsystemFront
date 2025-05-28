import React, { useState, useEffect } from 'react';
import { Afacad } from "next/font/google";
import Image from "next/image";
import Logo from "/public/Group 40.png";
import { useRouter } from "next/router";
import { LogOut } from 'lucide-react';

const afacadFont = Afacad({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-afacad",
});

export default function Menubar({ 
  onLoginModalToggle, 
  onSignupModalToggle
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    setIsLoggedIn(!!token);
    setUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername('');
    if (router.pathname !== '/Home') {
      router.push('/Home').then(() => window.location.reload());
    } else {
      window.location.reload();
    }
  };

  const handleProtectedRoute = (route) => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push(route);
    } else {
      if (onLoginModalToggle) onLoginModalToggle(true);
    }
  };

  return (
    <div className={`${afacadFont.variable} font-afacad pt-1 pb-1 pl-4 pr-4`}>
      {/* Mobile: Logo ใหญ่ขึ้น, อื่นๆเหมือนเดิม */}
      <div className="flex flex-row items-center justify-between w-full md:hidden">
        {/* Logo ซ้าย (ใหญ่ขึ้นอีก) */}
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => router.push("/Home")} className="w-[80px] h-[80px]">
            <Image src={Logo} alt="Logo" />
          </button>
        </div>
        {/* เมนูตรงกลาง */}
        <div className="flex flex-row items-center justify-center flex-1 mx-2 gap-4">
          <button
            onClick={() => handleProtectedRoute("/Organize")}
            className="font-bold text-[13pt] text-[#2A3663] hover:underline"
            style={{ fontWeight: 700 }}
          >
            Organize
          </button>
          <button
            onClick={() => handleProtectedRoute("/Todolist")}
            className="font-bold text-[13pt] text-[#2A3663] hover:underline"
            style={{ fontWeight: 700 }}
          >
            To-Do
          </button>
          <button
            onClick={() => handleProtectedRoute("/Ideas")}
            className="font-bold text-[13pt] text-[#2A3663] hover:underline"
            style={{ fontWeight: 700 }}
          >
            Ideas
          </button>
        </div>
        {/* Profile/ปุ่ม Login/Signup ขวา */}
        <div className="flex-shrink-0 flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center bg-[#B59F78] rounded-[10px] px-3 py-1 min-w-[70px] justify-center">
              <span className="text-white font-bold text-[13pt]">{username}</span>
              <button onClick={handleLogout} className="text-white ml-2">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <button
                onClick={() => onLoginModalToggle && onLoginModalToggle(true)}
                className="bg-[#B59F78] rounded-[10px] px-3 py-1 font-bold text-[11pt] text-white w-[80px] mb-1"
                style={{ fontWeight: 700 }}
              >
                Login
              </button>
              <button
                onClick={() => onSignupModalToggle && onSignupModalToggle(true)}
                className="bg-[#B59F78] rounded-[10px] px-3 py-1 font-bold text-[11pt] text-white w-[80px]"
                style={{ fontWeight: 700 }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Desktop: original */}
      <div className="hidden md:flex justify-between">
        <button onClick={() => router.push("/Home")} className="w-[10%] h-[10%]">
          <Image src={Logo} alt="Logo" />
        </button>
        <div className="flex justify-end w-[50%]">
          <div className="bg-[#2A3663] flex justify-around m-2 w-[70%] rounded-[10px]">
            <button onClick={() => handleProtectedRoute("/Organize")} className="flex items-center justify-center font-bold text-[24pt] w-[60%] transition-all duration-500 ease-in-out hover:bg-[#131b38] hover:rounded-l-[1rem]">
              <h1 className="text text-white">Organize</h1>
            </button>
            <button onClick={() => handleProtectedRoute("/Todolist")} className="flex items-center justify-center font-bold text-[24pt] w-[60%] transition-all duration-500 ease-in-out hover:bg-[#131b38]">
              <h1 className="text text-white">To-do List</h1>
            </button>
            <button onClick={() => handleProtectedRoute("/Ideas")} className="flex items-center justify-center font-bold text-[24pt] w-[60%] transition-all duration-500 ease-in-out hover:bg-[#131b38] hover:rounded-r-[1rem]">
              <h1 className="text text-white">Ideas</h1>
            </button>
          </div>
          {/* ปุ่ม Login/Sign Up หรือ User */}
          {isLoggedIn ? (
            <div className="flex justify-around items-center m-2 max-w-[30%] bg-[#B59F78] rounded-[10px]">
              <div className="flex items-center w-full justify-between px-4">
                <div className="flex items-center">
                  <span className="text-white font-bold text-[20pt] mr-4">{username}</span>
                </div>
                <button onClick={handleLogout} className="text-white font-bold">
                  <LogOut />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-around items-center m-2 w-[30%] bg-[#B59F78] rounded-[10px]">
              <button 
                onClick={() => onLoginModalToggle && onLoginModalToggle(true)} 
                className="font-bold text-[24pt] text-white"
              >
                Login
              </button>
              <button 
                onClick={() => onSignupModalToggle && onSignupModalToggle(true)} 
                className="font-bold text-[24pt] text-white ml-4"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}