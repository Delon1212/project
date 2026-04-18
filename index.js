document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }
});

//sistem keranjang index
const produk = {
    P001: { nama: "Buku Inspirasi", harga: 75000 },
    P002: { nama: "Buku Bisnis", harga: 90000 },
    P003: { nama: "Novel Modern", harga: 65000 }
};

function tambahKeKeranjang(event, id) {
    event.preventDefault();

    let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    let item = produk[id];

    let existing = keranjang.find(p => p.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        keranjang.push({
            id: id,
            nama: item.nama,
            harga: item.harga,
            qty: 1
        });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    alert(item.nama + " ditambahkan!");
}