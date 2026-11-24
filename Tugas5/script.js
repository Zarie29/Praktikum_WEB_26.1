// Data mahasiswa
let mahasiswa = [
    { nama: "Andi", nim: "23001", nilai: 85 },
    { nama: "Budi", nim: "23002", nilai: 70 },
    { nama: "Citra", nim: "23003", nilai: 90 }
];

// 1. Tambahkan satu data mahasiswa baru
// menggunakan Array dan Object
mahasiswa = [...mahasiswa, { nama: "Dewi", nim: "23004", nilai: 88 }];


// 2. Tampilkan mahasiswa yang nilainya di atas 80
// menggunakan Array Method
const hasil = mahasiswa.filter(m => m.nilai > 80);

console.log(hasil);


// 3. Ambil nama dan NIM mahasiswa pertama
// menggunakan Destructuring
const { nama, nim } = mahasiswa[0];

console.log(nama, nim);


// 4. Buat salinan array mahasiswa menggunakan
// Spread Operator
const dataBaru = [...mahasiswa];


// 5. Ubah data mahasiswa menjadi format JSON
const jsonData = JSON.stringify(mahasiswa);


// 6. Simpan JSON ke Local Storage
localStorage.setItem("mahasiswa", jsonData);


// 7. Ambil kembali data dari Local Storage
const dataTersimpan = JSON.parse(localStorage.getItem("mahasiswa"));


// 8. Simpan nama mahasiswa ke Session Storage
sessionStorage.setItem("nama", mahasiswa[0].nama);


// 9. Tampilkan nama mahasiswa dari Session Storage
console.log(sessionStorage.getItem("nama"));


// 10. Buat tombol yang ketika diklik menampilkan
// pesan "Data berhasil diproses!"
// menggunakan Event Handling

document.getElementById("tombol")
.addEventListener("click", function() {
    alert("Data berhasil diproses!");
    
});