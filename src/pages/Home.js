import { useRef, useState, useEffect } from "react";
import Menubar from "@/components/Menubar";
import Image from "next/image";
import Spaceguide from "@/components/Spaceguide";
import { useRouter } from "next/router";
import OrganizePage from "/public/home.jpg";
import LoginModal from "@/components/Loginpopup";
import SignupModal from "@/components/Signuppopup";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [spaceData, setSpaceData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Check login status when page loads
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
    
    // Validate token with server
    if (storedToken) {
      fetch('http://localhost:8000/check-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: storedToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Token is valid') {
            setIsLoggedIn(true);
            setUsername(data.user?.username || storedUsername);
          } else {
            setIsLoggedIn(false);
            setUsername('');
          }
        })
        .catch((error) => {
          setIsLoggedIn(false);
          setUsername('');
          console.error('Error checking token:', error);
        });
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/sginfo")
      .then((res) => res.json())
      .then((data) => setSpaceData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingRooms(false);
        setRooms([]);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(response.data);
      } catch (error) {
        setRooms([]);
        // ไม่ต้อง throw error
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [isLoggedIn]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.children[0].clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, [spaceData]);

  const handleProtectedRoute = (route) => {
    const storedToken = localStorage.getItem('token');
    
    if (isLoggedIn && storedToken) {
      // Validate token with server before routing
      fetch('http://localhost:8000/check-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: storedToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Token is valid') {
            router.push(route);
          } else {
            // Show login modal if token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setIsLoggedIn(false);
            setShowLoginModal(true);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setShowLoginModal(true);
        });
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSuccessfulLogin = (username, token) => {
    setIsLoggedIn(true);
    setUsername(username);
    setShowLoginModal(false);
    
    // Redirect to protected route if there was a previous attempt
    if (router.query.redirect) {
      router.push(router.query.redirect);
    } else {
      window.location.reload();
    }
  };

  const handleSuccessfulSignup = (username, token) => {
    setIsLoggedIn(true);
    setUsername(username);
    setShowSignupModal(false);
    
    // Redirect to protected route if there was a previous attempt
    if (router.query.redirect) {
      router.push(router.query.redirect);
    } else {
      window.location.reload();
    }
  };

  const toggleLoginModal = (show) => {
    setShowLoginModal(show);
    setShowSignupModal(false);
  };

  const toggleSignupModal = (show) => {
    setShowSignupModal(show);
    setShowLoginModal(false);
  };

  const groupedSpaceData = spaceData.reduce((acc, item, index) => {
    if (index % 3 === 0) acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);

  // คำนวณ overallProgress
  const overallProgress = rooms.length > 0
    ? Math.round(rooms.reduce((sum, r) => sum + (r.progress || 0), 0) / rooms.length)
    : 0;

  function OverallProgressCircle({ percent }) {
    const radius = 80;
    const stroke = 15;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <svg width={radius * 2} height={radius * 2}>
        {/* วงพื้นหลัง */}
        <circle
          stroke="#E5E1D6"
          fill="none"
          strokeWidth={stroke}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
        />
        {/* วง foreground */}
        <circle
          stroke="#8D7C5F"
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.7s' }}
        />
        {/* ตัวเลขตรงกลาง */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="2rem"
          fontWeight="bold"
          fill="#58482D"
        >
          {percent}%
        </text>
      </svg>
    );
  }

  return (
    <div className="h-[100vh] w-[100vw]">
      <Menubar 
        onLoginModalToggle={toggleLoginModal}
        onSignupModalToggle={toggleSignupModal}
        isLoggedIn={isLoggedIn}
        username={username}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Mobile layout */}
      <div className="block md:hidden px-2">
        {/* Dashboard */}
        <h3 className="text-[22pt] font-bold mt-2 mb-2">Dashboard</h3>
        <div className="bg-[#FAF6E3] rounded-[1rem] p-3 flex flex-row gap-2 mb-4 items-stretch">
          {/* Left: Room Progress List */}
          <div className="flex-1 flex flex-col min-w-0 pr-2">
            <div
              className="flex flex-col gap-2 overflow-y-auto"
              style={{ maxHeight: '150px' }} // เพิ่มความสูงจาก 110px เป็น 150px
            >
              {rooms.length > 0 ? (
                rooms.map((room, idx) => (
                  <div key={room._id || idx} className="flex flex-col">
                    <span className="font-semibold text-[#58482D] text-[11pt] mb-1">{room.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#D0C3A4] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${room.progress || 0}%`,
                            background:
                              idx === 0
                                ? '#A05C4E'
                                : idx === 1
                                ? '#A08B6D'
                                : idx === 2
                                ? '#4E7A5C'
                                : '#8D7C5F',
                            transition: 'width 0.5s'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#58482D] font-bold">{room.progress || 0}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">Login to see your tasks progress</div>
              )}
            </div>
          </div>
          {/* Right: Overall Progress Circle */}
          <div className="flex flex-col items-center justify-center pl-2 min-w-[90px]">
            <svg width={60} height={60}>
              <circle
                stroke="#E5E1D6"
                fill="none"
                strokeWidth={7}
                cx={30}
                cy={30}
                r={23}
              />
              <circle
                stroke="#8D7C5F"
                fill="none"
                strokeWidth={7}
                strokeLinecap="round"
                cx={30}
                cy={30}
                r={23}
                strokeDasharray={2 * Math.PI * 23}
                strokeDashoffset={
                  2 * Math.PI * 23 - (overallProgress / 100) * 2 * Math.PI * 23
                }
                style={{ transition: 'stroke-dashoffset 0.7s' }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize="1.2rem"
                fontWeight="bold"
                fill="#58482D"
              >
                {overallProgress}%
              </text>
            </svg>
            <span className="text-[13pt] font-bold text-[#58482D] mt-1">Overall</span>
          </div>
        </div>

        {/* Space Guide */}
        <h3 className="text-[22pt] font-bold mt-2 mb-2">Space Guide</h3>
        <div className="relative flex justify-center">
          {/* Card grid with paging */}
          <MobileSpaceGuide spaceData={spaceData} />
        </div>

        {/* Smart Organizing Hack */}
        <div className="relative mt-4 rounded-[1rem] h-[90px] mb-4">
          <Image src={OrganizePage} alt="Card" className="w-full h-full object-cover rounded-[1rem] object-[60%_70%]" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#B59F78] to-[#ffffff00] bg-opacity-70 rounded-[1rem] flex flex-col items-end">
            <h1 className="m-2 font-bold text-[16pt]">Smart Organizing Hack</h1>
            <button 
              className="m-2 font-bold text-[12pt] transition-transform duration-300 hover:scale-110" 
              onClick={() => handleProtectedRoute("/Organize")}
            >
              Organize Now
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout (unchanged) */}
      <div className="hidden md:block">
        <div className="flex p-3 ml-4 mr-4 h-[45vh] gap-x-3 items-start">
          <div className="flex flex-col w-[50vw]">
            <h3 className="text-[36pt] font-bold mt-0 mb-4">Dashboard</h3>
            {/* FIX: Set a specific height for the container and adjust overflow */}
            <div className="flex flex-row h-[33vh] bg-[#FAF6E3] rounded-[1rem]">
              <div className=" w-[85%] p-4 flex flex-col">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  {!isLoggedIn ? (
                    <div className="text-gray-500 text-center mt-8">Login to see your tasks progress</div>
                  ) : loadingRooms ? (
                    <div>Loading...</div>
                  ) : rooms.length === 0 ? (
                    <div className="text-gray-500">No rooms found</div>
                  ) : (
                    rooms.map(room => (
                      <div key={room._id} className="mb-4 p-3 bg-white rounded-lg shadow ">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-[#58482D]">{room.name}</span>
                          <span className="text-sm text-gray-600">{room.progress || 0}%</span>
                        </div>
                        <div className="bg-gray-200 h-2 w-full rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-500" 
                            style={{ width: `${room.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className=" w-1/2 flex flex-col items-center justify-center h-full">
                <OverallProgressCircle percent={overallProgress} />
                <div className="mt-2 text-[26pt] font-bold text-[#58482D]">Overall</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[50vw] justify-between relative">
            <h3 className="text-[36pt] font-bold mt-0 mb-4">Space Guide</h3>

            {showLeftArrow && (
              <button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center text-gray-800 text-3xl shadow-lg hover:bg-opacity-100 transition-all z-10"
                onClick={() => handleScroll("left")}
                aria-label="Previous cards"
              >
                &#10094;
              </button>
            )}

            <div className="h-[33vh] overflow-hidden relative">
              <div ref={scrollRef} className="flex w-full h-full overflow-x-hidden scroll-smooth">
                {groupedSpaceData.map((group, groupIndex) => (
                  <div key={groupIndex} className="flex justify-around min-w-full gap-x-3 flex-shrink-0">
                    {group.map((item, index) => (
                      <div key={index} className="w-[30%]">
                        <Spaceguide
                          imageSrc={item.imageSrc}
                          title={item.title}
                          description={item.description}
                          extraInfo={{ arrangement: item.arrangement, tips: item.tips }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {showRightArrow && (
              <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center text-gray-800 text-3xl shadow-lg hover:bg-opacity-100 transition-all z-10"
                onClick={() => handleScroll("right")}
                aria-label="Next cards"
              >
                &#10095;
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-5 ml-4 mr-4 rounded-[1rem] h-[30vh]">
          <Image src={OrganizePage} alt="Card" className="w-full h-full object-cover rounded-[1rem] object-[60%_70%]" />

          <div className="absolute inset-0 bg-gradient-to-l from-[#B59F78] to-[#ffffff00] bg-opacity-70 rounded-[1rem] flex flex-col items-end">
            <h1 className="m-3 font-bold text-[32pt]">Smart Organizing Hack</h1>
            <button 
              className="m-3 font-bold text-[24pt] transition-transform duration-300 hover:scale-110" 
              onClick={() => handleProtectedRoute("/Organize")}
            >
              Organize Now
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal Component */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
          setTimeout(() => setShowSignupModal(true), 0);
        }}
        onSuccessfulLogin={handleSuccessfulLogin}
      />

      {/* Signup Modal Component */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => {
          setShowSignupModal(false);
          setShowLoginModal(false);
        }}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(false);
          setTimeout(() => setShowLoginModal(true), 0);
        }}
        onSuccessfulSignup={handleSuccessfulSignup}
      />
    </div>
  );
}

// Add this component inside the same file (below Home component)
function MobileSpaceGuide({ spaceData }) {
  const [page, setPage] = useState(0);
  const cardsPerPage = 4;
  const totalPages = Math.ceil(spaceData.length / cardsPerPage);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const pagedData = spaceData.slice(page * cardsPerPage, (page + 1) * cardsPerPage);

  return (
    <div className="relative">
      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3 min-h-[240px]">
        {pagedData.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden shadow bg-white"
            style={{
              width: '180px',
              height: '200px',
              minWidth: '170px',
              minHeight: '180px',
              maxWidth: '190px',
              maxHeight: '220px'
            }}
          >
            <Spaceguide
              imageSrc={item.imageSrc}
              title={item.title}
              description={item.description}
              extraInfo={{ arrangement: item.arrangement, tips: item.tips }}
              isMobile={true}
            />
          </div>
        ))}
      </div>
      {/* Arrow & More */}
      {totalPages > 1 && (
        <>
          {page > 0 && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
              onClick={handlePrev}
              aria-label="Previous"
              style={{ zIndex: 2 }}
            >
              <span className="text-2xl">{'<'}</span>
            </button>
          )}
          {page < totalPages - 1 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <button
                className="bg-white rounded-full shadow p-2 mb-1"
                onClick={handleNext}
                aria-label="Next"
              >
                <span className="text-2xl">{'>'}</span>
              </button>
              <span className="text-xs text-[#2A3663] font-bold">More</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}