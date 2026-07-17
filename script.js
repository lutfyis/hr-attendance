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

// ===========================================
// QR Berhasil Dibaca
// ===========================================
// ===========================================
// QR Berhasil Dibaca
// ===========================================
async function onScanSuccess(decodedText) {

    // Hentikan scanner
    html5QrCode.stop();

    console.log("QR :", decodedText);

    // Sembunyikan scanner
    document.querySelector(".scanner").style.display = "none";

    // Tampilkan Result Card
    const card = document.getElementById("resultCard");

    card.style.display = "block";

    const peserta = await getParticipant(decodedText);

if (!peserta.success) {

    document.getElementById("resultTitle").innerHTML = "❌ PESERTA TIDAK DITEMUKAN";

    document.getElementById("nama").innerHTML = "-";
    document.getElementById("universitas").innerHTML = "-";
    document.getElementById("strata").innerHTML = "-";
    document.getElementById("jurusan").innerHTML = "-";

} else {

    document.getElementById("resultTitle").innerHTML = "✅ ABSENSI BERHASIL";

    document.getElementById("nama").innerHTML = peserta.nama;

    document.getElementById("universitas").innerHTML = peserta.universitas;

    document.getElementById("strata").innerHTML = peserta.strata;

    document.getElementById("jurusan").innerHTML = peserta.jurusan;

}

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
