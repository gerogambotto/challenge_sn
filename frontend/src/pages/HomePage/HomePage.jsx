import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { UserCongig } from "../../components/UserConfig/UserConfig";
import { ModalProfile } from "../../components/ModalProfile/ModalProfile";

export function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const refreshAll = useCallback(() => {
    refresh();
    refreshLoggedUser();
  }, []);

  const refreshLoggedUser = useCallback(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3000/logged-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData(response.data);

          const isAdminUser = response.data.role_id === 2;
          setIsAdmin(isAdminUser);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    }
  }, []);

  const refresh = useCallback(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(
          data.users.map((user) => ({
            ...user,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
            dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString(),
          }))
        );
      })
      .catch((error) => {
        console.error("Hubo un problema con la solicitud:", error);
      });
  }, []);

  useEffect(() => {
    refreshLoggedUser();
  }, [refreshLoggedUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return users.slice(startIndex, endIndex);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(users.length / 10))
    );
  };

  const handleEditUser = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);

    setIsEditDialogOpen(true);

    setSelectedUserData(selectedUser);
  };

  return (
    <div className="home-section">
      <UserCongig setUserData={userData} refresh={refreshAll} />
      <div className={isAdmin ? "tableUserData" : "Welcome"}>
        {isAdmin ? (
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <h2 className="text-2xl font-semibold leading-tight">Users</h2>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date of Birth
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          DNI
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Password
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        {/*  */}
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentPageUsers().map((user) => (
                        <tr key={user.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.id}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <img
                                src={user.profilePicture}
                                alt="Photo"
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              <div>
                                <div className="flex items-center">
                                  <div className="mr-1">{user.lastName},</div>
                                  <div>{user.firstName}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.dateOfBirth}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.dni}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.email}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {`${user.password.substring(0, 10)}...`}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.role}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.createdAt}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span
                              className={
                                user.status === "activo"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {user.status}
                            </span>
                          </td>
                          {/* */}
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleEditUser(user.id)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end m-4">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Previous
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === Math.ceil(users.length / 10)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center max-w-6xl px-6 py-8 mx-auto">
            <div className="w-full md:w-1/2 py-8">
              <h1 className="text-purple-900 text-7xl font-semibold leading-none tracking-tighter">
                Welcome to <span className="text-blue-500">My Challenge, </span>{" "}
                I am Web Developer.
              </h1>
            </div>
            <div className="w-full md:w-1/2 py-8">
              <img
                src="https://www.svgrepo.com/show/493509/person-who-invests.svg"
                className="g-image"
              />
            </div>
          </div>
        )}
      </div>
      {/* Diálogo de edición */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="px-4 py-4">
              <ModalProfile
                selectedUserData={selectedUserData}
                refresh={refresh}
              />
              {/*  */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseEditDialog}
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
