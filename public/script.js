document.getElementById("riskForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect input values
    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;
    const bloodPressure = document.getElementById("bloodPressure").value;

    // Collect checked family history checkboxes
    const familyHistory = [];
    if (document.getElementById("diabetes").checked) familyHistory.push("diabetes");
    if (document.getElementById("cancer").checked) familyHistory.push("cancer");
    if (document.getElementById("alzheimers").checked) familyHistory.push("alzheimers");

    // Send request to the backend
    try {
        const response = await fetch("/api/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age, weight, height, bloodPressure, familyHistory })
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        document.getElementById("result").innerHTML = `
            <strong>Risk Score:</strong> ${data.riskScore}<br>
            <strong>Risk Category:</strong> ${data.riskCategory}
        `;
    } catch (error) {
        document.getElementById("result").innerText = "Error: Could not fetch data";
        console.error("Fetch error:", error);
    }
});