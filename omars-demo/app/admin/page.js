'use client';
import { useState } from 'react';

const TABS = {
  'menu-items': {
    label: 'Menu Items',
    endpoint: '/api/admin/menu-items',
    fields: ['category', 'name', 'description', 'price'],
    display: (item) => `${item.category}: ${item.name} ($${item.price.toFixed(2)})`,
  },
  specials: {
    label: 'Specials',
    endpoint: '/api/admin/specials',
    fields: ['name', 'description', 'price', 'activeRange'],
    display: (item) => `${item.name} ($${item.price.toFixed(2)})`,
  },
  'wine-list': {
    label: 'Wine List',
    endpoint: '/api/admin/wine-list',
    fields: ['category', 'name', 'description', 'price'],
    display: (item) => `${item.category}: ${item.name} ($${item.price.toFixed(2)})`,
  },
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('menu-items');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function loadTab(tabKey, pwd) {
    const res = await fetch(TABS[tabKey].endpoint, { headers: { 'x-admin-password': pwd } });
    if (!res.ok) throw new Error('Unauthorized');
    setItems(await res.json());
  }

  async function tryLogin(e) {
    e.preventDefault();
    try {
      await loadTab('menu-items', password);
      setAuthed(true);
      setError('');
    } catch {
      setError('Wrong password.');
    }
  }

  async function switchTab(tabKey) {
    setTab(tabKey);
    setForm({});
    setEditingId(null);
    await loadTab(tabKey, password);
  }

  async function addItem(e) {
    e.preventDefault();
    const payload = { ...form };
    if (payload.price) payload.price = Number(payload.price);
    await fetch(TABS[tab].endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    });
    setForm({});
    loadTab(tab, password);
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    await fetch(TABS[tab].endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    });
    loadTab(tab, password);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      category: item.category ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      price: item.price ?? '',
      activeRange: item.active_range ?? '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id) {
    const payload = { ...editForm, id, price: Number(editForm.price) };
    await fetch(TABS[tab].endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    });
    setEditingId(null);
    loadTab(tab, password);
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <h1 className="font-serif text-3xl text-brand-burgundy mb-6">Admin Login</h1>
        <form onSubmit={tryLogin} className="space-y-4">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-brand-gold px-3 py-2"
          />
          <button type="submit" className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm">
            Log in
          </button>
        </form>
      </div>
    );
  }

  const config = TABS[tab];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-brand-burgundy mb-6">Manage Content</h1>

      <div className="flex gap-3 mb-8">
        {Object.entries(TABS).map(([key, t]) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-3 py-1.5 text-sm uppercase tracking-wide border border-brand-gold ${
              tab === key ? 'bg-brand-burgundy text-brand-cream' : 'text-brand-burgundy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={addItem} className="grid grid-cols-2 gap-3 mb-10">
        {config.fields.map((field) => (
          <input
            key={field}
            placeholder={field}
            value={form[field] || ''}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className={`border border-brand-gold px-3 py-2 ${field === 'description' ? 'col-span-2' : ''}`}
          />
        ))}
        <button type="submit" className="bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) =>
          editingId === item.id ? (
            <li key={item.id} className="border-b border-brand-gold/40 pb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {config.fields.map((field) => (
                  <input
                    key={field}
                    placeholder={field}
                    value={editForm[field] ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    className={`border border-brand-gold px-2 py-1 text-sm ${field === 'description' ? 'col-span-2' : ''}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => saveEdit(item.id)}
                  className="bg-brand-burgundy text-brand-cream px-3 py-1 text-xs uppercase"
                >
                  Save
                </button>
                <button onClick={cancelEdit} className="text-sm underline">
                  Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={item.id} className="flex justify-between items-center border-b border-brand-gold/40 pb-2">
              <span>{config.display(item)}</span>
              <div className="flex gap-3">
                <button onClick={() => startEdit(item)} className="text-brand-burgundy text-sm underline">
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id)} className="text-red-700 text-sm underline">
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
