import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { dummyTodos } from "../data/dummyTodos.js";
import { decorateTodo, todayISO } from "../utils/deadline.js";

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  // State utama daftar tugas (data asli, tanpa field turunan)
  const [todos, setTodos] = useState(dummyTodos);
  // State untuk umpan balik (toast)
  const [toast, setToast] = useState(null);
  // Tanggal hari ini, diperbarui otomatis agar prioritas/overdue ikut berubah
  // walaupun aplikasi dibiarkan terbuka sampai lewat tengah malam.
  const [today, setToday] = useState(todayISO());

  const nextId = useRef(Math.max(...dummyTodos.map((t) => t.id)) + 1);
  const toastTimer = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setToday(todayISO()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Tambahkan prioritas otomatis, status overdue, dan sisa hari ke setiap tugas
  const decoratedTodos = useMemo(() => todos.map((t) => decorateTodo(t, today)), [todos, today]);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const addTodo = (data) => {
    const newTodo = { ...data, id: nextId.current++ };
    setTodos((prev) => [...prev, newTodo]);
    showToast("Tugas berhasil ditambahkan");
  };

  const updateTodo = (id, data) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...data, id } : t)));
    showToast("Tugas berhasil diperbarui");
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast("Tugas berhasil dihapus");
  };

  // Tandai selesai / batalkan selesai
  const toggleDone = (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const markDone = target.status !== "done";
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: markDone ? "done" : "to-do" } : t))
    );
    showToast(markDone ? "Tugas ditandai selesai" : "Tugas dikembalikan ke to-do");
  };

  const getTodo = (id) => decoratedTodos.find((t) => t.id === Number(id));

  return (
    <TodoContext.Provider
      value={{ todos: decoratedTodos, today, toast, addTodo, updateTodo, deleteTodo, toggleDone, getTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos harus dipakai di dalam TodoProvider");
  return ctx;
}
