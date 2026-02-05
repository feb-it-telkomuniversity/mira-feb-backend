-- Membuat Database (Opsional, jika belum ada)
CREATE DATABASE IF NOT EXISTS wa_bot_db;
USE wa_bot_db;

-- --------------------------------------------------------
-- BAGIAN 1: STRUKTUR TABEL
-- --------------------------------------------------------

--
-- Struktur tabel untuk `conversations`
-- Menyimpan sesi atau state dari setiap percakapan.
--
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone_number VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(200) NULL,
  role ENUM('mahasiswa', 'dosen') NULL,
  identifier VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category ENUM('Sidang','Keuangan','Wisuda', 'Sekretariat', 'Wadek1', 'Wadek2', 'ProdiS1', 'ProdiS2') NULL,
  last_bot_message_id INT NULL,
  step ENUM('select_role', 'ask_lecturer_name', 'lecturer_select_unit', 'ask_student_nim', 'ask_student_name', 'menu','chat', 'awaiting_feedback') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--
-- Struktur tabel untuk `messages`
-- Menyimpan setiap pesan yang masuk dan keluar.
--
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender ENUM('user','bot','admin') NOT NULL,
  message_text TEXT NOT NULL,
  need_human BOOLEAN DEFAULT FALSE,
  feedback ENUM('1','2','3') NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

--
-- Struktur tabel untuk `unresolved`
-- Berfungsi sebagai sistem tiket untuk pesan yang butuh penanganan admin.
--
CREATE TABLE unresolved (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  status ENUM('open','in_progress','resolved') DEFAULT 'open',
  assigned_to VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  target_person VARCHAR(200) NOT NULL,
  target_phone_number VARCHAR(30) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_description TEXT NOT NULL,
  event_time DATETIME NOT NULL,
  reminder_time DATETIME NOT NULL,
  status ENUM('draft','pending','sent','cancelled') DEFAULT 'pending',
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- --------------------------------------------------------
-- BAGIAN 2: DATA DUMMY
-- --------------------------------------------------------

--
-- Isi data dummy untuk tabel `conversations` (15 Sesi)
--

INSERT INTO `users` (`id`, `phone_number`, `name`, `role`, `identifier`) VALUES
-- Mahasiswa
(1, '6281234567890@c.us', 'Andi Saputra', 'mahasiswa', '10123001'),
(2, '6281234567891@c.us', 'Beni Wijaya', 'mahasiswa', '10123002'),
(3, '6281234567892@c.us', 'Budi Darmawan', 'mahasiswa', '10123003'),
(4, '6281234567893@c.us', 'Cici Aulia', 'mahasiswa', '10123004'),
(5, '6281234567895@c.us', 'Dodi Setiawan', 'mahasiswa', '10123006'),
-- Dosen
(6, '6287711112222@c.us', 'Dr. Indah Permatasari', 'dosen', 'D1001'),
(7, '6287711113333@c.us', 'Prof. Dr. Agus Nugroho', 'dosen', 'D1002');

INSERT INTO `conversations` (`id`, `user_id`, `category`, `last_bot_message_id`, `step`) VALUES
(1, 1, 'Sidang', 2, 'awaiting_feedback'), 
(2, 2, 'Keuangan', 6, 'menu'),
(3, 3, 'Wisuda', NULL, 'menu'),
(4, 4, 'Sidang', 12, 'awaiting_feedback'),
(5, 5, NULL, NULL, 'ask_name'),
(6, 6, 'Sidang', NULL, 'chat'),
(7, 7, NULL, NULL, 'menu');

--
-- Isi data dummy untuk tabel `messages` (Beberapa pesan per-sesi)
--
INSERT INTO `messages` (`id`, `conversation_id`, `sender`, `message_text`, `need_human`, `feedback`) VALUES
-- Sesi 1: Andi (Mahasiswa, Sidang, butuh bantuan)
(1, 1, 'user', 'Info pendaftaran sidang dong', 0, NULL),
(2, 1, 'bot', 'Pendaftaran sidang dibuka tgl 1-15 Oktober ya. Apakah jawaban ini membantu?', 1, '3'),
-- Sesi 2: Beni (Mahasiswa, Keuangan, solved)
(3, 2, 'user', 'Berapa biaya SKS semester ini?', 0, NULL),
(4, 2, 'bot', 'Biaya SKS adalah Rp 350.000 per SKS. Apakah jawaban ini membantu?', 0, '1'),
(5, 2, 'user', '1', 0, NULL),
(6, 2, 'bot', 'Syukurlah kalau begitu! Terima kasih feedback-nya ya. 😊 Ada lagi yang bisa dibantu?', 0, NULL),
-- Sesi 3: Budi (Mahasiswa, Wisuda, di menu)
(7, 3, 'user', '3', 0, NULL),
(8, 3, 'bot', 'Anda memilih kategori Wisuda. Silakan tanyakan apa yang ingin kamu ketahui.', 0, NULL),
-- Sesi 4: Cici (Mahasiswa, Sidang, butuh bantuan)
(9, 4, 'user', 'Syarat berkasnya apa aja?', 0, NULL),
(10, 4, 'bot', 'Syaratnya transkrip dan surat bebas perpus. Apakah jawaban ini membantu?', 1, '2'),
(11, 4, 'user', '2', 0, NULL),
(12, 4, 'bot', 'Terima kasih atas masukannya. 🙏 Pesan ini sudah kami tandai untuk ditinjau oleh admin...', 0, NULL),
-- Sesi 5: Dodi (Mahasiswa, proses input nama)
(13, 5, 'user', '10123006', 0, NULL),
(14, 5, 'bot', 'Oke, NIM kamu 10123006 sudah tercatat. 👍\n\nSelanjutnya, boleh info nama lengkapmu?', 0, NULL),
-- Sesi 6: Dr. Indah (Dosen, Sidang, di chat)
(15, 6, 'user', 'Jadwal sidang mahasiswa bimbingan saya', 0, NULL),
(16, 6, 'bot', 'Tentu, Bu Indah. Untuk melihat jadwal, silakan akses Portal Akademik Dosen pada menu "Bimbingan Akademik".', 0, NULL),
-- Sesi 7: Prof. Agus (Dosen, di menu)
(17, 7, 'user', 'info akademik', 0, NULL),
(18, 7, 'bot', 'Halo lagi, Prof. Dr. Agus Nugroho! Silakan pilih kategori...', 0, NULL);

--
-- Isi data dummy untuk tabel `unresolved` (hanya untuk pesan yang `need_human` = TRUE)
--
INSERT INTO `unresolved` (`message_id`, `status`, `assigned_to`) VALUES
(2, 'open', NULL),
(10, 'in_progress', 'Admin_Rina');