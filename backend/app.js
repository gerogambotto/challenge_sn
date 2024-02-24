require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./routes/usersRouter");
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const sequelize = require("./configs/db");
const User = require("./models/user");
const Role = require("./models/role");
const app = express();
const { verifyToken } = require("./middlewares/authMiddleware");
const hostname = "localhost";
const port = 3000;

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
};
app.use(cors(corsOptions));

// Servir archivos estáticos, como las imágenes del servidor FTP
app.use(
  "/profilepicture",
  express.static("E:/challenge/servidor-ftp/profilepicture/")
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define la relación entre User y Role
User.belongsTo(Role, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
});

// Define the relationship between Users and Roles through the "role" field
User.belongsTo(Role, { foreignKey: "role", targetKey: "id" }); // The relationship is that a user belongs to a role

(async () => {
  await User.sync();
  await Role.sync();
})();

// Database authentication
sequelize
  .authenticate()
  .then(() => {})
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(loginRouter);
app.use(registerRouter);
app.use(verifyToken, usersRouter);

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
