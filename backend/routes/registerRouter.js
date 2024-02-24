const express = require("express");
const registerRouter = express.Router();
const User = require("../models/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Directorio donde se guardarán temporalmente los archivos
const bcrypt = require("bcrypt");
const ftp = require("basic-ftp");
const { ftpConfigs } = require("../ftpConfig/ftpConfig");
const jwt = require("jsonwebtoken");
const hostname = "localhost";
const port = 3000;

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role ? "admin" : "user",
  };
  return jwt.sign(payload, "secret", { expiresIn: "1h" });
};

registerRouter.post(
  "/register",
  upload.single("profilePicture"),
  async (req, res) => {
    const client = new ftp.Client();
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        dni,
        email,
        password,
        isAdmin,
      } = req.body;
      const profilePicture = req.file; // Assuming you're using multer or similar middleware for handling file uploads

      if (
        !firstName ||
        !lastName ||
        !dateOfBirth ||
        !dni ||
        !email ||
        !password ||
        !profilePicture
      ) {
        return res.status(400).json({
          message: "All fields are required, including the profile picture",
        });
      }

      // Configure FTP connection
      client.ftp.verbose = true;
      await client.access(ftpConfigs);
      // Guardar la imagen en el servidor FTP
      const fileExtension = profilePicture.originalname.split(".").pop(); // Obtener la extensión del archivo original
      const remoteFileName = `profile_${Date.now()}.${fileExtension}`; // Nombre del archivo en el servidor FTP
      await client.uploadFrom(
        profilePicture.path,
        `./profilepicture/${remoteFileName}`
      );

      let role_id;
      let role;
      if (isAdmin) {
        role_id = 2; // El ID del rol de administrador
        role = "admin";
      } else {
        role_id = 1; // El ID del rol de usuario normal
        role = "user";
      }

      // Get the URL of the profile image on the FTP server
      const profilePictureUrl = `http://${hostname}:${port}/profilepicture/${remoteFileName}`;

      // Save the image URL in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        firstName,
        lastName,
        dateOfBirth,
        dni,
        email,
        password: hashedPassword,
        profilePicture: profilePictureUrl, // Save the URL in the database
        role_id, // Assign the role ID to the created user
        role,
        status: "activo",
      });

      const token = generateToken(newUser);
      res.status(201).json({ token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.close(); // Make sure to close the FTP connection
    }
  }
);

registerRouter.post("/admin/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      dni,
      email,
      password,
      profilePicture,
      isAdmin,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !dni ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let role_id;
    let role;
    if (isAdmin) {
      role_id = 2; // El ID del rol de administrador
      role = "admin";
    } else {
      role_id = 1; // El ID del rol de usuario normal
      role = "user";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      dateOfBirth,
      dni,
      email,
      password: hashedPassword,
      profilePicture,
      role_id, // Asignar el ID del rol al usuario creado
      role,
      status: "activo",
    });

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = registerRouter;
