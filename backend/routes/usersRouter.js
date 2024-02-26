const express = require("express");
const usersRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ftp = require("basic-ftp");
const { ftpConfigs } = require("../ftpConfig/ftpConfig");
const hostname = "localhost";
const port = 3000;

usersRouter.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      firstName,
      lastName,
      dateOfBirth,
      dni,
      email,
      password,
      profilePicture,
      role,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (dni) user.dni = dni;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (profilePicture) user.profilePicture = profilePicture;
    if (role !== undefined) user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

usersRouter.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, { include: Role });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

usersRouter.get("/logged-user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // Verificar el token y extraer el id de usuario
    const decodedToken = jwt.verify(token, "secret");
    const userId = decodedToken.id;
    // Buscar al usuario en la base de datos
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
});

usersRouter.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

usersRouter.put(
  "/user-update",
  upload.single("profilePicture"),
  async (req, res) => {
    const client = new ftp.Client();
    try {
      const { id, firstName, lastName, dateOfBirth, dni, email, status } =
        req.body;

      let profilePictureUrl = null;

      if (!firstName || !lastName || !dateOfBirth || !dni || !email) {
        return res
          .status(400)
          .json({ message: "Missing required fields in request body" });
      }

      const dateParts = dateOfBirth.split("/");
      const formattedDateOfBirth = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.dateOfBirth = formattedDateOfBirth;
      user.dni = dni;
      user.email = email;
      user.status = status;
      if (req.file) {
        client.ftp.verbose = true;
        await client.access(ftpConfigs);

        const fileExtension = req.file.originalname.split(".").pop();
        const remoteFileName = `profile_${Date.now()}.${fileExtension}`;

        await client.uploadFrom(
          req.file.path,
          `./profilepicture/${remoteFileName}`
        );

        profilePictureUrl = `http://${hostname}:${port}/profilepicture/${remoteFileName}`;

        user.profilePicture = profilePictureUrl;
      }

      await user.save();

      res
        .status(200)
        .json({ message: "Profile updated successfully", profilePictureUrl });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.close();
    }
  }
);

module.exports = usersRouter;
