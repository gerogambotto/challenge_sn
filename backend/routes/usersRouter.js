const express = require("express");
const usersRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Directorio donde se guardarán temporalmente los archivos
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
    const user = await User.findByPk(userId, { include: Role }); // Incluir el modelo Role para obtener el rol del usuario

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
    // Verificar si hay un token en la cabecera de autorización
    const token = req.headers.authorization.split(" ")[1];
    // Verificar el token y extraer el id de usuario
    const decodedToken = jwt.verify(token, "secret"); // 'secret' es la clave secreta utilizada para firmar el token
    const userId = decodedToken.id;
    // Buscar al usuario en la base de datos
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolver los datos del usuario
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
});

usersRouter.get("/users", async (req, res) => {
  try {
    const users = await User.findAll(); // Obtén todos los usuarios de la base de datos

    res.status(200).json({ users }); // Devuelve los usuarios en formato JSON
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

      let profilePictureUrl = null; // Inicializa la URL de la imagen como nula

      if (!firstName || !lastName || !dateOfBirth || !dni || !email) {
        return res
          .status(400)
          .json({ message: "Missing required fields in request body" });
      }

      // Procesa la fecha de nacimiento para cambiar el formato de MM/DD/YYYY a DD/MM/YYYY
      const dateParts = dateOfBirth.split("/");
      const formattedDateOfBirth = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;

      // Busca al usuario en la base de datos utilizando el userId recibido
      const user = await User.findByPk(id);

      // Verifica si el usuario existe
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Actualiza los campos del usuario con los nuevos valores recibidos del frontend
      user.firstName = firstName;
      user.lastName = lastName;
      user.dateOfBirth = formattedDateOfBirth;
      user.dni = dni;
      user.email = email;
      user.status = status;
      // Verifica si se proporcionó una nueva imagen de perfil
      if (req.file) {
        // Configure FTP connection
        client.ftp.verbose = true;
        await client.access(ftpConfigs);

        const fileExtension = req.file.originalname.split(".").pop();
        const remoteFileName = `profile_${Date.now()}.${fileExtension}`;

        // Sube la nueva imagen al servidor FTP
        await client.uploadFrom(
          req.file.path,
          `./profilepicture/${remoteFileName}`
        );

        // Obtiene la URL de la nueva imagen
        profilePictureUrl = `http://${hostname}:${port}/profilepicture/${remoteFileName}`;

        // Actualiza la imagen de perfil en la base de datos solo si se proporcionó una nueva
        user.profilePicture = profilePictureUrl;
      }

      // Guarda los cambios en la base de datos
      await user.save();

      // Envía una respuesta al frontend indicando que el perfil se actualizó correctamente
      res
        .status(200)
        .json({ message: "Profile updated successfully", profilePictureUrl });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.close(); // Cierra la conexión FTP
    }
  }
);

module.exports = usersRouter;
