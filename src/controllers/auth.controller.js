import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Redis from 'ioredis';
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // const userFound = await User.findOne({ email });
    const userExists = await redisClient.hexists('users', email);

    if (userExists)
      return res.status(400).json({
        message: ["The email is already in use"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      // password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();
    await redisClient.hset('users', email, passwordHash);

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });
    console.log("toquen creado en register: ", token);

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: false,
      sameSite: "Lax",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  /*
  async (req, res) => {
  const { email, password } = req.body;

  // Obtener la contraseña almacenada en Redis
  const storedPassword = await redisClient.hget('users', email);

  if (!storedPassword) {
    return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
  }

  // Verificar la contraseña
  const passwordMatch = await bcrypt.compare(password, storedPassword);

  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }

  // Establecer la sesión para el usuario
  req.session.user = { email };

  res.json({ success: true, message: 'Login exitoso', user: req.session.user });
});
  */
  try {
    const { email, password } = req.body;

    const storedPassword = await redisClient.hget('users', email);
    // const userFound = await User.findOne({ email });

    if (!storedPassword) {
      return res.status(400).json(['The email does not exist']);
    }

    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const userFound = await User.findOne({ email });

    // if (!userFound)
    //   return res.status(400).json({
    //     message: ["The email does not exist"],
    //   });

    // const isMatch = await bcrypt.compare(password, userFound.password);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     message: ["The password is incorrect"],
    //   });
    // }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });
    console.log(`token ${JSON.stringify(token)}`);



    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: false,
      sameSite: "Lax",
    });
    console.log("toquen guardado en cookies");

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });

    console.log('metodo login finalizado con exito');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
