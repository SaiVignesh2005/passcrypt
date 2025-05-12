const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const router=express.Router();

let masterHashedPassword="";

router.post("/set", async (req, res) => {
    const { password } = req.body;
    if (masterHashedPassword) {
        return res.status(400).json({ message: "Master password already set" });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    masterHashedPassword = hashedPassword;

    res.status(200).json({ message: "Master password set successfully" });
});

router.post("/verify", async (req, res) => {

    const {password} = req.body;

    if(!masterHashedPassword) {
        return res.status(400).json({ message: "Master password not set" });
    }

    const isMatch = await bcrypt.compare(password, masterHashedPassword);
    if(!isMatch) {
        return res.status(401).json({ message: "Incorrect master password" });
    }
    const token = jwt.sign({ verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
    
});

module.exports = router;