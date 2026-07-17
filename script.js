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

    loadDashboard();

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

        const response = await fetch(
    `${URL_APPS_SCRIPT}?action=attendance&id=${encodeURIComponent(id)}`
);

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

//Dashboard otomatis berubah
async function loadDashboard() {

    try {

        const response = await fetch(
            `${URL_APPS_SCRIPT}?action=dashboard`
        );

        const data = await response.json();

        document.getElementById("total").innerHTML =
            data.total;

        document.getElementById("hadir").innerHTML =
            data.hadir;

        document.getElementById("belum").innerHTML =
            data.belum;

    } catch (err) {

        console.error("Dashboard gagal dimuat", err);

    }

}
// ===========================================
// bunyi beep
// ===========================================
function playBeep(frequency = 800, duration = 150) {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.value = 0.2;

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration);

}

// ===========================================
// QR Berhasil Dibaca
// ===========================================
async function onScanSuccess(decodedText) {

    // Hentikan scanner
    html5QrCode.stop();

    console.log("QR :", decodedText);
    document.getElementById("status").innerHTML =
    "📸 QR berhasil dibaca...";

    // Sembunyikan scanner
    document.querySelector(".scanner").style.display = "none";

    // Tampilkan Result Card
    const card = document.getElementById("resultCard");
    const title = document.getElementById("resultTitle");

title.classList.remove(
    "success-title",
    "warning-title",
    "error-title"
);

    card.style.display = "block";
    // Reset warna card
card.classList.remove(
    "success-card",
    "warning-card",
    "error-card"
);

// Loading
document.getElementById("resultTitle").innerHTML = "⏳ MEMPROSES...";

document.getElementById("nama").innerHTML = "Sedang mengambil data peserta...";

document.getElementById("universitas").innerHTML = "-";

document.getElementById("strata").innerHTML = "-";

document.getElementById("jurusan").innerHTML = "-";

document.getElementById("jam").innerHTML = "-";

document.getElementById("status").innerHTML =
    "🟠 Mengambil data peserta...";

    const peserta = await getParticipant(decodedText);
    await loadDashboard();

if (peserta.success) {

    playBeep(900, 150);

if (navigator.vibrate) {
    navigator.vibrate(100);
}
    card.classList.add("success-card");
    title.classList.add("success-title");

    // ✅ Berhasil
    document.getElementById("resultTitle").innerHTML =
        "✅ ABSENSI BERHASIL";

    document.getElementById("nama").innerHTML =
        peserta.nama;

    document.getElementById("universitas").innerHTML =
        peserta.universitas;

    document.getElementById("strata").innerHTML =
        peserta.strata;

    document.getElementById("jurusan").innerHTML =
        peserta.jurusan;

} else if (peserta.alreadyPresent) {
    playBeep(700, 120);

    setTimeout(() => {
    playBeep(700, 120);
    }, 180);

   if (navigator.vibrate) {
    navigator.vibrate([80, 80, 80]);
    }
    card.classList.add("warning-card");
    title.classList.add("warning-title");


    // ⚠️ Sudah hadir
    document.getElementById("resultTitle").innerHTML =
        "⚠️ SUDAH ABSEN";

    document.getElementById("nama").innerHTML =
        peserta.nama;

    document.getElementById("universitas").innerHTML =
        peserta.universitas;

    document.getElementById("strata").innerHTML =
        peserta.strata;

    document.getElementById("jurusan").innerHTML =
        peserta.jurusan;

    document.getElementById("status").innerHTML =
        "🟠 Peserta sudah melakukan absensi";

} else {
    playBeep(300, 500);

    if (navigator.vibrate) {
    navigator.vibrate(400);
    }

    card.classList.add("error-card");
    title.classList.add("error-title");
   
    // ❌ Tidak ditemukan
    document.getElementById("resultTitle").innerHTML =
        "❌ PESERTA TIDAK DITEMUKAN";

    document.getElementById("nama").innerHTML = "-";
    document.getElementById("universitas").innerHTML = "-";
    document.getElementById("strata").innerHTML = "-";
    document.getElementById("jurusan").innerHTML = "-";

    document.getElementById("status").innerHTML =
        "🔴 QR tidak terdaftar";

}
    document.getElementById("jam").innerHTML =
        new Date().toLocaleTimeString("id-ID");


    // Setelah 3 detik kembali ke scanner
setTimeout(async () => {

    card.style.display = "none";

    document.querySelector(".scanner").style.display = "block";

    try {

        await html5QrCode.clear();

    } catch (e) {
        // abaikan jika scanner sudah bersih
    }

    startScanner();

}, 3000);
}

// ===========================================
// QR Gagal Dibaca
// ===========================================
function onScanFailure(error) {

    // Sengaja dikosongkan
    // Agar tidak memenuhi console

}
