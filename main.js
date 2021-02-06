const   express               = require("express"),
        app                   = express(),
        BodyParser            = require("body-parser"),
        FP                    = require("express-fileupload"),
        bcrypt                = require("bcryptjs"),
        NodeMailer            = require("nodemailer")
        fs                    = require("fs"),
        { v4: uuidv4 }        = require('uuid'),
        passport              = require("passport"),
        session               = require("express-session"),
        MySqlStore            = require("express-mysql-session")
        dotenv                  = require('dotenv');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dotenv.config()
app.set("port",process.env.PORT||3000);
app.use(BodyParser.urlencoded({extended:true}));
app.use(FP());
app.use(express.static('src'));
app.use(session({ 
    secret: 'o%pQH48$#zw$5J8kKk^Kk6szs9!Y6L^N&VhyR3oUD%dtbu8a!#4WAe93partp2tMXwQTV9p&sMHpaz',
    resave: true, 
    saveUninitialized:true,
    maxAge: null
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); 
require("./routes/passport")

app.use(BodyParser.json({'limit':'1mb'}));
app.disable('x-powered-by');

app.all('*', function(_, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, auth, Content-Length, X-Requested-With');
    next();
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

let transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "andresparedes202@gmail.com",
        pass: "rrclmyolimtffmqo"
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const register = require("./routes/register");
app.post("/register",register.RegisterUser)


app.listen(app.get("port"), function(err){
    if(err) console.log(err);
    else console.log("servidor iniciado");  
});