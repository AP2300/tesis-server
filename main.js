
// Declaracion de constantes  
const express = require("express"),
    app = express(),
    FP = require("express-fileupload"),
    bcrypt = require("bcryptjs"),
    NodeMailer = require("nodemailer"),
    cookieParser = require("cookie-parser"),
    fs = require("fs"),
    { v4: uuidv4 } = require('uuid'),
    dotenv = require('dotenv');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Configuracion del Servidor
dotenv.config()
app.set("port", 3001);
app.use(express.urlencoded({ extended: true }));
app.use(FP());
app.use(cookieParser(process.env.COOKIE_SECRET, {
    expires: null,
    httpOnly: true,
    maxAge: null,
    sameSite: 'lax'
}));
app.use(express.static(__dirname + '/resources/uploads'));
app.use(express.json({ 'limit': '1mb' }));
app.disable('x-powered-by');
app.all('*', function (_, res, next) {
    res.header('Access-Control-Allow-Origin', ' http://192.168.31.10:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, auth, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Declaracion de Controlodores
const register = require("./routes/register");
const login = require("./routes/login");
const middle = require("./routes/middleware");
const user = require("./routes/user");
const biometrics = require("./routes/biometrics");
const admin = require("./routes/admin");
const records = require("./routes/records")

// Asignacion de Rutas de Conexion con la Aplicacion Web
app.get("/logOut", login.LogOut);
app.post('/login', login.validData, login.loginUser);
app.post('/register', register.validData, register.registerUser);
app.post('/updateUserPass', middle.authHeader, middle.validSign, user.InSession, user.UpdatePassword);
app.get("/Home", middle.authHeader, middle.validSign, user.InSession, user.GetUserData);
app.get("/access_data", middle.authHeader, middle.validSign, user.InSession, user.GetUserAccess);
app.post('/setCode', middle.authHeader, middle.validSign, user.InSession, biometrics.validData, biometrics.setCode);
app.get('/getCode', middle.authHeader, middle.validSign, user.InSession, biometrics.validData, biometrics.getCode);
app.post('/setFinger', middle.authHeader, middle.validSign, user.InSession, biometrics.validData, biometrics.setFinger);
app.post('/setFace', middle.authHeader, middle.validSign, user.InSession, biometrics.validData, biometrics.setFace);
app.get("/Search", middle.authHeader, middle.validSign, user.InSession, biometrics.validData, user.GetUsersData);
app.get("/UserHistory", middle.authHeader, middle.validSign, user.InSession, user.GetUserHistoryData);
app.get("/profile", middle.authHeader, middle.validSign, user.InSession, user.GetProfileData);
app.post("/editProfile", middle.authHeader, middle.validSign, user.InSession, user.UpdateData);
app.post("/bioUpdate", middle.authHeader, middle.validSign, user.InSession, user.UpdateAuthMethods);
app.post("/AdminUpdateData", middle.authHeader, middle.validSign, user.InSession, admin.UpdateDataAdmin);
app.post("/AdminUpdatePass", middle.authHeader, middle.validSign, user.InSession, admin.UpdatePassAdmin);
app.post("/changeState", middle.authHeader, middle.validSign, user.InSession, admin.UserStateUpdate);
app.post("/deleteUser", middle.authHeader, middle.validSign, user.InSession, admin.DeleteUser);
app.delete("/deleteMethod", middle.authHeader, middle.validSign, user.InSession, biometrics.validData, biometrics.deleteMethod);
app.post("/updateProfile", middle.authHeader, middle.validSign, user.InSession, user.UpdateProfilePicture);
app.post("/deleteProfile", middle.authHeader, middle.validSign, user.InSession, user.DeletePicture);
app.get("/checkSession", middle.authHeader, middle.validSign, login.CheckIsUserActive);

// Asignacion de Rutas de conexion con el RaspBerry
app.get('/getFace', middle.authHeader, middle.validSign, biometrics.validData, biometrics.getFace);
app.post('/setRecord', middle.authHeader, middle.validSign, records.validData, records.setRecord);
app.get('/getFinger', middle.authHeader, middle.validSign, biometrics.validData, biometrics.getFinger);
app.get('/verifyCode', biometrics.verifyCode);

//  Easter Egg
app.post("/andresesdios", middle.authHeader, middle.validSign, user.InSession, (req, res) => {
    console.log(req.cookies);
    console.log("usuario logueado");
    res.send("Eres un dios");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Inicializacion del Servidor
app.listen(app.get("port"), function (err) {
    if (err) console.log(err);
    else console.log("servidor iniciado");
});

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// io.on('connection', () => {
//     console.log('Nuevo cliente conectado')
//     io.emit('mensaje', 'Bienvenido!')
// });


// io.on('disconnect', () => {
//     console.log('El cliente se ha desconectado')
// });

// server.listen(3004);