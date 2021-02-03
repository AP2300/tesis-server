const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../connections/Dbconection');
const bcrypt = require("bcryptjs");

passport.use("local-registro", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
},async (req, username, password, done)=>{
    const newUser = {
        username,
        password
    }
    bcrypt.hash(newUser.password, 8, ()=>{
        db.query("INSERT INTO users SET ? ", [newUser], (err, result)=>{
            if(err){
                console.log(err);
            }else{
                console.log(result)
            }
        })
    })
    
}))


