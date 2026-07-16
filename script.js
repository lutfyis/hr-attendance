// ===========================================
// HR Attendance v1.0
// Checkpoint 7 - Camera Engine
// ===========================================

let html5QrCode;

// ===========================================
// Saat halaman dibuka
// ===========================================
window.onload = function () {
    alert("script jalan");

    startScanner();

};

// ===========================================
// Menyalakan Kamera
// ===========================================
function startScanner() {

    const status = document.getElementById("status");

    status.innerHTML = "🟡 Membuka kamera...";

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(cameras => {

        if (cameras && cameras.length) {

            let cameraId = cameras[cameras.length - 1].id;

            html5QrCode.start(

                cameraId,

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

            });

        } else {

            status.innerHTML = "🔴 Kamera tidak ditemukan";

        }

    }).catch(err => {

        alert(err);

        console.error(err);

        status.innerHTML = "🔴 Gagal membuka kamera";

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
