const { Firestore } = require("@google-cloud/firestore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/secretKey");

const firestore = new Firestore({
    projectId: "areunemia-capstone",
    keyFilename: "./config/areunemia-capstone-d3e5724eaec5.json",
});

const registerUser = async (req, res) => {
    const { name, birthdate, gender, email, password } = req.body;

    if (!name || !birthdate || !gender || !email || !password) {
        return res.status(400).send({ status: "error", message: "Please Complete the Data!" });
    }

    try {
        // Hash password sebelum disimpan ke Firestore
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for existing email or username (here, name is used as username)
        const usersRef = firestore.collection("users");
        const emailQuery = usersRef.where("email", "==", email);

        const [emailSnapshot] = await Promise.all([emailQuery.get()]);

        if (emailSnapshot.size > 0) {
            return res.status(400).send({ status: "error", message: "Email already exists!" });
        }

        // Membuat pengguna baru di Firestore
        const userRef = firestore.collection("users").doc();
        await userRef.set({
            name,
            birthdate,
            gender,
            email,
            password: hashedPassword,
            createdAt: Firestore.FieldValue.serverTimestamp(),
        });

        // Kirim respons sukses
        res.status(201).send({ status: "success", message: "User registered successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Failed to register user" });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    // Memeriksa apakah semua field terisi
    if (!email || !password) {
        return res.status(400).send({ status: "error", message: "Please enter both email and password" });
    }

    try {
        const userSnapshot = await firestore.collection("users").where("email", "==", email).get();

        if (userSnapshot.empty) {
            return res.status(401).send({ status: "error", message: "Invalid email or password" });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ status: "error", message: "Invalid email or password" });
        }

        const data = {
            name: user.name,
            email: user.email,
            birthdate: user.birthdate,
            gender: user.gender,
        };

        const token = jwt.sign({ userId: userDoc.id, email: user.email }, secretKey, { expiresIn: "1h" });

        res.status(200).send({ status: "success", data, token });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Failed to login user" });
    }
};

const updateUser = async (req, res) => {
    const userId = req.user.userId;
    const { name, birthdate, gender } = req.body;

    if (!name || !birthdate || !gender) {
        return res.status(400).send({ status: "error", message: "Please complete the data!" });
    }

    try {
        const userRef = firestore.collection("users").doc(userId);
        await userRef.update({
            name: name,
            birthdate: birthdate,
            gender: gender,
            updatedAt: Firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).send({ status: "success", message: "User updated successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Failed to update user" });
    }
};

const updatePassword = async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, password, confirmPassword } = req.body;

    if (!oldPassword || !password || !confirmPassword) {
        return res.status(400).send({status: "error", message: "Please complete the data!" });
    }

    try {
        const userRef = firestore.collection("users").doc(userId);
        const userDoc = await userRef.get();

        const userData = userDoc.data();
        const userPassword = userData.password; // Mendapatkan password dari data pengguna

        const isPasswordValid = await bcrypt.compare(oldPassword, userPassword);
        if (!isPasswordValid) {
            return res.status(401).send({status: "error", message: "Invalid old password" });
        }

        if (password === confirmPassword) {
            const hashedNewPassword = await bcrypt.hash(password, 10);

            await userRef.update({
                password: hashedNewPassword,
            });
            return res.status(200).send({ status: "success",message: "Password updated successfully" });
        }
        return res.status(400).send({status: "error", message: "Password and Confirm Password doesn't match" });
    } catch (error) {
        return res.status(500).send({status: "error", message: "Failed to update password" });
    }
};

module.exports = { registerUser, userLogin, updateUser, updatePassword };
