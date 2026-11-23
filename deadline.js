// Logika yang berhubungan dengan deadline.
// Semua fungsi murni (tidak menyimpan state) supaya mudah dites dan dipakai ulang.

export const PRIORITY_RANK = { low: 0, medium: 1, high: 2 };

// Aturan prioritas minimal berdasarkan sisa hari:
//   - hari H (atau sudah lewat)  -> minimal "high"
//   - H-1 sampai H-3             -> minimal "medium"
//   - lebih dari 3 hari lagi     -> bebas (low / medium / high)
export const MEDIUM_THRESHOLD_DAYS = 3;

const pad = (n) => String(n).padStart(2, "0");

// Tanggal hari ini (zona waktu lokal) dalam format YYYY-MM-DD
export function todayISO(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Geser tanggal hari ini sebanyak `days` hari (dipakai untuk data dummy)
export function offsetDate(days, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return todayISO(d);
}

const toUTC = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

// Selisih hari antara deadline dan hari ini (negatif = sudah lewat)
export function daysUntil(deadline, today = todayISO()) {
  return Math.round((toUTC(deadline) - toUTC(today)) / 86400000);
}

// Prioritas terendah yang boleh dipilih untuk sisa hari tertentu
export function minPriority(daysLeft) {
  if (daysLeft <= 0) return "high";
  if (daysLeft <= MEDIUM_THRESHOLD_DAYS) return "medium";
  return "low";
}

export function maxPriority(a, b) {
  return PRIORITY_RANK[a] >= PRIORITY_RANK[b] ? a : b;
}

// Prioritas minimal untuk sebuah tugas. Tugas yang sudah selesai tidak dipaksa naik.
export function floorPriority(status, deadline, today = todayISO()) {
  if (status === "done" || !deadline) return "low";
  return minPriority(daysUntil(deadline, today));
}

// Menambahkan field turunan ke sebuah tugas:
//   daysLeft          sisa hari ke deadline
//   overdue           true jika belum selesai dan deadline sudah lewat
//   effectivePriority prioritas setelah dinaikkan otomatis (low | medium | high)
//   displayPriority   yang ditampilkan di UI (effectivePriority atau "overdue")
//   boosted           true jika prioritasnya dinaikkan otomatis
export function decorateTodo(todo, today = todayISO()) {
  const daysLeft = daysUntil(todo.deadline, today);
  const done = todo.status === "done";
  const overdue = !done && daysLeft < 0;
  const effectivePriority = maxPriority(todo.priority, floorPriority(todo.status, todo.deadline, today));

  return {
    ...todo,
    daysLeft,
    overdue,
    effectivePriority,
    displayPriority: overdue ? "overdue" : effectivePriority,
    boosted: effectivePriority !== todo.priority,
  };
}

// Teks bantu di samping tanggal deadline
export function deadlineHint(todo) {
  if (todo.status === "done") return "Selesai";
  const n = todo.daysLeft;
  if (n < 0) return `Terlambat ${Math.abs(n)} hari`;
  if (n === 0) return "Hari ini";
  if (n === 1) return "Besok";
  return `${n} hari lagi`;
}

// 2026-11-25 -> 25 Nov 2026
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
