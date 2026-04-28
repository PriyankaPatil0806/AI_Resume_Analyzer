const express = require("express");
const router = express.Router();
const UserController = require('../Controllers/user');
const User = require("../Modules/user");

router.post("/user", async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const { name, email, photoUrl } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, photoUrl });
      await user.save();
    }

    res.status(200).json({
      message: "Welcome Back",
      user: user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;