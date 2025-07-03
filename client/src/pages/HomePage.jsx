import React, { useContext, useState } from "react"; // Import React library
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import RightSidebar from "../components/RightSidebar"; // Import RightSidebar component
import ChatContainer from "../components/ChatContainer"; // Import ChatContainer component
import { ChatContext } from "../../context/chatContext";

const HomePage = () => {
  // Define HomePage functional component
  const {selectedUser} = useContext(ChatContext)

  return (
    // Main container with border, full width and height, and responsive padding
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        // Inner container with blur, border, rounded corners, overflow hidden, full height, grid layout, and responsive columns
        className={`blackdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? // If a user is selected, use 3 columns with different ratios for md and xl screens
              "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : // If no user is selected, use 2 columns for md screens
              "md:grid-cols-2"
        }`}
      >
        {/* Sidebar component, receives selectedUser and setSelectedUser as props */}
        <Sidebar />
        {/* ChatContainer component, receives selectedUser and setSelectedUser as props */}
        <ChatContainer />
        {/* RightSidebar component, receives selectedUser and setSelectedUser as props */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage; // Export HomePage component as default
