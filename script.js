// =====================================
// HR Attendance v1.0
// Camera Engine
// =====================================

window.onload = function () {

    startScanner();

};

function startScanner() {

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

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

        console.error(err);

        document.getElementById("status").innerHTML =
            "🔴 Kamera gagal dibuka";

    });

}

function onScanSuccess(decodedText) {

    document.getElementById("status").innerHTML =
        "🟢 QR Terdeteksi";

    console.log(decodedText);

}

function onScanFailure(error) {

    // sementara dikosongkan

}
