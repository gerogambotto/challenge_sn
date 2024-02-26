const express = require("express");
const registerRouter = express.Router();
const User = require("../models/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
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
      const profilePicture = req.file;

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

      client.ftp.verbose = true;
      await client.access(ftpConfigs);

      const fileExtension = profilePicture.originalname.split(".").pop(); // Obtener la extensión del archivo original
      const remoteFileName = `profile_${Date.now()}.${fileExtension}`; // Nombre del archivo en el servidor FTP
      await client.uploadFrom(
        profilePicture.path,
        `./profilepicture/${remoteFileName}`
      );

      let role_id;
      let role;
      if (isAdmin) {
        role_id = 2;
        role = "admin";
      } else {
        role_id = 1;
        role = "user";
      }

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
        profilePicture: profilePictureUrl,
        role_id,
        role,
        status: "activo",
      });

      const token = generateToken(newUser);
      res.status(201).json({ token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.close();
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
      role_id = 2;
      role = "admin";
    } else {
      role_id = 1;
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
      role_id,
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
