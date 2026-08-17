'use client'

import { FormEvent, useState } from 'react'

export default function PreviewGatePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    try {
      const response = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(typeof data.error === 'string' ? data.error : 'That’s not the right password.')
        setPending(false)
        return
      }
      window.location.replace('/')
    } catch {
      setError('Something went wrong. Please try again.')
      setPending(false)
    }
  }

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-5 py-10"
      style={{ background: 'var(--color-brown-dark)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border-2 px-6 py-8 sm:px-8 sm:py-10 text-center"
        style={{
          background: 'var(--color-cream)',
          borderColor: 'rgba(251, 247, 232, 0.35)',
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.22em] mb-3"
          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', opacity: 0.72 }}
        >
          Private preview
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold italic leading-none mb-3"
          style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
        >
          Youth 4 Elders
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed mb-7"
          style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.88 }}
        >
          Enter the founders’ password to look around before we go live.
        </p>

        <label className="sr-only" htmlFor="site-password">
          Password
        </label>
        <input
          id="site-password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3.5 rounded-xl border-2 mb-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20"
          style={{
            fontFamily: 'var(--font-kollektif)',
            color: 'var(--color-brown-dark)',
            background: 'var(--color-pink-light)',
            borderColor: error ? 'var(--color-error)' : 'var(--color-brown-dark)',
          }}
        />
        {error && (
          <p
            className="text-sm mb-3"
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-error)' }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !password.trim()}
          className="w-full rounded-xl px-5 py-3.5 font-bold text-[var(--color-cream)] bg-[var(--color-brown-dark)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{ fontFamily: 'var(--font-leiko)' }}
        >
          {pending ? 'Checking…' : 'Come in'}
        </button>
      </form>
    </main>
  )
}
