const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  //register
  registerUser: async (req, res) => {
    try {
      if (req.body.password.length < 7) {
        return res.status(401).json({ message: "password phải trên 7 kí tự" });
      }

      if (req.body.password.length > 80) {
        return res
          .status(401)
          .json({ message: "password không thể lớn hơn 80 kí tự" });
      }

      const salt = await bcrypt.genSalt(10);
      // mả hoá password
      const hashed = await bcrypt.hash(req.body.password, salt);

      // sau khi mã hoá pass thì tạo user mới
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // lưu vào database
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(500).json("username or password exists");
      }
      res.status(500).json(error.message);
    }
  },

  // login user
  loginUser: async (req, res) => {
    try {
      // lấy 1 user theo tên
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json("Email not exists !!!");
      }

      // so sánh password giữa client và database
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // nếu sai some do thing
      if (!validPassword) {
        return res.status(404).json("Invalid password");
      }

      // success
      if (user && validPassword) {
        res.status(200).json({ msg: "login success", user });
      } else {
        res.status(400).json({ msg: "login fail" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
