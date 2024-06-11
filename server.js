const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { registerUser, userLogin, updateUser, updatePassword } = require("./handlers/user");
const { addMedication, deleteMedication, getAllMedications } = require("./handlers/medication");
const { predictionsResult, predictionsHistory, loadModelSegmentation} = require("./handlers/predictions");
const authenticateToken = require("./middleware/authJwt");
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

let model_seg = null;

(async () => {
    try {
        model_seg = await loadModelSegmentation();
        console.log("Models loaded successfully");
    } catch (error) {
        console.error("Failed to load models:", error);
    }
})();

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
app.post("/api/predictions", upload.single('image'), (req, res) => predictionsResult(req, res, model_seg));
app.get("/api/predictions", predictionsHistory);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
