const { Firestore } = require("@google-cloud/firestore");
const fs = require('fs');
const Jimp = require('jimp');
const turf = require('@turf/turf');
const tfjs = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

const firestore = new Firestore({
    projectId: "areunemia-capstone",
    keyFilename: "./config/areunemia-capstone-d3e5724eaec5.json",
});

const loadModelSegmentation = async (req, res) => {
    const modelUrl = "file://model/content/seg_model/model.json";
    return tfjs.loadGraphModel(modelUrl);
}

const predict_seg = async (model, imageBuffer) => {
    const tensor = tfjs.node
      .decodeJpeg(imageBuffer)
      .resizeNearestNeighbor([640, 640])
      .expandDims()
      .toFloat();
    return model.predict(tensor);
}

const predictionsResult = async (req, res, model_seg) => {
    if (!req.file) {
        return res.status(400).send("No image file uploaded");
    }

    try {
        const filePath = req.file.path;
        const imageBuffer = fs.readFileSync(filePath);
        const [resultSeg1, resultSeg2]  = await predict_seg(model_seg, imageBuffer);

        const masks = await resultSeg1.data();
        
        res.status(201).send({
            status: "Successfully Predicted!",
            data: { result: "bruh" },
        });

        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(400).send("Failed to retrieve prediction data");
    }
    
}

const predictionsHistory = async (req, res) => {
    try {
        const result = "Prediction 1";
        res.status(201).send({ status: "Successfully Retrieved!", data: { result } });
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(400).send("Failed to retrieve prediction data");
    }
}

module.exports = { predictionsResult, predictionsHistory, loadModelSegmentation};