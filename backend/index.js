const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const catatanRoutes = require('./routes/catatanRoutes');
const Catatan = require('./models/Catatan'); // Import model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routing API
app.use('/api/catatan', catatanRoutes);

const PORT = 3000;

// Tes koneksi database dan sinkronisasi model
db.sync().then(() => {
    console.log('Database MySQL & Sequelize Terhubung...');
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Koneksi database gagal:', error);
});