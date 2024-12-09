// server.js
const express = require("express");
const User = require("./models/user");
const List = require("./models/list");
const Task = require("./models/task");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
const verifyToken = require("./middlewares/authMiddleware");
require("dotenv").config();

app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Creando usuario...");
    const user = await User.findOne({ where: { email } });
    console.log("Usuario encontrado", user);
    if (user) {
      console.log("El email ya está registrado");
      return res.status(400).json({
        error:
          "El correo proporcionado ya está registrado. Por favor, inicia sesión o utiliza un correo diferente.",
      });
    }
    console.log("Creando usuario...");
    const newUser = await User.create({ name, email, password });
    console.log("Usuario creado", newUser);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error:
          "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
        xv,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error:
          "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ auth: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
});

app.post("/list", verifyToken, async (req, res) => {
  const { name, emoji, userId } = req.body;
  try {
    const list = await List.create({ name, emoji, userId });
    res.status(201).json({ list: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/lists/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const lists = await List.findAll({ where: { userId } });
  res.status(200).json({ lists: lists });
});

app.post("/task", verifyToken, async (req, res) => {
  const { title, description, listId } = req.body;
  try {
    const status = "pending";
    const task = await Task.create({ title, description, status, listId });
    res.status(201).json({ task: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/tasks/:listId", verifyToken, async (req, res) => {
  const { listId } = req.params;
  const tasks = await Task.findAll({ where: { listId } });
  res.status(200).json({ tasks: tasks });
});

app.patch("/task/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const status = req.body.status;
  const task = await Task.findByPk(id);
  task.status = status;
  await task.save();
  res.status(200).json({ task: task });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
