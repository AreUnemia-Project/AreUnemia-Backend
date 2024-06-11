const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = express();
app.use(bodyParser.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require("./areunemia-capstone-firebase-adminsdk-j736n-62ab868a3b");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// const auth = getAuth();

// Rute untuk registrasi pengguna dengan email
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Membuat pengguna baru menggunakan Firebase Admin SDK
        const userRecord = await admin.auth().createUser({
            name: name,
            email: email,
            password: password,
        });

        // Menyimpan data pengguna ke Firestore
        await db.collection("users").doc(userRecord.uid).set({
            email: email,
            name: name,
            password: password,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Kirim respons sukses
        res.status(201).send({ message: "User registered successfully", userRecord });
    } catch (error) {
        console.error("Error registering user:", error);
        // Kirim respons gagal
        res.status(400).send("Failed to register user");
    }
});

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         // Autentikasi pengguna menggunakan Firebase Client SDK
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const idToken = await userCredential.user.getIdToken();

//         // Kirim token ID ke klien
//         res.status(200).json({ idToken });
//     } catch (error) {
//         console.error("Error logging in:", error);
//         res.status(401).send("Login failed");
//     }
// });
// Rute lainnya dan middleware...

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
