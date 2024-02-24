import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalProfile } from "../ModalProfile/ModalProfile";

export function UserCongig({ setUserData, refresh }) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openprofile, setOpenprofile] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  // cargar los datos en selecteduserdata

  const handleOpenProfile = () => {
    setOpenProfile(!openProfile);
  };

  const handleOpenprofile = () => {
    setOpenprofile(true);
    setSelectedUserData(setUserData);
  };

  const handleCloseprofile = () => {
    setOpenprofile(false);
  };

  return (
    <div className="flex justify-end p-12">
      <div className="relative">
        <button
          className="block h-12 w-12 rounded-full overflow-hidden focus:outline-none"
          onClick={handleOpenProfile}
        >
          <img
            className="h-full w-full object-cover"
            src="https://eu.ui-avatars.com/api/?name=John&size=1000"
            alt="avatar"
          />
        </button>
        {openProfile && (
          <div className="absolute right-0 w-40 mt-2 py-2 bg-white border rounded shadow-xl">
            <a
              className="transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white"
              onClick={handleOpenprofile}
            >
              Profile
            </a>
            <div className="py-2">
              <hr></hr>
            </div>
            <a
              className="transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white"
              onClick={() => navigate("/")}
            >
              Logout
            </a>
          </div>
        )}
      </div>
      {openprofile && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="px-4 py-4">
              <h1 className="text-lg font-semibold mb-4">Profile</h1>
              <ModalProfile
                selectedUserData={selectedUserData}
                refresh={refresh}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseprofile}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
