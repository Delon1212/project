const express = require("express");
const db = require("./db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static("view_toko"));

// akses folder uploads
app.use("/uploads", express.static("uploads"));

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File harus gambar (jpg/png)"));
    }
  }
});

// ================= ROUTES =================

// redirect awal
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// ================= REGISTER =================
app.post("/register", (req, res) => {
  const {
    username,
    email,
    password,
    full_name,
    phone,
    provinsi,
    kota,
    kecamatan,
    kode_pos,
    address
  } = req.body;

  // VALIDASI
  if (!username || !email || !password || !full_name || !phone ||
      !provinsi || !kota || !kecamatan || !kode_pos || !address) {
    return res.json({ message: "Data kosong" });
  }

  // CEK USERNAME & EMAIL
  db.query(
    "SELECT * FROM users WHERE username=? OR email=?",
    [username, email], // 🔥 FIX DI SINI
    (err, result) => {
      if (err) {
        console.error("ERROR SELECT:", err);
        return res.json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.json({ message: "Username atau email sudah dipakai" });
      }

      // INSERT DATA
      db.query(
        `INSERT INTO users 
        (username, email, password, full_name, phone, provinsi, kota, kecamatan, kode_pos, address) 
        VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [username, email, password, full_name, phone, provinsi, kota, kecamatan, kode_pos, address],
        (err) => {
          if (err) {
            console.error("ERROR INSERT:", err);
            return res.json({ message: "Gagal register" });
          }

          res.json({ message: "Register berhasil" });
        }
      );
    }
  );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        res.json({
          message: "login sukses",
          user_id: result[0].user_id
        });
      } else {
        res.json({ message: "login gagal" });
      }
    }
  );
});

// ================= API =================

// 🔹 GET PROFILE
app.get("/user/:id", (req, res) => {
    db.query("SELECT * FROM users WHERE user_id=?", [req.params.id], (err, result) => {
        if (err) return res.json(err);
        console.log("DATA DB:", result[0]);
        res.json(result[0]);
    });
});

// 🔹 UPDATE PROFILE
app.put("/user/:id", (req, res) => {
    const d = req.body;

    const sql = `
        UPDATE users SET 
        full_name=?, phone=?, provinsi=?, kota=?, kecamatan=?, kode_pos=?, address=?
        WHERE user_id=?
    `;

    db.query(sql, [
        d.full_name, d.phone, d.provinsi, d.kota,
        d.kecamatan, d.kode_pos, d.address,
        req.params.id
    ], (err) => {
        if (err) return res.json(err);
        res.json({ message: "Profile updated" });
    });
});

// 🔹 UPDATE ACCOUNT
app.put("/account/:id", (req, res) => {
    const { username, email, password } = req.body;

    // 🔒 VALIDASI
    if (!username || !email) {
        return res.status(400).json({ message: "Username & email wajib diisi" });
    }

    // validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email tidak valid" });
    }

    // password optional tapi harus aman
    if (password && password.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // 🔍 CEK DUPLIKAT USERNAME / EMAIL
    db.query(
        "SELECT * FROM users WHERE (username=? OR email=?) AND user_id != ?",
        [username, email, req.params.id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Username atau email sudah digunakan"
                });
            }

            // 🔧 UPDATE
            let sql = "UPDATE users SET username=?, email=?";
            let values = [username, email];

            if (password) {
                sql += ", password=?";
                values.push(password);
            }

            sql += " WHERE user_id=?";
            values.push(req.params.id);

            db.query(sql, values, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Gagal update" });
                }

                res.json({ message: "Account updated" });
            });
        }
    );
});

// 🔹 UPLOAD FOTO
app.post("/upload/:id", upload.single("foto"), (req, res) => {
    const filePath = `/uploads/${req.file.filename}`;

    db.query("UPDATE users SET foto=? WHERE user_id=?", [filePath, req.params.id], (err) => {
        if (err) return res.json(err);
        res.json({ message: "Foto uploaded", path: filePath });
    });
});

// ================= START SERVER =================
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});