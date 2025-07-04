import React, { useContext, useEffect, useState } from "react"; // Import React library
import assets from "../assets/assets"; // Import assets and dummy user data
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";

// Sidebar component receives selectedUser and setSelectedUser as props
const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const navigate = useNavigate(); // Initialize navigation function

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState(false);

  const filteredUsers = input
    ? users.filter((user) => {
        user.fullName.toLowerCase().includes(input.toLowerCase());
      })
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  

  return (
    <div
      // Sidebar container with conditional class for hiding on mobile if a user is selected
      className={`bg-[#8185B2]/10 h-full  p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img src={assets.logo} alt="logo" className="max-w-40" />
          {/* Menu icon with dropdown */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            {/* Dropdown menu, shown on hover */}
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282141] border border-grey-600 text-grey-100 hidden group-hover:block">
              {/* Edit Profile option */}
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-grey-500" />
              {/* Logout option */}
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
        {/* Search bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search User..."
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>
      {/* User list */}
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            key={index} // Unique key for each user
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages(prev=>({...prev,[user._id]:0})) // Set selected user on click
            }}
            // Highlight selected user
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            {/* User profile picture */}
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile pic"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            {/* User name and status */}
            <div className="flex flex-col leading-5">
              <p>{user.fullname}</p>
              {/* Show 'Online' for first 3 users */}
              { onlineUsers.includes(user._id) 
              ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {/* Show badge for users after the first 3 */}
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
                
                
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; // Export Sidebar component
