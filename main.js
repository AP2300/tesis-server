const   express               = require("express"),
        app                   = express(),
        BodyParser            = require("body-parser"),
        FP                    = require("express-fileupload"),
        bcrypt                = require("bcryptjs"),
        NodeMailer            = require("nodemailer"),
        cookieParser          = require("cookie-parser"),
        fs                    = require("fs"),
        { v4: uuidv4 }        = require('uuid'),
        MySqlStore            = require("express-mysql-session"),
        dotenv                = require('dotenv');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dotenv.config()
app.set("port",process.env.PORT);
app.use(BodyParser.urlencoded({extended:true}));
app.use(FP());
app.use(cookieParser(process.env.COOKIE_SECRET, {
    expires: null,
    httpOnly: true,
    maxAge: null,
    sameSite: 'lax'
}))


app.use(express.static('src'));
app.use(BodyParser.json({'limit':'1mb'}));
app.disable('x-powered-by');
app.all('*', function(_, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, auth, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
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
const user = require("./routes/user")

app.post('/login', login.validData, login.loginUser);
app.post('/register', register.validData, register.registerUser);
// app.get('/user', user.GetUserData);
app.get("/Home", middle.authHeader, middle.validSign, user.GetUserData)

app.post("/andresesdios", middle.authHeader, middle.validSign, (req,res) => {
    console.log(req.cookies);
    console.log("usuario logueado");
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