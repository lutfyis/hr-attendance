// ===========================================
// HR Attendance v1.0
// Checkpoint 7 - Camera Engine
// ===========================================

let html5QrCode;
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwd1-KCKOQjEWHT4r0z_dQ0VFqEhautnNswIxqFLPIXRNH_sULwMVsCoRALAofIYPYN/exec";

// ===========================================
// Saat halaman dibuka
// ===========================================
window.onload = function () {

    startScanner();

};

// ===========================================
// Menyalakan Kamera
// ===========================================
function startScanner() {

    const status = document.getElementById("status");

    status.innerHTML = "🟡 Membuka kamera...";

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }

        },
// ===========================================
// Ambil Data Peserta dari Apps Script
// ===========================================
async function getParticipant(id) {

    try {

        const response = await fetch(`${URL_APPS_SCRIPT}?id=${encodeURIComponent(id)}`);

        const data = await response.json();

        return data;

    } catch (error) {

        console.error("Gagal mengambil data:", error);

        return {
            success: false,
            message: "Tidak dapat terhubung ke server."
        };

    }

}
        onScanSuccess,

        onScanFailure

    ).then(() => {

        status.innerHTML = "🟢 Ready to Scan";

    }).catch(err => {

        console.error(err);

        status.innerHTML =
            "🔴 Kamera gagal dibuka";

    });

}

// ===========================================
// QR Berhasil Dibaca
// ===========================================
// ===========================================
// QR Berhasil Dibaca
// ===========================================
function onScanSuccess(decodedText) {

    // Hentikan scanner
    html5QrCode.stop();

    console.log("QR :", decodedText);

    // Sembunyikan scanner
    document.querySelector(".scanner").style.display = "none";

    // Tampilkan Result Card
    const card = document.getElementById("resultCard");

    card.style.display = "block";

    // Dummy data (nanti diganti dari Google Sheets)
    document.getElementById("resultTitle").innerHTML = "✅ ABSENSI BERHASIL";

    document.getElementById("nama").innerHTML = "Lutfy Ika Sutanti";

    document.getElementById("universitas").innerHTML = "ITS";

    document.getElementById("strata").innerHTML = "S1";

    document.getElementById("jurusan").innerHTML = "Fisika";

    document.getElementById("jam").innerHTML =
        new Date().toLocaleTimeString("id-ID");

    document.getElementById("status").innerHTML =
        "🟢 Absensi Berhasil";

    // Setelah 3 detik kembali ke scanner
    setTimeout(() => {

        card.style.display = "none";

        document.querySelector(".scanner").style.display = "block";

        startScanner();

    },3000);

}

// ===========================================
// QR Gagal Dibaca
// ===========================================
function onScanFailure(error) {

    // Sengaja dikosongkan
    // Agar tidak memenuhi console

}
