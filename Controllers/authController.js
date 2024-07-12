const bcrypt = require("bcrypt");
const genAuthtoken = require("../utils/genAuthtoken");
const saltRounds = 10;
require("dotenv").config();

const multer = require("multer");
const path = require("path");

const { Users } = require("../database/user.model");
const Joi = require('joi');
const { INVALID_INPUT, USER_REGISTER, USER_REGISTERATION_ERROR, USER_LOGIN, USER_NOT_FOUND, USER_FOUND, USER_ID_INVALID, USER_DETAILS_FOUND } = require("../ErrorCode");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });




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

exports.register = async (req, res) => {
  // console.log("register");
  const { username, email, password, basecurrency, profile_url } = req.body;
  const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    basecurrency: Joi.number().required(),
    profile_url: Joi.string().optional(),
  });

  try {

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      // console.log(error.details[0]);
      return res.status(400).send({ msg: error.details[0].message, code: INVALID_INPUT.code });
    }


    const existingUser = await Users.findOne({ where: { email: email, isActive: 1 } });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }


    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = await Users.create({
      username: username,
      email: email,
      password: hashedPassword,
      basecurrency: basecurrency,
      profile_url: profile_url,
      isActive: true,
    });
    if (newUser) {
      const profile = {
        userId: newUser.user_id,
        username,
        email,
        basecurrency,
        profile_url,
      };
      const token = genAuthtoken(profile);


      return res.status(200).json({ message: "User registered successfully", success: true, code: USER_REGISTER.code, data:{
        token,
        profile
      } });
    }
    else {
      return res.status(400).json({ message: "Error registering user",success:false, code: USER_REGISTERATION_ERROR.code });
    }


  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("server error:");
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  const loginSchema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),


  });

  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message, code: INVALID_INPUT.code });
    }

    const user = await Users.findOne({ where: { email: email, isActive: true } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // console.log(Object.keys(user));
    // console.log(user.username);


    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const payload = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      basecurrency: user.basecurrency,
      profile_url: user.profile_url,
    };

    const token = genAuthtoken(payload);

    res.status(200).json({ message: "Login successful",success:true,code:USER_LOGIN.code, data:{
      profile:payload,
      token
    } });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Server error");
  }
};

exports.fetchUserDetails = async (req, res) => {
  const user_id = req.params.id

  try {
    if (!user_id) {
      return res.status(400).json({ message: USER_ID_INVALID.message,code:USER_ID_INVALID.code });
    }
    const user = await Users.findOne({
      where: { user_id: user_id, isActive: true },
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(400).json({ message: USER_NOT_FOUND.message,success:false,code:USER_NOT_FOUND.code }); 
    }
    res.status(200).json({msg:USER_DETAILS_FOUND.message,data:user,success:true,code:USER_DETAILS_FOUND.code})
  } catch (error) {

  }


}