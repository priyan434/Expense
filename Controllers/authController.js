const bcrypt = require("bcrypt");
const genAuthtoken = require("../utils/genAuthtoken");
const saltRounds = 10;
require("dotenv").config();
const pool = require("../database/database");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });



exports.register = async (req, res) => {
  console.log("register");
  let conn;
  const { username, email, password, basecurrency, profile_url } = req.body;
  const user_id = uuidv4();
  try {
    conn = await pool.getConnection();
    if (!conn) return res.status(400).send("Connection error");

    const checkUserSql = `SELECT * FROM users WHERE email = ? AND isActive=1`;
    const [existingUser] = await conn.query(checkUserSql, [email]);

    if (existingUser.length > 0) {
      return res.status(409).send("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO users (user_id, username, email, password, b_curr_id, profile_url, isActive) VALUES (?,?,?,?,?,?,?);`;
    const [results, fields] = await conn.query(sql, [
      user_id,
      username,
      email,
      hashedPassword,
      basecurrency,
      profile_url,
      true,
    ]);

    if (results.affectedRows === 1) {
      const payload = {
        userId: user_id,
        username,
        email,
        basecurrency,
        profile_url,
      };
      const token = genAuthtoken(payload);

      return res
        .status(201)
        .json({ message: "User registered successfully", token });
    } else {
      return res.status(400).send("Registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Server error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

// exports.register = async (req, res) => {
//   console.log("register");
//   let conn;
//   const { user_id, username, email, password, basecurrency } = req.body;

// console.log(req.body);
//   try {
//     conn = await pool.getConnection();
//     if (!conn) return res.status(400).send("Connection error");

//     const checkUserSql = `SELECT * FROM users WHERE email = ? AND isActive=1`;
//     const [existingUser] = await conn.query(checkUserSql, [email]);

//     if (existingUser.length > 0) {
//       return res.status(409).send("User with this email already exists");
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const profileUrl = req.file ? req.file.path : null;
//     console.log(profileUrl);

//     const sql = `INSERT INTO users (user_id, username, email, password, b_curr_id, profile_url, isActive) VALUES (?,?,?,?,?,?,?);`;
//     const [results, fields] = await conn.query(sql, [
//       user_id,
//       username,
//       email,
//       hashedPassword,
//       basecurrency,
//       profileUrl,
//       true,
//     ]);

//     if (results.affectedRows === 1) {
//       const payload = { userId: user_id, username, email, basecurrency, profileUrl };
//       const token = genAuthtoken(payload);

//       return res.status(201).json({ message: "User registered successfully", token });
//     } else {
//       return res.status(400).send("Registration failed");
//     }
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).send("Server error");
//   } finally {
//     if (conn) {
//       conn.release();
//     }
//   }
// };

exports.login = async (req, res) => {
  console.log("login");
  let conn;
  const { email, password } = req.body;

  try {
    conn = await pool.getConnection();
    if (!conn) return res.status(400).send("Connection error");

    let sql = `SELECT * FROM users WHERE email = ?`;
    const [results, fields] = await conn.query(sql, [email]);

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const payload = {
        userId: user.user_id,
        username: user.username,
        profile_url: user.profile_url,
        email: user.email,
      };

      const token = genAuthtoken(payload);

      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Server error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
