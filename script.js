// ===========================================
// HR Attendance v1.0
// Checkpoint 7 - Camera Engine
// ===========================================

let html5QrCode;

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
// QR Berhasil Dibaca
// ===========================================
function onScanSuccess(decodedText) {

    // Hentikan scanner supaya QR tidak terbaca berkali-kali
    html5QrCode.stop();

    document.getElementById("status").innerHTML = `
        <h3>✅ QR Terdeteksi</h3>
        <br>
        <b>${decodedText}</b>
    `;

    console.log("QR :", decodedText);

}

// ===========================================
// QR Gagal Dibaca
// ===========================================
function onScanFailure(error) {

    // Sengaja dikosongkan
    // Agar tidak memenuhi console

}
