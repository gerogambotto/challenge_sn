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

app.use(
  "/profilepicture",
  express.static("E:/challenge/servidor-ftp/profilepicture/")
);

User.belongsTo(Role, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
});

User.belongsTo(Role, { foreignKey: "role", targetKey: "id" });

(async () => {
  await User.sync();
  await Role.sync();
})();

sequelize
  .authenticate()
  .then(() => {})
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(bodyParser.json());

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
