const   express               = require("express"),
        app                   = express(),
        BodyParser            = require("body-parser"),
        FP                    = require("express-fileupload"),
        bcrypt                = require("bcryptjs"),
        NodeMailer            = require("nodemailer"),
        cookieParser          = require("cookie-parser");
        fs                    = require("fs"),
        { v4: uuidv4 }        = require('uuid'),
        MySqlStore            = require("express-mysql-session"),
        dotenv                = require('dotenv'),

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dotenv.config()
app.set("port",process.env.PORT||3000);
app.use(BodyParser.urlencoded({extended:true}));
app.use(FP());
app.use(cookieParser("o%pQH48$#zw$5J8kKk^Kk6szs9!Y6L^N&VhyR3oUD%dtbu8a!#4WAe93partp2tMXwQTV9p&sMHpaz", {
    expires: null,
    httpOnly: true,
    maxAge: null,
    sameSite: 'lax'
}))
app.use(require("express-session")({ 
    secret: 'o%pQH48$#zw$5J8kKk^Kk6szs9!Y6L^N&VhyR3oUD%dtbu8a!#4WAe93partp2tMXwQTV9p&sMHpaz',
    resave: true, 
    saveUninitialized:true,
    //maxAge: null,
    expires: new Date(Date.now() + 10000),
    cookie: { secure: false }
})); // session secret
app.use(express.static('src'));
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
const middle = require("./routes/middleware");

app.post('/login', login.validData, login.loginUser);
app.post('/register', register.validData, register.registerUser);
//app.get('/user', user.GetUserData);

app.post("/andresesdios", middle.authHeader, middle.validSign, (req,res) => {
    console.log(req.cookies);
    console.log("usuario logueado");
    console.log(req.user);
    res.send("Eres un dios");
});

app.post('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/andresesdios');
    });

});

app.listen(app.get("port"), function(err){
    if(err) console.log(err);
    else console.log("servidor iniciado");  
});