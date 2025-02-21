let selectedImages = [];

document.getElementById('gambar').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
        alert('Maksimum 4 gambar sahaja dibenarkan');
        return;
    }

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            selectedImages.push(event.target.result);
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
});

function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    selectedImages.forEach((image, index) => {
        const container = document.createElement('div');
        container.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = image;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeImage(index);
        
        container.appendChild(img);
        container.appendChild(removeBtn);
        preview.appendChild(container);
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreview();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;

    // Tajuk
    doc.setFontSize(16);
    doc.text('LAPORAN AKTIVITI', 105, yPos, { align: 'center' });

    // Maklumat asas
    doc.setFontSize(12);
    yPos += 20;
    doc.text(`Nama Pelapor: ${document.getElementById('namaPelapor').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Nama Aktiviti: ${document.getElementById('namaAktiviti').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Tarikh: ${document.getElementById('tarikhAktiviti').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Hari: ${document.getElementById('hari').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Masa: ${document.getElementById('masaAktiviti').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Jumlah Kehadiran: ${document.getElementById('jumlahKehadiran').value} pelajar`, 20, yPos);

    // Ulasan
    yPos += 20;
    doc.text('Ulasan:', 20, yPos);
    yPos += 10;
    const ulasan = document.getElementById('ulasan').value;
    const splitUlasan = doc.splitTextToSize(ulasan, 170);
    doc.text(splitUlasan, 20, yPos);

    // Gambar
    if (selectedImages.length > 0) {
        yPos += splitUlasan.length * 7 + 20;
        doc.text('Gambar-gambar Aktiviti:', 20, yPos);
        yPos += 10;

        selectedImages.forEach((image, index) => {
            const xPos = index % 2 === 0 ? 20 : 110;
            const currentYPos = yPos + Math.floor(index / 2) * 80;
            doc.addImage(image, 'JPEG', xPos, currentYPos, 80, 60);
        });
    }

    // Simpan PDF
    const fileName = `Laporan_${document.getElementById('namaAktiviti').value.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}