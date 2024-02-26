// frontend
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const login = (formData) => {
      axios
        .post("http://localhost:3000/login", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new Error("La respuesta de la red no fue correcta.");
        })
        .then((data) => {
          localStorage.setItem("token", data.token);

          navigate("/HomePage");
        })
        .catch((error) => {
          console.error("Credenciales incorrectas:", error);
        });
    };

    login(formData);
  };

  return (
    <div className="login-section">
      <div className="grid min-h-screen place-items-center">
        <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
          <h1 className="text-xl font-semibold">
            Hola, ¿cómo estás?,{" "}
            <span className="font-normal">
              por favor ingresa tu información para continuar
            </span>
          </h1>
          <form className="mt-6" onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              Correo electrónico
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
              Contraseña
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
            <button
              type="submit"
              className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
            >
              Iniciar sesión
            </button>
            <p
              onClick={() => navigate("/register")}
              className="flex justify-between inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black"
            >
              ¿No tienes una cuenta?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
