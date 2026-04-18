const API = "http://localhost:3000";
const userId = localStorage.getItem("user_id");

/* ================= CEK LOGIN ================= */
if (!userId) {
    alert("Silakan login dulu!");
    window.location.href = "/login.html";
}

/* ================= NAVBAR TOGGLE ================= */
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }
});

// ================= LOAD =================
async function loadProfile() {
    try {
        const res = await fetch(`${API}/user/${userId}`);
        if (!res.ok) throw new Error("Gagal ambil data");

        const data = await res.json();

        if (!data) return;

        if (document.getElementById("full_name")) {
            document.getElementById("full_name").value = data.full_name || "";
        }

        if (document.getElementById("phone")){
            document.getElementById("phone").value = data.phone || "";
        }

        if (document.getElementById("provinsi")){
            document.getElementById("provinsi").value = data.provinsi || "";
        }

        if (document.getElementById("kota")){
            document.getElementById("kota").value = data.kota || "";
        }

        if (document.getElementById("kecamatan")){
             document.getElementById("kecamatan").value = data.kecamatan || "";
        }

        if (document.getElementById("kode_pos")){
            document.getElementById("kode_pos").value = data.kode_pos || "";
        }

        if (document.getElementById("address")){
             document.getElementById("address").value = data.address || "";
        }

        if (document.getElementById("username")) {
            document.getElementById("username").value = data.username || "";
        }

        if (document.getElementById("email")){
            document.getElementById("email").value = data.email || "";
            document.getElementById("password").value = data.password || "";
        }

            const img = document.getElementById("fotoProfile");

        if (img) {
            
            if (!data.foto) {
                img.src = "img/default.png";
            } else {
                img.src = `${API}/${data.foto.replace(/^\/+/, "")}?t=${Date.now()}`;
            }

            console.log("FOTO URL:", img.src);
        }

    } catch (err) {
        console.error(err);
    }
}

// ================= UPDATE PROFILE =================
async function updateProfile(e) {
    e.preventDefault();

    const data = {
        full_name: document.getElementById("full_name").value,
        phone: document.getElementById("phone").value,
        provinsi: document.getElementById("provinsi").value,
        kota: document.getElementById("kota").value,
        kecamatan: document.getElementById("kecamatan").value,
        kode_pos: document.getElementById("kode_pos").value,
        address: document.getElementById("address").value
    };

    const res = await fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) alert("✅ Profile updated");
    else alert("❌ Gagal update");
}

// ================= UPDATE ACCOUNT =================
async function updateAccount(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // 🔒 VALIDASI
    if (!username || !email) {
        return alert("❌ Username dan email wajib diisi");
    }

    // validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return alert("❌ Format email tidak valid");
    }

    // password minimal 6 karakter (opsional)
    if (password && password.length < 6) {
        return alert("❌ Password minimal 6 karakter");
    }

    const data = { username, email };

    // hanya kirim password kalau diisi
    if (password) {
        data.password = password;
    }

    const res = await fetch(`${API}/account/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
        alert("✅ Account updated");
    } else {
        alert("❌ " + result.message);
    }
}

// ================= UPLOAD FOTO =================
async function uploadFoto(e) {
    e.preventDefault();

    const file = document.getElementById("inputFoto").files[0];
    if (!file) return alert("Pilih foto dulu!");

    const formData = new FormData();
    formData.append("foto", file);

    const res = await fetch(`${API}/upload/${userId}`, {
        method: "POST",
        body: formData
    });

    const result = await res.json();

    const previewEl = document.getElementById("preview");
    if (previewEl) previewEl.src = API + result.path;

    alert("✅ Foto berhasil diupload");
}

// ================= PREVIEW =================
document.addEventListener("change", (e) => {
    if (e.target.id === "inputFoto") {
        const file = e.target.files[0];
        if (file) {
            document.getElementById("preview").src = URL.createObjectURL(file);
        }
    }
});

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadProfile);