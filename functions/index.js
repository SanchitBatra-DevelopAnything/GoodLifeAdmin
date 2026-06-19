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
        // Only POST allowed
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

        // Find distributor by mobile
        const distributorSnapshot = await admin
          .database()
          .ref("/Distributors")
          .orderByChild("contact")
          .equalTo(mobile)
          .once("value");

        const distributorData = distributorSnapshot.val();

        if (!distributorData) {
          console.log("❌ Mobile not found");
          return res.status(500).json({ error: "Login failed" });
        }

        const distributor = Object.values(distributorData)[0];

        // Area validation
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

        // Fetch Area Details
        let areaDetails = null;

        if (distributor.areaId) {
          const areaSnapshot = await admin
            .database()
            .ref(`/Areas/${distributor.areaId}`)
            .once("value");

          areaDetails = areaSnapshot.val();
        }

        const response = {
          distributorDetails: {
            allowPayLater: distributor.allowPayLater ?? false,
            area: distributor.area ?? "",
            contact: distributor.contact ?? "",
            deviceToken: distributor.deviceToken ?? "",
            distributorName: distributor.distributorName ?? "",
            machineIds: distributor.machineIds ?? [],
          },
          areaDetails: areaDetails || {},
        };

        console.log("✅ Login success:", mobile);

        return res.status(200).json(response);
      } catch (error) {
        console.error("💥 Error:", error);
        return res.status(500).json({
          error: "Internal server error",
        });
      }
    });
  }
);


exports.getPartyExecutiveDeliveryOrders = https.onRequest(
  { region: "asia-southeast1" },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({
            error: "Method Not Allowed",
          });
        }

        const { partyName } = req.body;

        if (!partyName) {
          return res.status(400).json({
            error: "partyName is required",
          });
        }

        const db = admin.database();

        // -------------------------
        // Active Orders
        // -------------------------
        const activeOrdersSnapshot = await db
          .ref(`/activeOrders/${partyName}`)
          .once("value");

        const activeOrdersData = activeOrdersSnapshot.val() || {};

        const activeOrders = Object.values(activeOrdersData);

        activeOrders.sort((a, b) => {
          const dateA = new Date(
            `${a.orderDate || ""}T${a.orderTime || "00:00:00"}`
          );

          const dateB = new Date(
            `${b.orderDate || ""}T${b.orderTime || "00:00:00"}`
          );

          return dateB - dateA;
        });

        // -------------------------
        // Last 5 Completed Orders
        // -------------------------
        const completedOrdersSnapshot = await db
          .ref(`/completedOrders/${partyName}`)
          .orderByChild("createdAt")
          .limitToLast(5)
          .once("value");

        const completedOrdersData =
          completedOrdersSnapshot.val() || {};

        const completedOrders = Object.values(
          completedOrdersData
        );

        completedOrders.sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        );

        // -------------------------
        // Active First, Completed Later
        // -------------------------
        const orders = [
          ...activeOrders,
          ...completedOrders,
        ];

        return res.status(200).json({
          orders,
        });
      } catch (error) {
        console.error(
          "💥 Error fetching party orders:",
          error
        );

        return res.status(500).json({
          error: "Internal server error",
        });
      }
    });
  }
);


exports.getPartyInquiryOrders = https.onRequest(
  { region: "asia-southeast1" },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({
            error: "Method Not Allowed",
          });
        }

        const { partyName } = req.body;

        if (!partyName) {
          return res.status(400).json({
            error: "partyName is required",
          });
        }

        const db = admin.database();

        // -------------------------
        // Active Orders
        // -------------------------
        const activeOrdersSnapshot = await db
          .ref(`/inquiryOrders/${partyName}`)
          .once("value");

        const activeOrdersData = activeOrdersSnapshot.val() || {};

        const activeOrders = Object.entries(activeOrdersData).map(
          ([firebaseOrderId, order]) => ({
            ...order,
            firebaseOrderId,
          })
        );

        activeOrders.sort((a, b) => {
          const dateA = new Date(
            `${a.orderDate || ""}T${a.orderTime || "00:00:00"}`
          );

          const dateB = new Date(
            `${b.orderDate || ""}T${b.orderTime || "00:00:00"}`
          );

          return dateB - dateA;
        });

        // -------------------------
        // Last 5 Completed Orders
        // -------------------------
        const completedOrdersSnapshot = await db
          .ref(`/completedInquiryOrders/${partyName}`)
          .orderByChild("createdAt")
          .limitToLast(5)
          .once("value");

        const completedOrdersData =
          completedOrdersSnapshot.val() || {};

        const completedOrders = Object.entries(
          completedOrdersData
        ).map(([dispatchedOrderId, order]) => ({
          ...order,
          dispatchedOrderId,
        }));

        completedOrders.sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        );

        // -------------------------
        // Active First, Completed Later
        // -------------------------
        const orders = [
          ...activeOrders,
          ...completedOrders,
        ];

        return res.status(200).json({
          orders,
        });
      } catch (error) {
        console.error(
          "💥 Error fetching party orders:",
          error
        );

        return res.status(500).json({
          error: "Internal server error",
        });
      }
    });
  }
);