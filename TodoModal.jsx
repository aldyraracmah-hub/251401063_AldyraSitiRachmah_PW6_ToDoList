import { useEffect, useState } from "react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../data/dummyTodos.js";
import { useTodos } from "../context/TodoContext.jsx";
import { PRIORITY_RANK, daysUntil, floorPriority, maxPriority } from "../utils/deadline.js";

const emptyForm = {
  title: "",
  description: "",
  status: "to-do",
  priority: "low",
  deadline: "",
};

// Dipakai untuk "Tambah Todo" (tanpa prop `todo`) dan "Update Todo" (dengan prop `todo`)
export default function TodoModal({ todo, onSubmit, onClose }) {
  const { today } = useTodos();
  const isEdit = Boolean(todo);
  const [form, setForm] = useState(
    isEdit
      ? {
          title: todo.title,
          description: todo.description,
          status: todo.status,
          // pakai prioritas yang sudah dinaikkan otomatis, bukan nilai lama
          priority: todo.effectivePriority,
          deadline: todo.deadline,
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prioritas terendah yang boleh dipilih berdasarkan deadline & status saat ini
  const floor = floorPriority(form.status, form.deadline, today);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Jika deadline/status berubah dan prioritas jadi terlalu rendah, naikkan otomatis
      next.priority = maxPriority(next.priority, floorPriority(next.status, next.deadline, today));
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Judul wajib diisi";
    if (!form.deadline) {
      next.deadline = "Deadline wajib diisi";
    } else {
      // Deadline di masa lalu hanya boleh jika tidak diubah dari data lama atau tugas sudah selesai
      const changed = !isEdit || form.deadline !== todo.deadline;
      if (changed && form.status !== "done" && form.deadline < today) {
        next.deadline = "Deadline tidak boleh sebelum hari ini";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      priority: maxPriority(form.priority, floor),
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  let priorityHint = "";
  if (floor !== "low" && form.deadline) {
    const n = daysUntil(form.deadline, today);
    priorityHint =
      n < 0
        ? "Deadline sudah lewat, prioritas minimal high."
        : n === 0
        ? "Deadline hari ini, prioritas minimal high."
        : `Deadline ${n} hari lagi, prioritas minimal ${floor}.`;
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 id="modal-title" className="modal-title">
          {isEdit ? "Update Todo" : "Tambah Todo"}
        </h2>

        <div className="field">
          <label htmlFor="title">Judul</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} autoFocus />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="description">Deskripsi</label>
          <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            min={isEdit ? undefined : today}
            onChange={handleChange}
          />
          {errors.deadline && <span className="error">{errors.deadline}</span>}
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Prioritas</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p} disabled={PRIORITY_RANK[p] < PRIORITY_RANK[floor]}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        {priorityHint && <p className="hint hint-warn">{priorityHint}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn-danger" onClick={onClose}>Batal</button>
          <button type="submit" className="btn btn-primary">{isEdit ? "Update" : "Tambah"}</button>
        </div>
      </form>
    </div>
  );
}
