import Menubar from "@/components/Menubar";
import { SquarePlus, CircleX, Edit, Loader } from 'lucide-react';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

export default function Todolist() {
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Pre-defined room templates
    const roomTemplates = [
        {
            name: "Bedroom",
            img: "/bedroom.jpg"
        },
        {
            name: "Bathroom",
            img: "/bathroom.jpg"
        },
        {
            name: "Kitchen",
            img: "/kitchen.jpg"
        },
        {
            name: "Guest room",
            img: "/guestroom.jpg"
        },
        {
            name: "Storage room",
            img: "/storage.jpg"
        },
        {
            name: "Laundry room",
            img: "/laundry.jpg"
        },
    ];

    // Check authentication and fetch rooms
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8000/check-token', {
                    token
                });
                
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    fetchRooms();
                } else {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error("Auth error:", error);
                localStorage.removeItem('token');
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Fetch rooms from API
    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/rooms', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRooms(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setLoading(false);
        }
    };

    // Handle room selection and creation
    const handleRoomSelection = async (roomTemplate) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/rooms', 
                { 
                    name: roomTemplate.name,
                    image: roomTemplate.img  // ส่ง image path ไปยัง API
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Add the new room to the state
            setRooms([...rooms, response.data]);
            setIsOpen(false);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };
    // Remove room
    const removeRoom = async (roomId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/rooms/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Remove room from state
            setRooms(rooms.filter(room => room._id !== roomId));
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    // Navigate to activity page
    const navigateToActivity = (roomId) => {
        router.push({
            pathname: "/TodoActivity",
            query: { roomId }
        });
    };

    // Enter edit mode for room name
    const handleEditClick = (e, roomId, currentName) => {
        e.stopPropagation();
        setEditMode(roomId);
        setEditName(currentName);
    };

    // Save edited room name
    const handleSaveRoomName = async (roomId) => {
        if (!editName.trim()) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8000/api/rooms/${roomId}`, 
                { name: editName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update room in state
            setRooms(rooms.map(room => 
                room._id === roomId ? { ...room, name: editName } : room
            ));
            setEditMode(null);
        } catch (error) {
            console.error("Error updating room name:", error);
        }
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditMode(null);
    };

    if (loading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <Loader className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen">
            <Menubar />
            <div className="p-4">
                <h1 className="font-bold text-[22pt] md:text-[32pt] text-[#58482D]">Add Cleaning Space</h1>
                {/* Mobile: 2 columns grid, card size, add button at last */}
                <div className="block md:hidden">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className="relative rounded-xl overflow-hidden shadow-lg bg-white aspect-[1/1.05] flex flex-col"
                                onClick={() => navigateToActivity(room._id)}
                            >
                                {/* Delete Button */}
                                <button
                                    className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    onClick={e => {
                                        e.stopPropagation();
                                        removeRoom(room._id);
                                    }}
                                >
                                    <CircleX size={18} />
                                </button>
                                <div className="relative w-full h-[110px]">
                                    <Image
                                        src={room.image || "/bedroom.jpg"}
                                        alt={room.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="rounded-t-xl"
                                    />
                                </div>
                                <div className="flex flex-col justify-between flex-1 p-2">
                                    <div className="flex items-center">
                                        <h3 className="text-black font-bold text-[13pt] flex-1 truncate">{room.name}</h3>
                                        <button
                                            onClick={e => handleEditClick(e, room._id, room.name)}
                                            className="text-blue-600 hover:text-blue-800 ml-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <div className="bg-green-100 h-2 w-[60%] rounded-full overflow-hidden mr-2">
                                            <div
                                                className="bg-green-500 h-full"
                                                style={{ width: `${room.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs">{room.progress}%</span>
                                    </div>
                                </div>
                                {/* Edit name popup (inline) */}
                                {editMode === room._id && (
                                    <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-20">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            className="p-1 border rounded text-[13pt] mb-2 w-[80%]"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleSaveRoomName(room._id);
                                                }}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleCancelEdit();
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Add Room Button: always last */}
                        <button
                            className="flex flex-col justify-center items-center rounded-xl aspect-[1/1.05] bg-[#D8C3A4] hover:bg-[#B59F78] transition-colors shadow-lg"
                            onClick={() => setIsOpen(true)}
                        >
                            <SquarePlus className="w-8 h-8 text-[#58482D]" />
                        </button>
                    </div>
                    {/* Room Selection Popup */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <div
                                className="relative p-6 bg-[#F5F2E8] w-[90vw] max-w-md rounded-lg shadow-xl border-2 border-[#B6AD9D]"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <CircleX size={28} />
                                </button>
                                <h1 className="text-[20pt] flex justify-center font-bold text-[#58482D]">Select Room</h1>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {roomTemplates.map((template, index) => (
                                        <div
                                            key={index}
                                            className="cursor-pointer overflow-hidden rounded-xl border border-[#B6AD9D] shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
                                            onClick={() => handleRoomSelection(template)}
                                        >
                                            <div className="h-24 relative">
                                                <Image
                                                    src={template.img}
                                                    alt={template.name}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    className="rounded-t-xl"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6E3] from-5% to-transparent"></div>
                                                <div className="absolute top-2 left-3 text-[#4F4534] font-semibold text-[13pt] drop-shadow-md">
                                                    {template.name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Desktop: original horizontal scroll cards */}
                <div className="hidden md:block">
                    <div className="h-[70vh] flex overflow-x-auto p-4 gap-4">
                        {/* Room Cards */}
                        {rooms.map((room) => (
                            <div 
                                key={room._id}
                                className="relative h-full min-w-[25vw] rounded-md overflow-hidden transform scale-95 hover:scale-100 transition duration-300 shadow-lg"
                            >
                                {/* Delete Button */}
                                <button 
                                    className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeRoom(room._id);
                                    }}
                                >
                                    <CircleX size={20} />
                                </button>

                                <div 
                                    className="relative w-full h-full cursor-pointer"
                                    onClick={() => navigateToActivity(room._id)}
                                >
                                    <Image
                                        src={room.image || "/bedroom.jpg"}
                                        alt={room.name}
                                        fill 
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="absolute bottom-0 w-full bg-blue-100 bg-opacity-80 p-2">
                                        {editMode === room._id ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 p-1 border rounded text-xl"
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                />
                                                <div className="flex ml-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSaveRoomName(room._id);
                                                        }}
                                                        className="bg-green-500 text-white p-1 rounded mr-1"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelEdit();
                                                        }}
                                                        className="bg-red-500 text-white p-1 rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <h3 className="text-black font-bold text-xl flex-1">{room.name}</h3>
                                                <button 
                                                    onClick={(e) => handleEditClick(e, room._id, room.name)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="bg-green-100 h-2 w-32 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-green-500 h-full" 
                                                    style={{ width: `${room.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm">{room.progress}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Room Button */}
                        <div>
                            <button
                                className="flex justify-center items-center h-full min-w-[25vw] bg-[#B59F78] transform scale-95 hover:scale-100 transition duration-300 hover:bg-[#8d7c5f] rounded-md"
                                onClick={() => setIsOpen(true)}
                            >
                                <SquarePlus className="w-[10%] h-[10%] text-[#58482D]" />
                            </button>

                            {/* Room Selection Popup */}
                            {isOpen && (
                                <div 
                                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div 
                                        className="relative p-8 bg-[#F5F2E8] w-[80%] max-w-4xl rounded-lg shadow-xl border-2 border-[#B6AD9D]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Close button */}
                                        <button
                                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <CircleX size={32} />
                                        </button>
                                        <h1 className="text-[24pt] flex justify-center font-bold text-[#58482D]">Select Room</h1>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                                            {roomTemplates.map((template, index) => (
                                                <div 
                                                    key={index}
                                                    className="cursor-pointer overflow-hidden rounded-xl border border-[#B6AD9D] shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
                                                    onClick={() => handleRoomSelection(template)}
                                                >
                                                    <div className="h-32 relative">
                                                        {/* Room image */}
                                                        <Image
                                                            src={template.img}
                                                            alt={template.name}
                                                            fill 
                                                            style={{ objectFit: "cover" }}
                                                        />

                                                        {/* Gradient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6E3] from-5% to-transparent"></div>

                                                        {/* Room name */}
                                                        <div className="absolute top-3 left-4 text-[#4F4534] font-semibold text-[20pt] drop-shadow-md">
                                                            {template.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}