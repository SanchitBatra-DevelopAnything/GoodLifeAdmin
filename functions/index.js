const { https } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (!admin.apps.length) {
  admin.initializeApp({
    databaseURL:
      "https://goodlifeadminapp-default-rtdb.asia-southeast1.firebasedatabase.app/",
  });
}

exports.loginParty = https.onRequest(
  { region: "asia-southeast1" },
  (req, res) => {
    cors(req, res, async () => {
      try {
        // ✅ Only POST allowed
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { mobile, areaName } = req.body;

        if (!mobile || !areaName) {
          return res.status(400).json({
            error: "mobile and areaName are required",
          });
        }

        console.log("📥 Login request:", { mobile, areaName });

        // ✅ Query ONLY matching distributor(s)
        const snapshot = await admin
          .database()
          .ref("/Distributors")
          .orderByChild("contact")
          .equalTo(mobile)
          .once("value");

        const data = snapshot.val();

        if (!data) {
          console.log("❌ Mobile not found");
          return res.status(500).json({ error: "Login failed" });
        }

        // ✅ Since contact is unique, take first match
        const distributor = Object.values(data)[0];

        // ✅ Area validation (case-insensitive)
        if (
          !distributor.area ||
          distributor.area.toLowerCase() !== areaName.toLowerCase()
        ) {
          console.log("❌ Area mismatch", {
            expected: distributor.area,
            received: areaName,
          });

          return res.status(500).json({ error: "Login failed" });
        }

        console.log("✅ Login success:", mobile);

        return res.status(200).json(distributor);
      } catch (error) {
        console.error("💥 Error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  }
);