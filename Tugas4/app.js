// ---------- 1. Mengambil elemen dari HTML (getElementById) ----------
const formMhs = document.getElementById("formMhs");
const inputNama = document.getElementById("inputNama");
const inputNim = document.getElementById("inputNim");
const inputJurusan = document.getElementById("inputJurusan");
const inputNilai = document.getElementById("inputNilai");
const pesanError = document.getElementById("pesanError");
const judulForm = document.getElementById("judulForm");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");

const tabelBody = document.getElementById("tabelBody");
const pesanKosong = document.getElementById("pesanKosong");
const inputCari = document.getElementById("inputCari");
const filterJurusan = document.getElementById("filterJurusan");

const totalMhs = document.getElementById("totalMhs");
const rataNilai = document.getElementById("rataNilai");
const nilaiTertinggi = document.getElementById("nilaiTertinggi");

// ---------- 2. Data mahasiswa ----------
// Data awal (dipakai kalau Local Storage masih kosong / rusak)
const dataAwal = [
    { nama: "Andi", nim: "23001", jurusan: "Teknik Informatika", nilai: 85 },
    { nama: "Budi", nim: "23002", jurusan: "Sistem Informasi", nilai: 70 },
    { nama: "Citra", nim: "23003", jurusan: "Teknik Komputer", nilai: 90 }
];

// Fungsi membaca Local Storage dengan aman.
// try...catch dipakai supaya kalau storage diblokir atau isinya rusak,
// program tidak berhenti dan tabel tetap tampil.
function ambilData() {
    try {
        const tersimpan = JSON.parse(localStorage.getItem("dataMahasiswa"));
        if (Array.isArray(tersimpan)) {
            return tersimpan;
        }
    } catch (error) {
        console.log("Local Storage tidak bisa dibaca:", error.message);
    }
    return dataAwal.slice();
}

let mahasiswa = ambilData();

// Penanda mode edit (null artinya sedang mode tambah)
let indexEdit = null;

// ---------- 3. Fungsi menyimpan ke Local Storage ----------
function simpanData() {
    try {
        localStorage.setItem("dataMahasiswa", JSON.stringify(mahasiswa));
    } catch (error) {
        console.log("Local Storage tidak bisa ditulis:", error.message);
    }
}

// ---------- 4. Fungsi membuat satu sel tabel ----------
// Memakai textContent (bukan innerHTML) supaya teks dari input
// tidak dianggap kode HTML.
function buatSel(isi, kelas) {
    const sel = document.createElement("td");
    sel.textContent = isi;
    if (kelas) {
        sel.classList.add(kelas);
    }
    return sel;
}

// ---------- 5. Fungsi menampilkan tabel ----------
function tampilkanTabel() {
    // kosongkan isi tabel dulu
    tabelBody.innerHTML = "";

    // ambil kata kunci pencarian dan jurusan yang dipilih
    const kataCari = inputCari.value.toLowerCase();
    const jurusanDipilih = filterJurusan.value;

    // filter data sesuai pencarian dan jurusan
    const hasil = mahasiswa.filter(function (m) {
        const cocokCari =
            m.nama.toLowerCase().includes(kataCari) ||
            m.nim.includes(kataCari);
        const cocokJurusan =
            jurusanDipilih === "semua" || m.jurusan === jurusanDipilih;
        return cocokCari && cocokJurusan;
    });

    // tampilkan pesan kalau data kosong (classList)
    if (hasil.length === 0) {
        pesanKosong.classList.remove("sembunyi");
    } else {
        pesanKosong.classList.add("sembunyi");
    }

    // buat baris tabel untuk setiap mahasiswa
    hasil.forEach(function (m, urutan) {
        // index asli di array utama (dipakai untuk edit dan hapus)
        const indexAsli = mahasiswa.indexOf(m);

        // createElement untuk membuat baris baru
        const baris = document.createElement("tr");

        const lulus = m.nilai >= 70;

        baris.appendChild(buatSel(urutan + 1));
        baris.appendChild(buatSel(m.nama));
        baris.appendChild(buatSel(m.nim));
        baris.appendChild(buatSel(m.jurusan));
        baris.appendChild(buatSel(m.nilai));
        baris.appendChild(buatSel(lulus ? "Lulus" : "Tidak Lulus", lulus ? "lulus" : "tidak-lulus"));

        // kolom aksi (tombol edit dan hapus)
        const kolomAksi = document.createElement("td");

        const tombolEdit = document.createElement("button");
        tombolEdit.type = "button";
        tombolEdit.textContent = "Edit";
        tombolEdit.classList.add("btn-edit");
        tombolEdit.addEventListener("click", function () {
            editMahasiswa(indexAsli);
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";
        tombolHapus.classList.add("btn-hapus");
        tombolHapus.addEventListener("click", function () {
            hapusMahasiswa(indexAsli);
        });

        // appendChild untuk memasukkan elemen ke dalam elemen lain
        kolomAksi.appendChild(tombolEdit);
        kolomAksi.appendChild(tombolHapus);
        baris.appendChild(kolomAksi);
        tabelBody.appendChild(baris);
    });

    tampilkanStatistik();
}

// ---------- 6. Fungsi menampilkan statistik ----------
function tampilkanStatistik() {
    totalMhs.textContent = mahasiswa.length;

    if (mahasiswa.length === 0) {
        rataNilai.textContent = 0;
        nilaiTertinggi.textContent = 0;
        return;
    }

    // hitung total nilai dengan reduce
    const jumlah = mahasiswa.reduce(function (total, m) {
        return total + m.nilai;
    }, 0);
    rataNilai.textContent = (jumlah / mahasiswa.length).toFixed(1);

    // cari nilai tertinggi
    const semuaNilai = mahasiswa.map(function (m) {
        return m.nilai;
    });
    nilaiTertinggi.textContent = Math.max(...semuaNilai);
}

// ---------- 7. Fungsi menambah / mengubah data (event submit) ----------
formMhs.addEventListener("submit", function (event) {
    // mencegah halaman reload
    event.preventDefault();

    // ambil nilai dari input
    const nama = inputNama.value.trim();
    const nim = inputNim.value.trim();
    const jurusan = inputJurusan.value;
    const nilai = Number(inputNilai.value);

    // validasi input
    if (nama === "" || nim === "" || jurusan === "" || inputNilai.value === "") {
        pesanError.textContent = "Semua kolom harus diisi!";
        return;
    }

    if (nilai < 0 || nilai > 100) {
        pesanError.textContent = "Nilai harus antara 0 sampai 100!";
        return;
    }

    // cek NIM tidak boleh sama dengan data lain
    const nimSudahAda = mahasiswa.some(function (m, i) {
        return m.nim === nim && i !== indexEdit;
    });
    if (nimSudahAda) {
        pesanError.textContent = "NIM sudah terdaftar!";
        return;
    }

    pesanError.textContent = "";

    const dataBaru = { nama: nama, nim: nim, jurusan: jurusan, nilai: nilai };

    if (indexEdit === null) {
        // mode tambah
        mahasiswa.push(dataBaru);
    } else {
        // mode edit
        mahasiswa[indexEdit] = dataBaru;
    }

    simpanData();
    resetForm();

    // PERBAIKAN: kosongkan pencarian dan filter supaya data yang baru
    // diinput pasti kelihatan di tabel (sebelumnya bisa "hilang" karena
    // tersaring oleh kata cari / filter jurusan yang masih aktif).
    inputCari.value = "";
    filterJurusan.value = "semua";

    tampilkanTabel();
});

// ---------- 8. Fungsi hapus data ----------
function hapusMahasiswa(index) {
    const yakin = confirm("Yakin ingin menghapus data " + mahasiswa[index].nama + "?");
    if (yakin) {
        mahasiswa.splice(index, 1);
        simpanData();
        tampilkanTabel();
    }
}

// ---------- 9. Fungsi edit data ----------
function editMahasiswa(index) {
    const m = mahasiswa[index];

    // isi form dengan data yang mau diedit
    inputNama.value = m.nama;
    inputNim.value = m.nim;
    inputJurusan.value = m.jurusan;
    inputNilai.value = m.nilai;

    // ubah tampilan form menjadi mode edit
    indexEdit = index;
    judulForm.textContent = "Edit Data Mahasiswa";
    btnSimpan.textContent = "Simpan Perubahan";
    btnBatal.classList.remove("sembunyi");

    // scroll ke atas supaya form kelihatan
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- 10. Fungsi reset form ----------
function resetForm() {
    formMhs.reset();
    indexEdit = null;
    judulForm.textContent = "Tambah Data Mahasiswa";
    btnSimpan.textContent = "Tambah";
    btnBatal.classList.add("sembunyi");
    pesanError.textContent = "";
}

// tombol batal edit
btnBatal.addEventListener("click", resetForm);

// ---------- 11. Event untuk pencarian dan filter ----------
inputCari.addEventListener("input", tampilkanTabel);
filterJurusan.addEventListener("change", tampilkanTabel);

// ---------- 12. Tampilkan data pertama kali saat halaman dibuka ----------
tampilkanTabel();