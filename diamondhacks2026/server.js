import express from "express";
import fs from "fs";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Make sure uploads folder exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Save JSON data to file
const saveData = (data) => {
  const jsonLine = JSON.stringify(data) + "\n";
  fs.appendFileSync(path.join(__dirname, "data.json"), jsonLine, "utf8");
};

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST route for form submission
app.post("/submit", upload.single("image"), (req, res) => {
  const data = {
    name: req.body.name,
    chargers: req.body.chargers === "true",
    wifi: req.body.wifi === "true",
    quiet: req.body.quiet,
    vibe: req.body.vibe,
    description: req.body.description,
    image: req.file ? req.file.filename : null,
  };

  console.log("Received:", data);
  saveData(data);
  res.send("Saved successfully!");
});

// GET all data
app.get("/data", (req, res) => {
  const filePath = path.join(__dirname, "data.json");
  if (!fs.existsSync(filePath)) return res.json([]);

  const lines = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  res.json(lines);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});