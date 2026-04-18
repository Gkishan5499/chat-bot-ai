import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  question: "",
  answer: "",
  keywords: "",
  minMatches: 1,
  sortOrder: 0,
  isActive: true,
  showOnBot: true,
};

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/faqs");
      setFaqs(res.data || []);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const toPayload = (data) => ({
    question: data.question,
    answer: data.answer,
    keywords: data.keywords,
    minMatches: Number(data.minMatches) || 1,
    sortOrder: Number(data.sortOrder) || 0,
    isActive: Boolean(data.isActive),
    showOnBot: Boolean(data.showOnBot),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, toPayload(form));
        setMessage("FAQ updated");
      } else {
        await api.post("/admin/faqs", toPayload(form));
        setMessage("FAQ created");
      }
      resetForm();
      fetchFaqs();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const editFaq = (faq) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      keywords: (faq.keywords || []).join(", "),
      minMatches: faq.minMatches || 1,
      sortOrder: faq.sortOrder || 0,
      isActive: faq.isActive !== false,
      showOnBot: faq.showOnBot !== false,
    });
  };

  const removeFaq = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      if (editingId === id) resetForm();
      setMessage("FAQ deleted");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to delete FAQ");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ color: "var(--text-h)", fontSize: "1.3rem", fontWeight: 700, marginBottom: 4 }}>
          FAQ Manager
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text)" }}>
          Create and manage chatbot question-answer intents used on the Home page bot.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 20 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Question</label>
            <input
              className="form-input"
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="How do I add the widget to my website?"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer</label>
            <textarea
              className="form-input"
              value={form.answer}
              onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              placeholder="Step-by-step answer for visitors..."
              rows={4}
              required
            />
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1.4fr 0.7fr 0.7fr" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Keywords (comma separated)</label>
              <input
                className="form-input"
                value={form.keywords}
                onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))}
                placeholder="install, widget, html, script"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Min Matches</label>
              <input
                className="form-input"
                type="number"
                min={1}
                value={form.minMatches}
                onChange={(e) => setForm((p) => ({ ...p, minMatches: e.target.value }))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort Order</label>
              <input
                className="form-input"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-h)", fontSize: "0.85rem" }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              />
              Active
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-h)", fontSize: "0.85rem" }}>
              <input
                type="checkbox"
                checked={form.showOnBot}
                onChange={(e) => setForm((p) => ({ ...p, showOnBot: e.target.checked }))}
              />
              Show question on bot
            </label>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update FAQ" : "Create FAQ"}
            </button>
            {editingId && (
              <button className="btn-ghost" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {message && (
          <p style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--text)" }}>{message}</p>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 20, color: "var(--text)" }}>Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div style={{ padding: 20, color: "var(--text)" }}>No FAQs yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Keywords</th>
                <th>Rules</th>
                <th>Status</th>
                <th>Bot Display</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq._id}>
                  <td>
                    <div style={{ color: "var(--text-h)", fontWeight: 600, marginBottom: 4 }}>{faq.question}</div>
                    <div style={{ color: "var(--text)", fontSize: "0.8rem" }}>{faq.answer}</div>
                  </td>
                  <td style={{ color: "var(--text)", fontSize: "0.8rem" }}>
                    {(faq.keywords || []).join(", ")}
                  </td>
                  <td style={{ color: "var(--text)", fontSize: "0.8rem" }}>
                    minMatches: {faq.minMatches || 1}
                    <br />
                    sortOrder: {faq.sortOrder || 0}
                  </td>
                  <td>
                    <span className={`badge ${faq.isActive ? "badge-success" : "badge-danger"}`}>
                      {faq.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${faq.showOnBot !== false ? "badge-success" : "badge-warning"}`}>
                      {faq.showOnBot !== false ? "Shown" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-ghost" onClick={() => editFaq(faq)}>Edit</button>
                      <button className="btn-ghost btn-danger" onClick={() => removeFaq(faq._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
