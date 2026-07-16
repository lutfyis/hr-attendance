// ===========================================
// HR Attendance v1.0 - Stable
// Checkpoint 7
// ===========================================

let html5QrCode;

// Saat halaman dibuka
window.onload = function () {
    startScanner();
};

// Menyalakan kamera
function startScanner() {

    const status = document.getElementById("status");
    status.innerHTML = "🟡 Membuka kamera...";

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.start(
        "reader",
        {
            facingMode: "environment"
        },
        {
            fps: 10,
            qrbox: 250
        },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        console.log(err);
        status.innerHTML = "🔴 Kamera gagal dibuka";
    });
}

// QR berhasil terbaca
function onScanSuccess(decodedText, decodedResult) {

    document.getElementById("status").innerHTML = `
        <h3>✅ QR Terdeteksi</h3>
        <br>
        <b>${decodedText}</b>
    `;

    console.log(decodedText);

}

// QR belum terbaca
function onScanFailure(error) {
    // dikosongkan
}
