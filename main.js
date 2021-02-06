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
        MySqlStore            = require("express-mysql-session"),
        dotenv                = require('dotenv'),
        LocalStrategy         = require('passport-local').Strategy;

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
    maxAge: null,
    cookie: { secure: false }
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



let transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "andresparedes202@gmail.com",
        pass: "rrclmyolimtffmqo"
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const register = require("./routes/register");
const login = require("./routes/login");

app.post("/register",register.RegisterUser, (req,res) => {
    res.status(200).send("holis");
})
app.post("/login",login.singInUser);

app.post("/andresesdios", (req,res) => {
    console.log(req.isAuthenticated());
    console.log(req.session)
    console.log(req.session.user);
    console.log(req["user"]);
    res.send("holi");
});

app.listen(app.get("port"), function(err){
    if(err) console.log(err);
    else console.log("servidor iniciado");  
});