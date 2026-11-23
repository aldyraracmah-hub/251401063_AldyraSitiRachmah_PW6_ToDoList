import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTodos } from "../context/TodoContext.jsx";
import TodoModal from "../components/TodoModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { CheckIcon, EyeIcon, TrashIcon, UndoIcon } from "../components/Icons.jsx";
import { PRIORITY_RANK, deadlineHint, formatDate } from "../utils/deadline.js";

export default function TodoList() {
  const { todos: allTodos, addTodo, deleteTodo, toggleDone } = useTodos();

  // Urutan: tugas belum selesai dulu (overdue dan deadline terdekat paling atas),
  // jika deadline sama, prioritas lebih tinggi di atas. Tugas selesai di paling bawah.
  const todos = useMemo(() => {
    return [...allTodos].sort((a, b) => {
      const aDone = a.status === "done";
      const bDone = b.status === "done";
      if (aDone !== bDone) return aDone ? 1 : -1;
      if (a.daysLeft !== b.daysLeft) return a.daysLeft - b.daysLeft;
      return PRIORITY_RANK[b.effectivePriority] - PRIORITY_RANK[a.effectivePriority];
    });
  }, [allTodos]);
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleAdd = (data) => {
    addTodo(data);
    setShowAdd(false);
  };

  const handleDelete = () => {
    deleteTodo(toDelete.id);
    setToDelete(null);
  };

  return (
    <main className="page">
      <header className="page-header">
        <h1>Todo List</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          Tambah Todo
        </button>
      </header>

      <div className="table-wrap">
        <table className="todo-table">
          <thead>
            <tr>
              <th className="col-title">Judul</th>
              <th className="col-status">Status</th>
              <th className="col-priority">Prioritas</th>
              <th className="col-deadline">Deadline</th>
              <th className="col-actions center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  Belum ada tugas. Klik “Tambah Todo” untuk membuat tugas pertama.
                </td>
              </tr>
            ) : (
              todos.map((todo) => {
                const done = todo.status === "done";
                return (
                  <tr key={todo.id} className={done ? "row-done" : todo.overdue ? "row-overdue" : ""}>
                    <td className="title-cell" title={todo.title}>{todo.title}</td>
                    <td>
                      <span className={`badge status-${todo.status.replace(" ", "-")}`}>{todo.status}</span>
                    </td>
                    <td>
                      <span
                        className={`badge priority-${todo.displayPriority}`}
                        title={todo.boosted ? "Naik otomatis karena deadline sudah dekat" : undefined}
                      >
                        {todo.displayPriority}
                        {todo.boosted && !todo.overdue ? " ↑" : ""}
                      </span>
                    </td>
                    <td>
                      <div className="deadline-date">{formatDate(todo.deadline)}</div>
                      <div className={`deadline-hint ${todo.overdue ? "late" : todo.daysLeft <= 1 && !done ? "soon" : ""}`}>
                        {deadlineHint(todo)}
                      </div>
                    </td>
                    <td className="center">
                      <div className="actions">
                        <button
                          className={`icon-btn ${done ? "icon-muted" : "icon-success"}`}
                          aria-label={done ? `Batalkan selesai ${todo.title}` : `Tandai selesai ${todo.title}`}
                          title={done ? "Batalkan selesai" : "Tandai selesai"}
                          onClick={() => toggleDone(todo.id)}
                        >
                          {done ? <UndoIcon /> : <CheckIcon />}
                        </button>
                        <button
                          className="icon-btn icon-primary"
                          aria-label={`Lihat detail ${todo.title}`}
                          onClick={() => navigate(`/todo/${todo.id}`)}
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="icon-btn icon-danger"
                          aria-label={`Hapus ${todo.title}`}
                          onClick={() => setToDelete(todo)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && <TodoModal onSubmit={handleAdd} onClose={() => setShowAdd(false)} />}

      {toDelete && (
        <ConfirmDialog
          title="Hapus Todo"
          message={`Yakin ingin menghapus tugas “${toDelete.title}”? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </main>
  );
}
