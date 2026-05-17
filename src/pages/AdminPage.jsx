import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Lock, LogOut, Menu, ShoppingBag, Star } from 'lucide-react'
import { useMenu } from '../context/MenuContext'
import { getOrders, getWeeklySales } from '../utils/order'
import { getReviews } from '../utils/reviews'
import { KEYS } from '../utils/storage'

const TABS = ['orders', 'sales', 'menu', 'reviews']

export default function AdminPage() {
  const { menu, saveMenu, settings } = useMenu()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(KEYS.adminSession) === '1')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('orders')
  const [editItems, setEditItems] = useState(menu.items)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (tab === 'menu') setEditItems(menu.items)
  }, [tab, menu.items])

  const orders = useMemo(() => getOrders().slice().reverse(), [authed, tab, refresh])
  const weekly = useMemo(() => getWeeklySales(), [authed, tab, refresh])
  const reviews = useMemo(() => getReviews(), [authed, tab, refresh])
  const maxSale = Math.max(...weekly.map((d) => d.total), 1)

  const handleLogin = (e) => {
    e.preventDefault()
    const expected = settings.adminPassword || 'manager123'
    if (password === expected) {
      sessionStorage.setItem(KEYS.adminSession, '1')
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(KEYS.adminSession)
    setAuthed(false)
    setPassword('')
  }

  const handleSaveMenu = () => {
    const daily = editItems.find((i) => i.isDailySpecial)
    saveMenu({
      ...menu,
      items: editItems,
      dailySpecial: daily
        ? {
            ...menu.dailySpecial,
            itemId: daily.id,
            title: menu.dailySpecial?.title || "Chef's Selection",
            description: daily.name,
          }
        : menu.dailySpecial,
    })
    setRefresh((r) => r + 1)
    alert('Menu saved successfully!')
  }

  const updateItem = (index, field, value) => {
    setEditItems((prev) => {
      let next = [...prev]
      next[index] = { ...next[index], [field]: value }
      if (field === 'isDailySpecial' && value === true) {
        next = next.map((it, i) => ({ ...it, isDailySpecial: i === index }))
      }
      if (field === 'stockLimit' && value != null) {
        next[index].scarcity = `Only ${value} left`
      }
      return next
    })
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-default bg-card p-6 shadow-lg"
        >
          <Lock className="mx-auto text-brand" size={32} />
          <h1 className="mt-3 text-center text-xl font-semibold text-primary">Manager Login</h1>
          <p className="mt-1 text-center text-sm text-muted">Password required</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-xl border border-default bg-input px-3 py-2.5 text-primary"
            placeholder="Enter password"
          />
          {loginError && <p className="mt-2 text-sm text-red-500">{loginError}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#e85d04] py-3 text-sm font-semibold text-white"
          >
            Sign in
          </button>
          <Link to="/" className="mt-3 block text-center text-sm text-muted underline">
            Back to menu
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page pb-10">
      <header className="sticky top-0 z-10 border-b border-default bg-card px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">Manager Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-muted underline">
              View menu
            </Link>
            <button type="button" onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-4xl gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                tab === t ? 'bg-[#e85d04] text-white' : 'bg-elevated text-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-4">
        {tab === 'orders' && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <ShoppingBag size={18} /> Recent orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-xl border border-default bg-card p-4">
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="font-medium text-primary">
                        {o.orderType === 'takeaway' ? 'Takeaway' : `Table ${o.table || '—'}`}
                      </span>
                      <span className="font-bold text-brand">${o.total?.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                    <ul className="mt-2 text-sm text-primary">
                      {o.items?.map((i) => (
                        <li key={`${o.id}-${i.id}`}>
                          {i.qty}× {i.name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'sales' && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <BarChart3 size={18} /> Weekly sales
            </h2>
            <div className="rounded-xl border border-default bg-card p-4">
              <div className="flex h-40 items-end justify-between gap-2">
                {weekly.map(({ day, total: dayTotal }) => (
                  <div key={day} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full min-h-[4px] rounded-t bg-[#e85d04]"
                      style={{ height: `${Math.max(8, (dayTotal / maxSale) * 128)}px` }}
                      title={`$${dayTotal.toFixed(0)}`}
                    />
                    <span className="text-[10px] text-muted">{day}</span>
                    <span className="text-[10px] font-medium text-primary">
                      ${dayTotal.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-sm font-medium text-primary">
                Week total: ${weekly.reduce((s, d) => s + d.total, 0).toFixed(2)}
              </p>
            </div>
          </section>
        )}

        {tab === 'menu' && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Menu size={18} /> Edit menu
            </h2>
            <div className="space-y-4">
              {editItems.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-default bg-card p-4">
                  <p className="mb-2 text-xs text-muted">ID: {item.id}</p>
                  <label className="block text-xs font-medium text-muted">Food Name</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="mb-2 w-full rounded-lg border border-default bg-input px-2 py-1.5 text-sm text-primary"
                  />
                  <label className="block text-xs font-medium text-muted">Price ($)</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                    className="mb-2 w-full rounded-lg border border-default bg-input px-2 py-1.5 text-sm text-primary"
                  />
                  <label className="block text-xs font-medium text-muted">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    className="mb-2 w-full rounded-lg border border-default bg-input px-2 py-1.5 text-sm text-primary"
                  >
                    {menu.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <label className="block text-xs font-medium text-muted">
                    Stock limit (max orders)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.stockLimit ?? ''}
                    onChange={(e) =>
                      updateItem(
                        index,
                        'stockLimit',
                        e.target.value === '' ? null : Number(e.target.value)
                      )
                    }
                    className="mb-2 w-full rounded-lg border border-default bg-input px-2 py-1.5 text-sm text-primary"
                  />
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={!!item.isDailySpecial}
                      onChange={(e) => updateItem(index, 'isDailySpecial', e.target.checked)}
                    />
                    Daily Special toggle
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveMenu}
              className="mt-4 w-full rounded-full bg-[#e85d04] py-3 font-semibold text-white"
            >
              Save menu changes
            </button>
          </section>
        )}

        {tab === 'reviews' && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Star size={18} /> Customer reviews
            </h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews yet.</p>
            ) : (
              <ul className="space-y-2">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-default bg-card p-3">
                    <p className="text-amber-500">
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </p>
                    {r.comment && <p className="mt-1 text-sm text-primary">{r.comment}</p>}
                    <p className="mt-1 text-xs text-muted">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
