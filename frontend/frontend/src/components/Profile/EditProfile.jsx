import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export function EditProfile({ selectedUserData, refresh }) {
  const [formData, setFormData] = useState({
    id: selectedUserData.id,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dni: "",
    profilePicture: selectedUserData.profilePicture,
    email: "",
    status: "",
    isAdmin: selectedUserData.role_id,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevFormData) => {
      // Verificar si el campo es de tipo 'file'
      if (name === "profilePicture") {
        // Verificar si hay archivos seleccionados
        const newProfilePicture = files.length > 0 ? files[0] : value;
        return {
          ...prevFormData,
          [name]: newProfilePicture,
        };
      } else if (name === "status") {
        // Si el campo es 'status', actualizar el estado de forma diferente
        return {
          ...prevFormData,
          status: value, // Actualizar el estado de 'status' con el nuevo valor
        };
      } else {
        // Si no es un campo de tipo 'file' ni 'status', actualizar el estado normalmente
        return {
          ...prevFormData,
          [name]: value,
        };
      }
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      status: "activo",
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formDataToSend = new FormData(); // Crear un objeto FormData

    // Agregar cada campo del formulario al objeto FormData

    formDataToSend.append("id", selectedUserData.id);
    // Verificación y asignación para el campo firstName
    if (formData.firstName) {
      formDataToSend.append("firstName", formData.firstName);
    } else {
      formDataToSend.append("firstName", selectedUserData.firstName);
    }

    if (formData.lastName) {
      formDataToSend.append("lastName", formData.lastName);
    } else {
      formDataToSend.append("lastName", selectedUserData.lastName);
    }
    if (formData.dateOfBirth) {
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    } else {
      formDataToSend.append("dateOfBirth", selectedUserData.dateOfBirth);
    }

    if (formData.dni) {
      formDataToSend.append("dni", formData.dni);
    } else {
      formDataToSend.append("dni", selectedUserData.dni);
    }
    if (formData.profilePicture instanceof File) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    } else {
      // Si no se selecciona una nueva imagen, usar la imagen actual del usuario
      formDataToSend.append("profilePicture", selectedUserData.profilePicture);
    }

    formDataToSend.append("email", selectedUserData.email);
    if (formData.status) {
      formDataToSend.append("status", formData.status);
    } else {
      formDataToSend.append("status", selectedUserData.status);
    }
    // PUT al backend
    axios

      .put(
        "http://localhost:3000/user-update",

        formDataToSend,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        refresh();
        // Aquí puedes manejar la respuesta del servidor, mostrar un mensaje de éxito, etc.
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
      });
  };

  return (
    <div className="register-section">
      <div className="grid min-h-80 place-items-center">
        <div className="w-full">
          <h1 className="text-xl font-semibold">Edit Profile</h1>
          <form
            className="mt-6"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex justify-between gap-3">
              <span className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  Firstname
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder={selectedUserData.firstName}
                  autoComplete="given-name"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  onChange={handleInputChange}
                />
              </span>
              <span className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  Lastname
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder={selectedUserData.lastName}
                  autoComplete="family-name"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  onChange={handleInputChange}
                />
              </span>
            </div>
            <div className="flex justify-between mt-2 gap-3">
              <span className="w-1/2">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  Date
                </label>
                <input
                  id="dateOfBirth"
                  type="string"
                  name="dateOfBirth"
                  placeholder={selectedUserData.dateOfBirth}
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  onChange={handleInputChange}
                />
              </span>
              <span className="w-1/2">
                <label
                  htmlFor="dni"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  D.N.I
                </label>
                <input
                  id="dni"
                  type="text"
                  name="dni"
                  placeholder={selectedUserData.dni}
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  onChange={handleInputChange}
                />
              </span>
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
              >
                profile picture
              </label>
              <input
                id="profilePicture"
                type="file"
                name="profilePicture"
                className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    profilePicture: e.target.files[0],
                  });
                }}
              />
            </div>
            <label
              htmlFor="email"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder={selectedUserData.email}
              autoComplete="email"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              disabled
              value={selectedUserData.email}
              onChange={handleInputChange}
            />
            <label
              htmlFor="status"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              value={formData.status} // Utiliza formData.status en lugar de selectedUserData.status
              onChange={handleInputChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
              onClick={handleSubmit}
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
