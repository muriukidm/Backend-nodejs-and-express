const express = require('express');
const router = express.Router();
//Database goes here for anyone handling that


//Password Hashing
const bcrypt = require('bcrypt');

//Signup
router.post('/signup',(req, res) => {
    let{name, email,password} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
//Checking if the input keyed in are correct using regular expressions
    if (name == "" || email == "" || password ==  ""){
        res.json({
            status: "FAILED",
            message: "Empty input field!"
        })
    }else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name input!"
        })

    }else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email input!"
        })
    }else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    }else {
        //checking if user already exists
        User.find({email}).then(result => {
            if(result.length) {
                //A user already exists
                res.json({
                    status:"FAILED",
                    message:"User with the provided email already exists"
                })
            }else {
                // Try to create a new user

                // password handling
                const saltRounds = 10;
                bcrypt.hash(password,saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                    });
                    newUser.save().then(result =>{
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful!",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status:"FAILED",
                            message:"An error occured while creating user account!"
                    })
                })
                .catch(err =>(
                    res.json({
                        status:"FAILED",
                        message:"An error occured while Hashing the password!"
                    })

                ))
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status:"FAILED",
                message:"Am error occured while checking for existing user"
            })
        })
    }   
})

//Signin
router.post('/signup',(req, res) => {
    let{email,password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == ""){
        res.json({
            status:"FAILED",
            message: "Empty credentials entered"
        })
    }else{
        //check if user exist
        user.find({email})
        .then(data => {
            if (data.length){
                // User exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        // Password match
                        res.json({
                            status:"Success",
                            message:"Signin Successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status:"FAILED",
                            message:"Invalid password Entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status:"FAILED",
                        message:"An error occured while comparing passwords"
                    })
                })
            }else{
                res.json({
                    status:"FAILED",
                    message:"Invalid Credentials"
                })
            }
        })
        .catch(err => {
            res.json({
                status:"FAILED",
                message:"An error occured while checking for an existing User!"
            })
        })
    }
})

module.exports = router;