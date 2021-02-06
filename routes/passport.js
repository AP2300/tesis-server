const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../connections/Dbconection');
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
    done(null, user.ID);
});
  
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], function (error, results, fields) {
        if (error) {
        done(error, false);
        }
        done(null, results[0]); 
    });
}); 

passport.use("local", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
},async (username, password, done)=>{
    const newUser = {
        username,
        password
    }
    bcrypt.hash(newUser.password, 8, ()=>{
        db.query("INSERT INTO users SET ? ", [newUser], (err, result)=>{
            if(err){
                console.log(err);
            }else{
                db.query("SELECT * FROM users WHERE id=? ", [result.insertId], (err, result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        return done(null, result[0]);
                    }
                })
            }
        })
    })
}))

passport.use("local-singin", new LocalStrategy({
    usernameField: 'username',
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) =>{
    
    await db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) =>{
    if(result.length == 1) {
        if(password == result[0].password){
            console.log("Ha iniciado sesion con exito!");
        } else{
            console.error("La Clave es Incorrecta");
        }
    } else {
        console.log("el usuario no existe");
    }
    })
    
}));
