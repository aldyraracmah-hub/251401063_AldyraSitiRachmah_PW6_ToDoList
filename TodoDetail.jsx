import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTodos } from "../context/TodoContext.jsx";
import TodoModal from "../components/TodoModal.jsx";
import { deadlineHint, formatDate } from "../utils/deadline.js";

export default function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTodo, updateTodo, toggleDone } = useTodos();
  const [showEdit, setShowEdit] = useState(false);

  const todo = getTodo(id);

  if (!todo) {
    return (
      <main className="detail-wrap">
        <section className="detail-card not-found">
          <h2>Tugas tidak ditemukan</h2>
          <p>Tugas dengan ID {id} tidak ada atau sudah dihapus.</p>
          <button className="btn btn-danger" onClick={() => navigate("/")}>Kembali</button>
        </section>
      </main>
    );
  }

  const handleUpdate = (data) => {
    updateTodo(todo.id, data);
    setShowEdit(false);
  };

  const done = todo.status === "done";

  return (
    <main className="detail-wrap">
      <section className="detail-card">
        <div className="detail-left">
          <h3>Judul</h3>
          <p className="detail-text">{todo.title}</p>
          <h3>Deskripsi</h3>
          <div className="detail-desc">{todo.description || "—"}</div>
        </div>

        <div className="detail-right">
          <h3>Status</h3>
          <p className="detail-text">
            <span className={`badge status-${todo.status.replace(" ", "-")}`}>{todo.status}</span>
          </p>
          <h3>Prioritas</h3>
          <p className="detail-text">
            <span className={`badge priority-${todo.displayPriority}`}>{todo.displayPriority}</span>
            {todo.boosted && !todo.overdue && (
              <span className="hint">Naik otomatis karena deadline dekat</span>
            )}
          </p>
          <h3>Deadline</h3>
          <p className="detail-text">
            {formatDate(todo.deadline)}
            <span className={`deadline-hint ${todo.overdue ? "late" : ""}`}>{deadlineHint(todo)}</span>
          </p>

          <div className="detail-actions">
            <button
              className={`btn btn-sm detail-done ${done ? "btn-muted" : "btn-success"}`}
              onClick={() => toggleDone(todo.id)}
            >
              {done ? "Batalkan Selesai" : "Tandai Selesai"}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => navigate("/")}>Kembali</button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowEdit(true)}>Update</button>
          </div>
        </div>
      </section>

      {showEdit && (
        <TodoModal todo={todo} onSubmit={handleUpdate} onClose={() => setShowEdit(false)} />
      )}
    </main>
  );
}
