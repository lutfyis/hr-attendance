// ===========================================
// HR Attendance v1.0
// Checkpoint 7 - Camera Engine
// ===========================================
let selectedParticipantId = null;
let html5QrCode;
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwd1-KCKOQjEWHT4r0z_dQ0VFqEhautnNswIxqFLPIXRNH_sULwMVsCoRALAofIYPYN/exec";

// ===========================================
// Saat halaman dibuka
// ===========================================
window.onload = function () {

    loadDashboard();

    startScanner();

    document
        .getElementById("searchInput")
        .addEventListener("keyup", searchParticipant);

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
// SEARCH PESERTA
// ===========================================
async function searchParticipant() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim();

    if (keyword.length < 3) {
        document.getElementById("searchResult").innerHTML = "";
        return;
    }

    try {

        const response = await fetch(
            `${URL_APPS_SCRIPT}?action=search&keyword=${encodeURIComponent(keyword)}`
        );

        const data = await response.json();

        let html = "";

        if (data.length === 0) {

            html = "<p>Tidak ada peserta ditemukan.</p>";

        } else {

            data.forEach(p => {

                html += `
        <div class="search-item"
        onclick="manualAttendance('${p.id}')">

        <strong>${p.nama}</strong><br>

        <small>${p.universitas}</small>

        </div>
`        ;

            });

        }

        document.getElementById("searchResult").innerHTML = html;

    } catch (err) {

        console.error(err);

    }

}
//=====================================================
//Manual attendance
//=======================================================
async function manualAttendance(id){
    await showSearchResult(id);
    document.getElementById("searchInput").value="";
    document.getElementById("searchResult").innerHTML="";


}
// ===========================================
// TAMPILKAN HASIL PENCARIAN
// ===========================================
async function showSearchResult(id){

    const response = await fetch(
        `${URL_APPS_SCRIPT}?action=find&id=${id}`
    );

    const peserta = await response.json();
    console.log("Status peserta:", peserta.status);
    console.log("Response:", peserta);

    if(!peserta.success){
        return;
    }

    const card = document.getElementById("resultCard");
    const title = document.getElementById("resultTitle");

    card.style.display="block";

    card.classList.remove(
        "success-card",
        "warning-card",
        "error-card"
    );

    title.classList.remove(
        "success-title",
        "warning-title",
        "error-title"
    );

    card.classList.add("warning-card");
    title.classList.add("warning-title");

    title.innerHTML="👤 DATA PESERTA";

    document.getElementById("nama").innerHTML=peserta.nama;
    document.getElementById("universitas").innerHTML=peserta.universitas;
    document.getElementById("strata").innerHTML=peserta.strata;
    document.getElementById("jurusan").innerHTML=peserta.jurusan;
    document.getElementById("jam").innerHTML=peserta.jam || "-";

    selectedParticipantId = peserta.id;

    const manualArea = document.getElementById("manualAttendanceArea");

    manualArea.style.display =
    peserta.status === "Hadir" ? "none" : "block";
    if (peserta.status === "Hadir") {

    setTimeout(resetManualAttendance, 3000);

}
}

//==========================================
//Tombol tandai hadir acctivated
//==========================================
async function confirmManualAttendance() {

    if (!selectedParticipantId) {
        return;
    }

    const btn = document.getElementById("btnManualAttendance");

    btn.disabled = true;
    btn.innerHTML = "⏳ Menyimpan...";

    const response = await fetch(
        `${URL_APPS_SCRIPT}?action=attendance&id=${selectedParticipantId}`
    );

    const result = await response.json();

    btn.disabled = false;
    btn.innerHTML = "✅ Tandai Hadir";

    // Refresh dashboard
    await loadDashboard();

    // Tampilkan hasil absensi
    showAttendanceResult(result);

    // Sembunyikan tombol manual
    document.getElementById("manualAttendanceArea").style.display = "none";

    // Kembali siap untuk peserta berikutnya
    setTimeout(resetManualAttendance, 3000);
    
    console.log(result);

}
// ===========================================
// attendance resultt
// ===========================================
function showAttendanceResult(peserta){

    const card = document.getElementById("resultCard");
    const title = document.getElementById("resultTitle");

    card.style.display = "block";

    card.classList.remove(
        "success-card",
        "warning-card",
        "error-card"
    );

    title.classList.remove(
        "success-title",
        "warning-title",
        "error-title"
    );

    if (peserta.success){
        playBeep(900, 150);

        if (navigator.vibrate) {
        navigator.vibrate(100);
        }
        card.classList.add("success-card");
        title.classList.add("success-title");

        title.innerHTML = "✅ ABSENSI BERHASIL";

        document.getElementById("status").innerHTML =
            "🟢 Absensi berhasil";

    }
    else if (peserta.alreadyPresent){
        playBeep(700, 120);

        setTimeout(() => {
        playBeep(700, 120);
        }, 180);

        if (navigator.vibrate) {
        navigator.vibrate([80, 80, 80]);
        }
        card.classList.add("warning-card");
        title.classList.add("warning-title");

        title.innerHTML = "⚠️ SUDAH ABSEN";

        document.getElementById("status").innerHTML =
            "🟠 Peserta sudah melakukan absensi";

    }
    else{
        playBeep(300, 500);

        if (navigator.vibrate) {
        navigator.vibrate(400);
        }
        card.classList.add("error-card");
        title.classList.add("error-title");

        title.innerHTML = "❌ PESERTA TIDAK DITEMUKAN";

        document.getElementById("status").innerHTML =
            "🔴 QR tidak terdaftar";

    }

    document.getElementById("nama").innerHTML =
        peserta.nama || "-";

    document.getElementById("universitas").innerHTML =
        peserta.universitas || "-";

    document.getElementById("strata").innerHTML =
        peserta.strata || "-";

    document.getElementById("jurusan").innerHTML =
        peserta.jurusan || "-";

    document.getElementById("jam").innerHTML =
        peserta.jam || "-";

}
//=============================================
//reset manual attemdance
//============================================
function resetManualAttendance() {

    document.getElementById("resultCard").style.display = "none";

    document.getElementById("manualAttendanceArea").style.display = "none";

    document.getElementById("searchInput").value = "";
    document.getElementById("searchResult").innerHTML = "";

    selectedParticipantId = null;

    document.getElementById("searchInput").focus();

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

showAttendanceResult(peserta);


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
