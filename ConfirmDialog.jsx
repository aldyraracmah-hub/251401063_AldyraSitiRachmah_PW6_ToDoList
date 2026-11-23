export default function ConfirmDialog({ title, message, confirmLabel = "Hapus", onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="modal modal-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="modal-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="form-actions">
          <button type="button" className="btn btn-danger" onClick={onCancel}>Batal</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
