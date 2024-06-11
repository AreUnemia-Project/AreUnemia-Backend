const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
    projectId: "areunemia-capstone",
    keyFilename: "./config/areunemia-capstone-d3e5724eaec5.json",
});

const addMedication = async (req, res) => {
    const { medicationName, dosage, schedule, notes } = req.body;
    const userId = req.user.userId;

    try {
        // mengecek apakah data obat sudah tersedia
        const medicationsRef = firestore.collection("users").doc(`${userId}`).collection("medications");
        const medicationQuery = medicationsRef.where("medicationName", "==", medicationName);
        const medicationSnapshot = await medicationQuery.get();

        if (medicationSnapshot.size > 0) {
            return res.status(400).send({ status: "error", message: "Medication already exists!" });
        }

        // membuat document medication dengan timestamp
        const medicationRef = medicationsRef.doc(`${medicationName}`);
        await medicationRef.set({
            medicationName,
            dosage,
            schedule,
            notes,
            createdAt: new Date(),
        });

        res.status(201).send({ status: "success", message: "Medication added successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Failed to add medication" });
    }
};

const getAllMedications = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).send({ status: "error", message: "User ID is required" });
    }

    try {
        const medicationsRef = firestore.collection("users").doc(userId).collection("medications");
        const snapshot = await medicationsRef.get();

        if (snapshot.empty) {
            return res.status(404).send({ status: "error", message: "No medications found" });
        }

        const medications = [];
        snapshot.forEach((doc) => {
            medications.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send({ status: "success", medications });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error getting medications" });
    }
};

const deleteMedication = async (req, res) => {
    const userId = req.user.userId;
    const { medicationName } = req.body;

    if (!userId || !medicationName) {
        return res.status(404).send({ status: "error", message: "Please complete the data" });
    }
    try {
        // Mengambil referensi koleksi obat untuk pengguna tertentu
        const medicationsRef = firestore.collection("users").doc(`${userId}`).collection("medications").doc(`${medicationName}`);

        await medicationsRef.delete();
        res.status(201).send({ status: "success", message: "Medication delete successfully" });
    } catch(error){
        res.status(500).send({ status: "error", message: "Error deleting medication" });
    }
};
module.exports = { addMedication, deleteMedication, getAllMedications };
