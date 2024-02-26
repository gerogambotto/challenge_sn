import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    dateOfBirth: "",
    profilePicture: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: location.pathname.includes("/admin/register"),
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profilePicture" ? files[0] : value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData(); // Crear un objeto FormData

    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("dni", formData.dni);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("profilePicture", formData.profilePicture);
    formDataToSend.append("isAdmin", formData.isAdmin);
    // POST al backend
    fetch("http://localhost:3000/register", {
      method: "POST",
      body: formDataToSend,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        localStorage.setItem("token", data.token);

        navigate("/");
      })
      .catch((error) => {
        console.error("Error al registrar:", error);
      });
  };

  return (
    <div className="register-section">
      <div className="grid min-h-screen place-items-center">
        <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
          <h1 className="text-xl font-semibold">
            Hello there ?,{" "}
            <span className="font-normal">
              please fill in your information to continue
            </span>
          </h1>
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
                  placeholder="John"
                  autoComplete="given-name"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  value={formData.firstName}
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
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  value={formData.lastName}
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
                  type="date"
                  name="dateOfBirth"
                  placeholder="07/02/2001"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  value={formData.dateOfBirth}
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
                  placeholder="12345678"
                  className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                  required
                  value={formData.dni}
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
              placeholder="john.doe@company.com"
              autoComplete="email"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <label
              htmlFor="password"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              autoComplete="new-password"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <label
              htmlFor="confirmPassword"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="********"
              autoComplete="new-password"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
            >
              Sign up
            </button>
            <p
              onClick={() => navigate("/")}
              className="flex justify-between inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black"
            >
              Already registered?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
