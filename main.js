const express = require("express"),
    app = express(),
    FP = require("express-fileupload"),
    bcrypt = require("bcryptjs"),
    NodeMailer = require("nodemailer"),
    cookieParser = require("cookie-parser"),
    fs = require("fs"),
    { v4: uuidv4 } = require('uuid'),
    MySqlStore = require("express-mysql-session"),
    dotenv = require('dotenv');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dotenv.config()
app.set("port", 3001);
app.use(express.urlencoded({ extended: true }));
app.use(FP());
app.use(cookieParser(process.env.COOKIE_SECRET, {
    expires: null,
    httpOnly: true,
    maxAge: null,
    sameSite: 'lax'
}))


app.use(express.static(__dirname + '/resources/uploads'));
app.use(express.json({ 'limit': '1mb' }));
app.disable('x-powered-by');
app.all('*', function (_, res, next) {
    res.header('Access-Control-Allow-Origin', ' http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, auth, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const register = require("./routes/register");
const login = require("./routes/login");
const middle = require("./routes/middleware");
const user = require("./routes/user");
const biometrics = require("./routes/biometrics");
const admin = require("./routes/admin")

app.post('/login', login.validData, login.loginUser);
app.post('/register', register.validData, register.registerUser);
app.post('/updateUserPass', middle.authHeader, middle.validSign, user.UpdatePassword);
app.get("/Home", middle.authHeader, middle.validSign, user.GetUserData);
app.get("/access_data", middle.authHeader, middle.validSign, user.GetUserAccess)
app.get("/logOut", (_, res) => { res.clearCookie("userToken", { httpOnly: true }, { signed: true }).json({ success: true }) })
app.post('/setCode', middle.authHeader, middle.validSign, biometrics.validData, biometrics.setCode);
app.get('/verifyCode', biometrics.verifyCode);
app.get('/getCode', middle.authHeader, middle.validSign, biometrics.validData, biometrics.getCode);
app.post('/setFinger', middle.authHeader, middle.validSign, biometrics.validData, biometrics.setFinger);
app.get('/getFinger', middle.authHeader, middle.validSign, biometrics.validData, biometrics.getFinger);
app.post('/setFace', middle.authHeader, middle.validSign, biometrics.validData, biometrics.setFace);
app.get('/getFace', middle.authHeader, middle.validSign, biometrics.validData, biometrics.getFace);
app.get("/Search", middle.authHeader, middle.validSign, biometrics.validData, user.GetUsersData)
app.get("/UserHistory", middle.authHeader, middle.validSign, user.GetUserHistoryData)
app.get("/profile", middle.authHeader, middle.validSign, user.GetProfileData)
app.post("/editProfile", middle.authHeader, middle.validSign, user.UpdateData)
app.post("/bioUpdate", middle.authHeader, middle.validSign, user.UpdateAuthMethods)
app.post("/AdminUpdateData", middle.authHeader, middle.validSign, admin.UpdateDataAdmin)
app.post("/AdminUpdatePass", middle.authHeader, middle.validSign, admin.UpdatePassAdmin)

app.post("/andresesdios", middle.authHeader, middle.validSign, (req, res) => {
    console.log(req.cookies);
    console.log("usuario logueado");
    res.send("Eres un dios");
});


app.listen(app.get("port"), function (err) {
    if (err) console.log(err);
    else console.log("servidor iniciado");
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {
    console.log('Nuevo cliente conectado')
    io.emit('mensaje', 'Bienvenido!')
});
io.on('disconnect', () => {
    console.log('El cliente se ha desconectado')
});
server.listen(3004);