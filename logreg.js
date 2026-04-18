const API = "http://localhost:3000";
const userId = localStorage.getItem("user_id");

/* ================= REGISTER ================= */
window.register = async function () {

    console.log("TOMBOL REGISTER DIKLIK");

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const full_name = document.getElementById("full_name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const provinsi = document.getElementById("provinsi").value.trim();
    const kota = document.getElementById("kota").value.trim();
    const kecamatan = document.getElementById("kecamatan").value.trim();
    const kode_pos = document.getElementById("kode_pos").value.trim();
    const address = document.getElementById("address").value.trim();

    // VALIDASI
    if (!username || !email || !password || !full_name || !phone ||
        !provinsi || !kota || !kecamatan || !kode_pos || !address) {
        alert("Isi semua data!");
        return;
    }

    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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
            })
        });

        const data = await res.json();
        console.log("REGISTER RESPONSE:", data);

        // 🔥 SESUAIKAN DENGAN BACKEND
        if (data.message === "Register berhasil") {

            console.log("REGISTER BERHASIL");

            alert("Register berhasil!");

            // redirect ke login (lebih aman)
            window.location.href = "/login.html";

        } else {
            console.log("REGISTER GAGAL");
            alert(data.message || "Register gagal!");
        }

    } catch (err) {
        console.error(err);
        alert("Server error!");
    }
};

/* ================= LOGIN ================= */
window.login = async function () {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Isi username & password!");
        return;
    }

    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (data.message === "login sukses") {

            // 🔥 SIMPAN USER ID
            localStorage.setItem("user_id", data.user_id);

            alert("Login berhasil!");

            // 🔥 PASTIKAN KE SERVER (bukan file://)
            window.location.href = "http://localhost:3000/index.html";

        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Server error!");
    }
};