import { createContext, useContext, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/charles-peters-logo.png"
import BasketButton, { addBasketLines, type BasketAddition, type BasketLine } from "./BasketButton"
import StoreFooter from "./StoreFooter"

const BasketContext = createContext<{
  count: number
  add: (addition: BasketAddition) => void
} | null>(null)

export function useCharlesBasket() {
  const basket = useContext(BasketContext)
  if (!basket) {
    throw new Error("useCharlesBasket must be used inside CharlesPetersLayout")
  }
  return basket
}

const menu = [
  "New In",
  "Jackets",
  "Knitwear",
  "Shirts",
  "Trousers",
  "Scarves",
  "Accessories",
]

function BasketMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 8h11l-.8 11H7.3L6.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8V6.5a3 3 0 0 1 6 0V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function AccountMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.2c1.2-2.6 3.4-3.9 6.5-3.9s5.3 1.3 6.5 3.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function CharlesPetersLayout({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([])
  const [total, setTotal] = useState(0)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <BasketContext.Provider
      value={{
        count,
        add: (addition) => {
          setLines((current) => addBasketLines(current, addition.lines))
          setTotal((value) => value + addition.amount)
        },
      }}
    >
      <div className="waitburys charles">
        <p className="charles-promo">Free standard delivery on orders over £50</p>
        <header className="charles-header">
          <form className="charles-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <input type="search" placeholder="Search" aria-label="Search" />
          </form>
          <Link to="/charlespeters" className="charles-logo" aria-label="Charles Peters">
            <img src={logo} alt="Charles Peters" />
          </Link>
          <div className="charles-tools">
            <span className="charles-account">
              <AccountMark />
              Account
            </span>
            <BasketButton lines={lines} total={total}>
              <BasketMark />
            </BasketButton>
          </div>
        </header>
        <nav className="charles-nav" aria-label="Shop">
          <ul>
            {menu.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </nav>
        {children}
        <StoreFooter name="Charles Peters" />
      </div>
    </BasketContext.Provider>
  )
}
