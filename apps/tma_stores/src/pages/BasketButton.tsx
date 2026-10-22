import { useEffect, useId, useRef, useState, type ReactNode } from "react"

export type BasketLine = {
  name: string
  quantity: number
}

export type BasketAddition = {
  lines: BasketLine[]
  amount: number
}

export function addBasketLines(current: BasketLine[], incoming: BasketLine[]) {
  const next = current.map((line) => ({ ...line }))
  for (const line of incoming) {
    const existing = next.find((item) => item.name === line.name)
    if (existing) existing.quantity += line.quantity
    else next.push({ name: line.name, quantity: line.quantity })
  }
  return next
}

function pounds(amount: number) {
  return `£${amount.toFixed(2)}`
}

export default function BasketButton({
  lines,
  total,
  children,
}: {
  lines: BasketLine[]
  total: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div className="basket-menu" ref={menuRef}>
      <button
        type="button"
        className="basket"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={count > 0 ? `Basket, ${count} items` : "Basket"}
        onClick={() => setOpen((value) => !value)}
      >
        {children}
        {count > 0 ? <span className="basket-count">{count}</span> : null}
      </button>
      {open ? (
        <div className="basket-panel" id={panelId} role="region" aria-label="Basket">
          <p className="basket-panel-title">Basket</p>
          {lines.length === 0 ? (
            <p className="basket-empty">Your basket is empty.</p>
          ) : (
            <>
              <ul className="basket-lines">
                {lines.map((line) => (
                  <li key={line.name}>
                    <span>{line.name}</span>
                    <span>× {line.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="basket-total">
                Total <strong>{pounds(total)}</strong>
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
