const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const File = require("../models/files");

// const PORT = process.env.PORT || 3000;
app = express();
app.use(cors())
app.use(express.json());


app.get("/", (req, res) => {
    res.cookie("soni", "added");
    return res.json({"message":"cookie created"});
});

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = await req.body;
        if (!email || !password)
            return res.status(400).json({ "message": "Fields are empty" });

        const validUser = await User.findOne({ email: email });
        if (validUser) {
            const validpassword = await bcrypt.compare(password, validUser.password)
            if (validpassword) {
                const token = await validUser.generateAuthToken();
                res.cookie("jwtoken", token, {
                    // expires:new Date(Date.now+500),
                    httpOnly: true
                })
                return res.status(200).json({ "message": "User Signed In successfully" });
            }
            else {
                return res.json({ "message": "Invalid Credentials" });
            }
        }
        else {
            return res.json({ "message": "User does not exist" });
        }

    } catch (err) {
        console.log(err);
    }
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
 
const upload = multer({ storage: storage });

app.post("/files",upload.single('file'),(req,res)=>{
    const file = fs.readFileSync(req.file.path);
    const encode_img = file.toString('base64');
    const final_img = {
        contentType:req.file.mimetype,
        image:Buffer.from(encode_img,'base64')
    };
    File.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            // res.send(final_img.image);
            return res.json({"message":"file uploaded successfully"});
        }
    })
})

//register user from registarion form
app.post("/users", async (req, res) => {
    try {
        const newuser = new User(req.body);
        if (!newuser.firstname || !newuser.lastname || !newuser.email || !newuser.dob || !newuser.contact || !newuser.password || !newuser.cpassword)
            return res.json({ "message": "Empty fields" })
        const existinguser = await User.findOne({ email: newuser.email });
        if (existinguser)
            return res.json({ "message": "User exists" });
        if (newuser.password !== newuser.cpassword)
            return res.json({ "message": "passowrds matched" });
        const salt = await bcrypt.genSalt(10);
        newuser.password = await bcrypt.hash(newuser.password, salt);
        newuser.cpassword = await bcrypt.hash(newuser.cpassword, salt);
        const result = await newuser.save();
        return res.status(201).send({ "message": "User created succesfully" });
    } catch (err) {
        console.log(err);
        return res.status(404).send(err);
    }
})

app.listen(8899, () => {
    console.log("Server is running on http://localhost:8899");
});