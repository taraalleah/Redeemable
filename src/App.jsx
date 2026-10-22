import { useEffect, useMemo, useRef, useState } from 'react'
import { TH, SH, PRE, enc, dec, draw } from './lib/tickets.js'
import openImg from './assets/open.webp'
import closedImg from './assets/closed.webp'
import sealImg from './assets/seal.webp'

const NEW = () => ({ h: '', d: '', c: 0, s: 1 })
const START = () => ({ to: '', from: '', t: [{ h: 'One free favour', d: 'Anything reasonable. No questions asked.', c: 0, s: 0 }] })
const PEEK = [
  { h: 'Breakfast in bed', d: 'Served with tea.', c: 0, s: 1 },
  { h: 'One free favour', d: 'No questions asked.', c: 1, s: 3 },
  { h: 'Movie night, your pick', d: 'Snacks on me.', c: 2, s: 0 },
]
const FONTS = ['400 40px "Special Elite"', '400 17px "Courier Prime"', '700 17px "Courier Prime"']
const onKey = (fn) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn() } }

// bumps once web fonts are ready so canvas tickets get redrawn with them
function useFonts() {
  const [n, setN] = useState(0)
  useEffect(() => { Promise.all(FONTS.map((f) => document.fonts.load(f))).catch(() => {}).then(() => setN(1)) }, [])
  return n
}

function Logo() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" aria-hidden="true">
      <defs><mask id="sc"><rect width="36" height="24" fill="#fff" /><g fill="#000">
        {[4, 9.5, 15, 20.5].flatMap((y) => [0, 36].map((x) => <circle key={x + '-' + y} cx={x} cy={y} r="1.7" />))}
        <circle cx="25" cy="0" r="2.2" /><circle cx="25" cy="24" r="2.2" /></g></mask></defs>
      <rect width="36" height="24" mask="url(#sc)" fill="#55806E" />
      <path d="M25 4v16" stroke="#FFFDF8" strokeWidth="1" strokeDasharray="1.5 2" />
      <path d="M6 9h14M6 14h9" stroke="#FFFDF8" strokeWidth="1.8" />
    </svg>
  )
}

function Envelope({ open, small, home, onClick, fonts, label }) {
  const peek = useMemo(() => PEEK.map((k) => draw(k, '', '')), [fonts])
  const cls = ['env', home && 'home', open && 'open', small && 'small'].filter(Boolean).join(' ')
  return (
    <div className={cls} role="button" tabIndex={0} aria-label={label} onClick={onClick} onKeyDown={onKey(onClick)}>
      <img className="eb" src={openImg} alt="" />
      <div className="peek">{[2, 1, 0].map((i) => <img key={i} className={'p' + (i + 1)} src={peek[i]} alt="" />)}</div>
      <img className="ef" src={openImg} alt="" />
      <img className="ec" src={closedImg} alt="" />
      <img className="seal" src={sealImg} alt="" />
    </div>
  )
}

function Home({ go, fonts }) {
  const [open, setOpen] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  const openIt = () => { if (open) return; setOpen(true); timer.current = setTimeout(() => go('build'), 2100) }
  return (
    <section id="home" className={'on' + (open ? ' opening' : '')}>
      <div className="txt">
        <h1>Little tickets, sealed with care</h1>
        <p className="lead">Write a few favours, treats and promises. We tuck them in an envelope and give you a link to send.</p>
        <button onClick={() => go('build')}>Make custom tickets</button>
      </div>
      <div className="hbot"><Envelope home open={open} fonts={fonts} onClick={openIt} label="Open the envelope" /></div>
    </section>
  )
}

function Builder({ S, setS, cur, setCur, onSeal, fonts }) {
  const t = S.t[cur]
  const patch = (p) => setS((s) => ({ ...s, t: s.t.map((x, i) => (i === cur ? { ...x, ...p } : x)) }))
  const add = () => { if (S.t.length < 8) { setS((s) => ({ ...s, t: [...s.t, NEW()] })); setCur(S.t.length) } }
  const del = () => { setS((s) => ({ ...s, t: s.t.filter((_, i) => i !== cur) })); setCur(Math.max(0, cur - 1)) }
  const src = useMemo(() => draw(t, S.to, S.from), [t, S.to, S.from, fonts])
  return (
    <>
      <section id="build" className="on">
        <h2>Fill your envelope</h2>
        <div className="top">
          <div><label className="f" htmlFor="to">For</label><input id="to" maxLength={24} placeholder="Their name" value={S.to} onChange={(e) => setS({ ...S, to: e.target.value })} /></div>
          <div><label className="f" htmlFor="fr">From</label><input id="fr" maxLength={24} placeholder="Your name" value={S.from} onChange={(e) => setS({ ...S, from: e.target.value })} /></div>
        </div>
        <div className="tabs" role="tablist">
          {S.t.map((_, i) => <button key={i} className={i === cur ? 'on' : ''} aria-label={'Ticket ' + (i + 1)} onClick={() => setCur(i)}>{i + 1}</button>)}
          {S.t.length < 8 && <button className="plus" aria-label="New ticket" onClick={add}>+</button>}
        </div>
        <div className="pv" style={{ maxWidth: 520, margin: '0 auto 14px' }}><img src={src} alt="Ticket preview" /></div>
        <div className="ed">
          <label>Templates <span style={{ fontWeight: 400, fontFamily: 'inherit' }}>(tap one to fill in this ticket)</span></label>
          <div className="chips">{PRE.map((p) => <button key={p[0]} onClick={() => patch({ h: p[0], d: p[1], c: p[3], s: p[4] })}>{p[0]}</button>)}</div>
          <label htmlFor="h">Title</label><input id="h" maxLength={40} value={t.h} onChange={(e) => patch({ h: e.target.value })} />
          <label htmlFor="d">Details</label><textarea id="d" rows={2} maxLength={90} value={t.d} onChange={(e) => patch({ d: e.target.value })} />
          <label>Colour</label>
          <div className="opt col">{TH.map((h, i) => <button key={i} style={{ background: h.i }} className={i === t.c ? 'on' : ''} aria-label={'Colour ' + (i + 1)} onClick={() => patch({ c: i })} />)}</div>
          <label>Shape</label>
          <div className="opt">{SH.map((n, i) => <button key={n} className={i === t.s ? 'on' : ''} onClick={() => patch({ s: i })}>{n}</button>)}</div>
          {S.t.length > 1 && <div className="acts"><button className="ghost sm-btn" onClick={del}>Delete this ticket</button></div>}
        </div>
      </section>
      <div className="bar on"><button className="alt" onClick={add}>New ticket</button><button onClick={onSeal}>Seal the envelope</button></div>
    </>
  )
}

function Share({ S, onPreview, onEdit }) {
  const link = location.href.split('#')[0] + '#' + enc(S)
  const [note, setNote] = useState('')
  const inp = useRef()
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setNote('Copied.') } catch { inp.current.select(); setNote('Select the link and copy it.') }
  }
  return (
    <section id="share" className="on">
      <h2>Sealed and ready</h2>
      <p className="lead">Send this link. Whoever opens it sees the envelope, the tickets, and can save each one as an image.</p>
      <div className="link"><input ref={inp} readOnly value={link} aria-label="Gift link" /><button onClick={copy}>Copy link</button></div>
      <p className="note">{note}</p>
      <div className="acts"><button className="alt" onClick={onPreview}>Preview as receiver</button><button className="ghost" onClick={onEdit}>Edit tickets</button></div>
    </section>
  )
}

function Receiver({ R, fonts, onGiveBack }) {
  const [open, setOpen] = useState(false)
  const [small, setSmall] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const [saveSrc, setSaveSrc] = useState(null)
  const timers = useRef([]); const dlg = useRef()
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { if (saveSrc && dlg.current && !dlg.current.open) dlg.current.showModal() }, [saveSrc])
  const srcs = useMemo(() => (open ? R.t.map((t) => draw(t, R.to, R.from)) : []), [open, R, fonts])
  const openIt = () => {
    if (open) return
    setOpen(true)
    timers.current.push(setTimeout(() => setSmall(true), 1100))
    timers.current.push(setTimeout(() => setShowEnd(true), 1100 + R.t.length * 180 + 500))
  }
  return (
    <section id="recv" className="on">
      <p className="f" style={{ fontSize: 20, margin: 0 }}>{R.from ? 'A little envelope from ' + R.from : 'A little envelope for you'}</p>
      <Envelope open={open} small={small} fonts={fonts} onClick={openIt} label="Open the envelope" />
      {!open && <p className="note">Tap the envelope to open it.</p>}
      <div className="tix">
        {small && srcs.map((u, i) => (
          <figure key={i} style={{ animationDelay: i * 0.18 + 's' }}>
            <img src={u} alt={'Ticket: ' + (R.t[i].h || '')} />
            <figcaption><button className="alt sm-btn" onClick={() => setSaveSrc(u)}>Save as image</button></figcaption>
          </figure>
        ))}
      </div>
      {showEnd && (
        <div style={{ marginTop: 34 }}>
          <h2>Your turn</h2><p className="lead">Make some tickets to give back.</p>
          <button onClick={onGiveBack}>Make tickets to give back</button>
        </div>
      )}
      <dialog ref={dlg} onClose={() => setSaveSrc(null)}>
        <img src={saveSrc || undefined} alt="Ticket" />
        <p className="note">Press and hold the image (or right-click) to save it.</p>
        <div className="acts"><button onClick={() => dlg.current.close()}>Close</button></div>
      </dialog>
    </section>
  )
}

export default function App() {
  const fonts = useFonts()
  const [init] = useState(() => { const h = location.hash.slice(1), o = h && dec(h); return o && Array.isArray(o.t) && o.t.length ? o : null })
  const [view, setView] = useState(init ? 'recv' : 'home')
  const [S, setS] = useState(START)
  const [cur, setCur] = useState(0)
  const [R, setR] = useState(init)
  const [pvw, setPvw] = useState(false)
  const go = (v) => { setView(v); window.scrollTo(0, 0) }
  const back = { build: 'home', share: 'build', recv: pvw ? 'share' : 'home' }[view]
  return (
    <>
      <header>
        <button className="brand" aria-label="Back to the start" onClick={() => go('home')}><Logo />Redeemable</button>
        {back && <button className="ghost sm-btn" onClick={() => go(back)}>{view === 'share' ? 'Edit tickets' : 'Back'}</button>}
      </header>
      <main>
        {view === 'home' && <Home go={go} fonts={fonts} />}
        {view === 'build' && <Builder S={S} setS={setS} cur={cur} setCur={setCur} fonts={fonts} onSeal={() => go('share')} />}
        {view === 'share' && <Share S={S} onEdit={() => go('build')} onPreview={() => { setR(S); setPvw(true); go('recv') }} />}
        {view === 'recv' && R && (
          <Receiver key={pvw ? 'preview' : 'link'} R={R} fonts={fonts}
            onGiveBack={() => { setS({ to: R.from || '', from: R.to || '', t: [NEW()] }); setCur(0); go('build') }} />
        )}
      </main>
    </>
  )
}
