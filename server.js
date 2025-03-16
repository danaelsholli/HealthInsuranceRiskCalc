const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
// Middleware
const corsOptions = {
    origin: "http://localhost:5000", // Adjust if needed
    methods: "GET, POST",
    allowedHeaders: "Content-Type"
};
app.use(cors(corsOptions));

app.use(express.static('public')); // Serves static frontend files
app.use(express.json());

// Function to calculate risk score
function calculateRiskScore(age, bmi, bloodPressure, familyHistory) {
    let riskScore = 0;

    // Age Risk
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    // BMI Risk
    if (bmi < 25) riskScore += 0; // Normal
    else if (bmi < 30) riskScore += 30; // Overweight
    else riskScore += 75; // Obese

    // Blood Pressure Risk
    const bpRisk = {
        "normal": 0,
        "elevated": 15,
        "stage1": 30,
        "stage2": 75,
        "crisis": 100
    };
    riskScore += bpRisk[bloodPressure] || 0;

    // Family History Risk
    familyHistory.forEach(disease => {
        if (["diabetes", "cancer", "alzheimer"].includes(disease)) {
            riskScore += 10;
        }
    });

    // Determine Risk Category
    let riskCategory = "low risk";
    if (riskScore > 20) riskCategory = "moderate risk";
    if (riskScore > 50) riskCategory = "high risk";
    if (riskScore > 75) riskCategory = "uninsurable";

    return { riskScore, riskCategory };
}

// ✅ API Route for Risk Calculation
app.post('/api/calculate', (req, res) => {
    console.log(req.body); // Log the received data
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure || !familyHistory) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const bmi = weight / ((height / 100) ** 2);
    const result = calculateRiskScore(age, bmi, bloodPressure, familyHistory);
    
    res.json(result);
});

// ✅ API Test Route (Confirms API is working)
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

// ✅ NEW: Modify Root Route to Show a Message
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Insurance Risk API is Running</h1>
        <p>Use <code>/api/calculate</code> to calculate risk scores.</p>
        <p>Test the API with <code>/api/test</code>.</p>
    `);
});

// ✅ Default Route (Still Serves Frontend)
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));