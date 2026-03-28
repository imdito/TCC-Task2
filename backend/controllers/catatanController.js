const Catatan = require('../models/Catatan');

// 1. Ambil semua catatan
const getCatatan = async (req, res) => {
    try {
        const notes = await Catatan.getAllNotes();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Tambah catatan baru
const createCatatan = async (req, res) => {
    try {
        const newNote = await Catatan.createNote(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update catatan
const updateCatatan = async (req, res) => {
    try {
        await Catatan.updateNote(req.params.id, req.body);
        res.status(200).json({ message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        const statusCode = error.message === 'Catatan tidak ditemukan' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// 4. Hapus catatan
const deleteCatatan = async (req, res) => {
    try {
        await Catatan.deleteNote(req.params.id);
        res.status(200).json({ message: 'Catatan berhasil dihapus' });
    } catch (error) {
        const statusCode = error.message === 'Catatan tidak ditemukan' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

module.exports = {
    getCatatan,
    createCatatan,
    updateCatatan,
    deleteCatatan
};