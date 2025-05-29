import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchDataApi } from "@/utils/api";
import { Afacad } from "next/font/google";
import { getTempUserData, clearTempUserData } from '@/utils/tempStorage';
import LoginPopup from "@/components/Loginpopup"; // Add this import

const afacadFont = Afacad({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-afacad",
});

const FEATURES_ORDER = [
  "living_room", "kitchen", "workspace", "bathroom", "kid_room", "storage", "bedroom",
  "small", "medium", "large",
  "alone", "couple", "small_family", "large_family", "with_friends", "has_pet",
  "minimal", "modern", "loft", "vintage", "scandinavian", "japanese", "natural", "colorful",
  "budget"
];

const QUESTIONS = [
  {
    title: "What type of room are you interested in?",
    options: [
      { key: "living_room", label: "Living Room" },
      { key: "kitchen", label: "Kitchen" },
      { key: "workspace", label: "Workspace" },
      { key: "bathroom", label: "Bathroom" },
      { key: "kid_room", label: "Kid's Room" },
      { key: "storage", label: "Storage Room" },
      { key: "bedroom", label: "Bedroom" },
    ]
  },
  {
    title: "What room size are you looking for?",
    options: [
      { key: "small", label: "Small (< 12 sq.m.)" },
      { key: "medium", label: "Medium (12-20 sq.m.)" },
      { key: "large", label: "Large (> 20 sq.m.)" },
    ]
  },
  {
    title: "What kind of living situation do you prefer?",
    options: [
      { key: "alone", label: "Single" },
      { key: "couple", label: "Couple" },
      { key: "small_family", label: "Small Family" },
      { key: "large_family", label: "Large Family" },
      { key: "with_friends", label: "With Friends" },
      { key: "has_pet", label: "Pet Friendly" },
    ]
  },
  {
    title: "What style do you like?",
    options: [
      { key: "minimal", label: "Minimal" },
      { key: "modern", label: "Modern" },
      { key: "loft", label: "Loft" },
      { key: "vintage", label: "Vintage" },
      { key: "scandinavian", label: "Scandinavian" },
      { key: "japanese", label: "Japanese" },
      { key: "natural", label: "Natural" },
      { key: "colorful", label: "Colorful" },
    ]
  },
  {
    title: "What's your budget range?",
    options: [
      { key: "budget", label: "Enter your budget", isInput: true }
    ]
  }
];

export default function PreferencePage() {
  const router = useRouter();
  const { from } = router.query;

  useEffect(() => {
    // Check if user came from signup
    if (from !== 'signup') {
      const userData = getTempUserData();
      if (!userData.username) {
        router.push('/signup');
      }
    }
  }, [from]);

  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [budgetValue, setBudgetValue] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleToggle = (key) => {
    setSelected(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNext = () => {
    if (pageIndex < QUESTIONS.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handleBack = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const userData = getTempUserData();
    const finalSelected = { ...selected };

    // Create feature array with actual budget value at the end
    const featureArray = FEATURES_ORDER.map((key, index) => {
      if (index === FEATURES_ORDER.length - 1) {
        return parseFloat(budgetValue) || 0; // แปลง budget เป็นตัวเลข
      }
      return finalSelected[key] ? 1 : 0;
    });

    // Show the data that will be sent
    console.log("User Data:", userData);
    console.log("Selected Features:", finalSelected);
    console.log("Feature Array:", featureArray);
    console.log("Budget Value:", budgetValue);
    
    const selectedFeatures = FEATURES_ORDER.slice(0, -1).filter(key => finalSelected[key]);
    const message = `
Selected features: ${selectedFeatures.join(", ")}
Budget: ${budgetValue}
Feature array: ${featureArray.join(",")}

Do you want to proceed with registration?`;

    if (confirm(message)) {
      try {
        const result = await fetchDataApi("POST", "auth/register", {
          ...userData,
          features: featureArray,
          budgetValue: parseFloat(budgetValue) || 0
        });

        if (result.error) {
          alert(`Error: ${result.error}`);
        } else {
          clearTempUserData();
          router.push({
            pathname: '/Home',
            query: { showLogin: true }  // ส่ง query parameter เพื่อบอกว่าต้องแสดง LoginPopup
          });
        }
      } catch (err) {
        console.error("Error submitting preferences:", err);
        alert("Submission failed.");
      }
    }
  };

  const currentPage = QUESTIONS[pageIndex];

  return (
    <div className={`${afacadFont.variable} font-afacad min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50`}>
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{currentPage.title}</h2>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {currentPage.options.map(opt => opt.isInput ? (
            <input
              key={opt.key}
              type="number"
              placeholder="Enter budget amount"
              className="p-3 border rounded-lg w-full max-w-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
            />
          ) : (
            <button
              key={opt.key}
              type="button"
              className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                selected[opt.key] 
                  ? "bg-purple-600 text-white border-purple-700 hover:bg-purple-700" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleToggle(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          {pageIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Back
            </button>
          )}
          {pageIndex < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
