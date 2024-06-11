const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { registerUser, userLogin, updateUser, updatePassword } = require("./handlers/user");
const { addMedication, deleteMedication, getAllMedications } = require("./handlers/medication");
const authenticateToken = require("./middleware/authJwt");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/register", registerUser);
app.post("/api/login", userLogin);
app.put("/api/updateUser", authenticateToken, updateUser);
app.put("/api/updatePassword", authenticateToken, updatePassword);
app.post("/api/medication", authenticateToken, addMedication);
app.delete("/api/medication", authenticateToken, deleteMedication);
app.get("/api/medication", authenticateToken, getAllMedications);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
