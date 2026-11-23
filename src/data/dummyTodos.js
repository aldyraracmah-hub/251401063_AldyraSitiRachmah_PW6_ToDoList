import { offsetDate } from "../utils/deadline.js";

// Struktur data mengikuti atribut pada kuis dan sama dengan bentuk
// data yang nanti dikembalikan REST API (/api/todos).
export const STATUS_OPTIONS = ["to-do", "in progress", "done"];
export const PRIORITY_OPTIONS = ["low", "medium", "high"];

// Judul tugas diambil dari materi mata kuliah Pemrograman Web (semester 3).
// Deadline dibuat relatif terhadap hari ini supaya setiap aturan prioritas
// otomatis langsung terlihat saat aplikasi dijalankan:
//   id 1 -> sudah lewat (overdue)
//   id 2 -> hari H, prioritas "low" otomatis naik ke "high"
//   id 3 -> H-2, prioritas "low" otomatis naik ke "medium"
//   id 4 -> masih jauh, bebas
//   id 6 -> sudah selesai
export const dummyTodos = [
  {
    id: 1,
    title: "Validasi Form dengan PHP",
    description: "Buat form pendaftaran dengan validasi sisi server menggunakan PHP: cek input kosong, format email, dan panjang password.",
    priority: "medium",
    deadline: offsetDate(-2),
    status: "in progress",
  },
  {
    id: 2,
    title: "Session dan Cookie untuk Login",
    description: "Implementasikan halaman login yang menyimpan sesi pengguna dengan session PHP dan fitur \"ingat saya\" memakai cookie.",
    priority: "low",
    deadline: offsetDate(0),
    status: "in progress",
  },
  {
    id: 3,
    title: "REST API dengan Express.js",
    description: "Buat endpoint CRUD /api/todos menggunakan Node.js dan Express.js, lalu uji dengan Postman.",
    priority: "low",
    deadline: offsetDate(2),
    status: "to-do",
  },
  {
    id: 4,
    title: "Fetch API dan Manipulasi DOM",
    description: "Ambil data dari REST API menggunakan fetch dan tampilkan hasilnya ke halaman lewat manipulasi DOM JavaScript.",
    priority: "medium",
    deadline: offsetDate(6),
    status: "to-do",
  },
  {
    id: 5,
    title: "Aplikasi Todo List dengan React",
    description: "Bangun aplikasi todo list menggunakan komponen React, useState, Context, dan React Router.",
    priority: "high",
    deadline: offsetDate(14),
    status: "in progress",
  },
  {
    id: 6,
    title: "CRUD PHP dan MySQL",
    description: "Selesaikan aplikasi CRUD data mahasiswa dengan PHP native dan database MySQL.",
    priority: "medium",
    deadline: offsetDate(-5),
    status: "done",
  },
  {
    id: 7,
    title: "Routing dan MVC pada Laravel",
    description: "Pelajari konsep routing, controller, view Blade, dan pola MVC pada framework Laravel.",
    priority: "low",
    deadline: offsetDate(21),
    status: "to-do",
  },
];
