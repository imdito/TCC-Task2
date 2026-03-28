const apiUrl = 'http://localhost:3000/api/catatan';

// Elemen DOM
const form = document.getElementById('form-catatan');
const formTitle = document.getElementById('form-title');
const inputId = document.getElementById('note-id');
const inputJudul = document.getElementById('judul');
const inputIsi = document.getElementById('isi');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const daftarCatatan = document.getElementById('daftar-catatan');
const noteCountSpan = document.getElementById('note-count');
const emptyState = document.getElementById('empty-state');

// Daftar warna pastel untuk background kartu
const pastelColors = [
    { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-950', btn: 'bg-amber-200 hover:bg-amber-300 text-amber-900' },
    { bg: 'bg-sky-100', border: 'border-sky-200', text: 'text-sky-950', btn: 'bg-sky-200 hover:bg-sky-300 text-sky-900' },
    { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-950', btn: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' },
    { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-950', btn: 'bg-rose-200 hover:bg-rose-300 text-rose-900' },
    { bg: 'bg-violet-100', border: 'border-violet-200', text: 'text-violet-950', btn: 'bg-violet-200 hover:bg-violet-300 text-violet-900' },
];

// Ambil dan tampilkan data
async function loadCatatan() {
    try {
        const response = await fetch(apiUrl);
        const catatan = await response.json();
        
        // Update jumlah catatan
        noteCountSpan.textContent = `${catatan.length} Catatan`;
        
        if (catatan.length === 0) {
            daftarCatatan.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            daftarCatatan.classList.remove('hidden');
            emptyState.classList.add('hidden');
            renderCatatan(catatan);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render HTML menggunakan class Tailwind (Tampilan Grid Baru)
function renderCatatan(catatan) {
    daftarCatatan.innerHTML = '';
    
    catatan.forEach((note, index) => {
        const color = pastelColors[index % pastelColors.length];
        
        const date = new Date(note.createdAt).toLocaleString('id-ID', {
            dateStyle: 'medium', 
        });

        // Trik agar aman dari spasi/enter (newline), kutip tunggal, dan kutip ganda
        const safeJudul = note.judul.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeIsi = note.isi.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        
        const card = document.createElement('div');
        card.className = `${color.bg} ${color.border} border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group min-h-[250px]`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start gap-2 mb-3">
                    <h3 class="text-lg font-semibold ${color.text} leading-tight">${note.judul}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ${color.text} opacity-30 flex-shrink-0 mt-1">
                        <path d="M10 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm1.21 4.933a6.5 6.5 0 0 1 4.69 4.69.75.75 0 1 1-1.4.534 5 5 0 0 0-3.61-3.61.75.75 0 1 1 .534-1.4ZM4.62 4.1a.75.75 0 0 1 1.06 0L16 14.42a.75.75 0 0 1-1.06 1.06L4.62 5.16a.75.75 0 0 1 0-1.06Z" />
                        <path d="M6.28 11.28a.75.75 0 0 1 1.06 0L10 13.94l2.66-2.66a.75.75 0 1 1 1.06 1.06l-3.19 3.19a.75.75 0 0 1-1.06 0l-3.19-3.19a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                </div>
                <p class="text-slate-700 whitespace-pre-wrap mb-6 text-sm leading-relaxed opacity-90">${note.isi}</p>
            </div>
            
            <div class="flex items-center justify-between gap-2 border-t border-black/5 pt-4">
                <span class="text-xs font-medium text-slate-500">${date}</span>
                <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button class="${color.btn} p-2 rounded-lg transition" title="Edit Catatan"
                        onclick="editCatatan(${note.id}, '${safeJudul}', '${safeIsi}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 1 10 6H4.75v10.25h10.25V10a.75.75 0 0 1 1.5 0v5.25c0 .69-.56 1.25-1.25 1.25H4.75A1.25 1.25 0 0 1 3.5 14.75V5.75Z" />
                        </svg>
                    </button>
                    <button class="bg-white/50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition hover:text-rose-700" title="Hapus Catatan"
                        onclick="hapusCatatan(${note.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                            <path fill-rule="evenodd" d="M8.75 3A2.75 2.75 0 0 0 6 5.75v.456c-1.116.119-2.234.261-3.342.427a.75.75 0 0 0 .138 1.487 12.604 12.604 0 0 0 3.318-.417v2.382c0 1.514 1.16 2.716 2.68 2.812 1.057.066 2.119.066 3.176 0 1.52-.096 2.68-1.298 2.68-2.812V7.707c.994.28 1.989.165 2.978.385a.75.75 0 0 0 .138-1.487 12.661 12.661 0 0 0-3.342-.427V5.75A2.75 2.75 0 0 0 11.25 3h-2.5ZM10 6c-1.237 0-2.474.033-3.71.097V5.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.347C11.237 6.033 10 6 10 6Zm3.94 2.736a.75.75 0 0 1 .718.78 11.212 11.212 0 0 1-.41 3.977c-.12.57-.6 1.003-1.185 1.008-.77.007-1.54.01-2.31.01-.77 0-1.54-.003-2.31-.01-.584-.005-1.065-.438-1.185-1.008a11.213 11.213 0 0 1-.41-3.977.75.75 0 0 1 1.498-.154c.131 1.3.261 2.6.391 3.902.004.042.017.06.022.06.77.007 1.54.01 2.31.01.77 0 1.54-.003 2.31-.01.005 0 .018-.018.022-.06.13-1.303.26-2.602.391-3.903a.75.75 0 0 1 .781-.718Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        daftarCatatan.appendChild(card);
    });
}
// Tambah atau Update data
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = inputId.value;
    const data = {
        judul: inputJudul.value,
        isi: inputIsi.value
    };

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...`;

    try {
        if (id) {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        resetForm();
        loadCatatan();
    } catch (error) {
        console.error('Error saving data:', error);
    } finally {
        btnSubmit.disabled = false;
    }
});

// Siapkan form untuk Edit
window.editCatatan = function(id, judul, isi) {
    // Scroll ke form
    document.getElementById('form-section').scrollIntoView();
    
    formTitle.textContent = 'Edit Catatan';
    inputId.value = id;
    inputJudul.value = judul;
    inputIsi.value = isi;
    inputJudul.focus();
    
    btnSubmit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 1 10 6H4.75v10.25h10.25V10a.75.75 0 0 1 1.5 0v5.25c0 .69-.56 1.25-1.25 1.25H4.75A1.25 1.25 0 0 1 3.5 14.75V5.75Z" /></svg> Update Catatan`;
    btnSubmit.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    btnSubmit.classList.add('bg-amber-600', 'hover:bg-amber-700'); // Ganti warna tombol saat edit
    btnCancel.classList.remove('hidden');
};

// Hapus data
window.hapusCatatan = async function(id) {
    // Gunakan custom confirm popup jika ingin lebih cantik, tapi confirm default cukup aman
    if (confirm('Yakin ingin menghapus catatan ini? Tindakan ini tidak bisa dibatalkan.')) {
        try {
            await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            loadCatatan();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }
};

// Reset Form
btnCancel.addEventListener('click', resetForm);

function resetForm() {
    formTitle.textContent = 'Buat Catatan Baru';
    inputId.value = '';
    form.reset();
    btnSubmit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg> Simpan Catatan`;
    btnSubmit.classList.remove('bg-amber-600', 'hover:bg-amber-700');
    btnSubmit.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    btnCancel.classList.add('hidden');
}

// Load data pertama kali saat halaman dibuka
loadCatatan();