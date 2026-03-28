const { DataTypes } = require('sequelize');
const db = require('../config/database');

// Definisi Schema
const Catatan = db.define('catatan', {
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isi: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Ambil semua catatan
Catatan.getAllNotes = async function() {
    return await this.findAll({
        order: [['createdAt', 'DESC']]
    });
};

// Tambah catatan baru
Catatan.createNote = async function(data) {
    return await this.create({
        judul: data.judul,
        isi: data.isi
    });
};

// Update catatan berdasarkan ID
Catatan.updateNote = async function(id, data) {
    const note = await this.findByPk(id);
    if (!note) throw new Error('Catatan tidak ditemukan');
    
    return await note.update({
        judul: data.judul,
        isi: data.isi
    });
};

// Hapus catatan berdasarkan ID
Catatan.deleteNote = async function(id) {
    const note = await this.findByPk(id);
    if (!note) throw new Error('Catatan tidak ditemukan');
    
    return await note.destroy();
};

module.exports = Catatan;