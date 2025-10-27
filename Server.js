// FAST DELIVERY — Backend (Node.js + Express)
// Muallif: Shohjahon Pardayev
// Saqlaydi: orders.json faylida

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = "./orders.json";

app.use(cors());
app.use(bodyParser.json());

// 🗃️ Fayl mavjud bo‘lmasa, bo‘sh massiv yaratamiz
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]", "utf8");

// 🔹 Barcha buyurtmalarni olish
app.get("/api/orders", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Buyurtmalarni o‘qishda xato" });
  }
});

// 🔹 Yangi buyurtma qo‘shish
app.post("/api/orders", (req, res) => {
  try {
    const order = req.body;
    order.id = "FD" + Date.now();
    order.created = new Date().toISOString();
    order.paid = order.paid || false;

    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data.unshift(order);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");

    res.json({ message: "✅ Buyurtma qabul qilindi", order });
  } catch (err) {
    res.status(500).json({ error: "Buyurtma saqlashda xato" });
  }
});

// 🔹 Buyurtmani o‘chirish
app.delete("/api/orders/:id", (req, res) => {
  try {
    const id = req.params.id;
    let data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    data = data.filter(o => o.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "🗑️ Buyurtma o‘chirildi", id });
  } catch (err) {
    res.status(500).json({ error: "O‘chirishda xato" });
  }
});

// 🔹 Buyurtmani to‘lov qilindi deb belgilash
app.put("/api/orders/:id/paid", (req, res) => {
  try {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    const order = data.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });

    order.paid = true;
    order.tx = "TX_" + Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "💰 To‘lov belgilandi", order });
  } catch (err) {
    res.status(500).json({ error: "To‘lov belgilashda xato" });
  }
});

// 🔹 Test uchun asosiy sahifa
app.get("/", (req, res) => {
  res.send("FAST DELIVERY backend ishlayapti 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
