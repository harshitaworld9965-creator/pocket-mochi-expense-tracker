// a little burst of pastel bits from an element — called after a successful save
const COLORS = ['#ff8fab', '#c9b6ff', '#b8f2d0', '#ffe9a8', '#3d2b3f']

export function confetti(fromEl) {
  if (!fromEl) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const r = fromEl.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2

  const layer = document.createElement('div')
  layer.className = 'confetti-layer'
  document.body.appendChild(layer)

  for (let i = 0; i < 26; i++) {
    const bit = document.createElement('span')
    const size = 6 + Math.random() * 7
    const round = Math.random() < 0.5
    bit.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${round ? size : size * 1.6}px;` +
      `background:${COLORS[i % COLORS.length]};border-radius:${round ? '50%' : '3px'}`
    layer.appendChild(bit)

    const angle = Math.random() * Math.PI * 2
    const dist = 70 + Math.random() * 120
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 60 // fly up first…
    const spin = Math.random() * 720 - 360

    bit.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 100}px)) rotate(${spin}deg) scale(.5)`, opacity: 0 }, // …then fall
      ],
      { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' }
    )
  }

  setTimeout(() => layer.remove(), 1300)
}