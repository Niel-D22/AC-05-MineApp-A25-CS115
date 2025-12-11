const db = require("../config/db");

exports.createNotif = (req, res) => {
    const userId = req.user.id;
    const { title, message, type, reference_id } = req.body;

    if(!title || !message) {
        return res.status(400).json({message: "Title dan message wajib diisi, bos!"});
    }

    const query = "INSERT INTO notifications_new (user_id, title, message, type, reference_id, is_read, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())";

    db.query(query, [userId, title, message, type || 'info', reference_id || null], (err, result) => {
        if (err) {
            console.error("Error insert notifikasi:", err);
            return res.status(500).json({ message: "Gagal membuat notifikasi" });
        }
        res.status(201).json({ message: "Notifikasi berhasil dibuat", id: result.insertId });
    });
};

exports.getNotif = (req, res) => {
    const currentUserId = req.user.id;

    const query = `
        SELECT 
            n.id, 
            n.title, 
            n.message, 
            n.type, 
            n.reference_id, 
            n.created_at,
            CASE 
                WHEN nr.id IS NOT NULL THEN 1 
                ELSE 0 
            END AS is_read
        FROM notifications_new n
        LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.user_id = ?
        ORDER BY n.created_at DESC 
        LIMIT 20
    `;

    db.query(query, [currentUserId], (err, results) => {
        if (err) {
            console.error("Error database:", err);
            return res.status(500).json({ message: "Gagal ngambil data." });
        }
        res.status(200).json(results);
    });
};

exports.markedNotif = (req, res) => {
    const messageId = req.params.id;
    const currentUserId = req.user.id;

    const checkQuery = "SELECT * FROM notification_reads WHERE notification_id = ? AND user_id = ?";

    db.query(checkQuery, [messageId, currentUserId], (err, results) => {
        if (err) return res.status(500).json({message: "Error cek database"});
        
        if (results.length === 0) {
            const insertQuery = "INSERT INTO notification_reads (notification_id, user_id) VALUES (?, ?)";
            db.query(insertQuery, [messageId, currentUserId], (err, result) => {
                if (err) return res.status(500).json({message: "Gagal update status baca"});
                return res.status(200).json({message: "Pesan ditandai sudah dibaca"});
            });
        } else {
            return res.status(200).json({message: "Pesan sudah dibaca sebelumnya"});
        }
    });
};

exports.deleteNotif = (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM notifications_new WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }
        const cleanReads = "DELETE FROM notification_reads WHERE notification_id = ?";
        db.query(cleanReads, [id]);
        res.status(200).json({ message: "Pesan berhasil dihapus." });
    });
};