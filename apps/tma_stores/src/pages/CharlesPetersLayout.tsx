import { createContext, useContext, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/charles-peters-logo.png"
import StoreFooter from "./StoreFooter"

const BasketContext = createContext<{
  count: number
  add: (quantity: number) => void
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
        strokeWidth="1.8"
      />
      <path
        d="M9 8V6.5a3 3 0 0 1 6 0V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export default function CharlesPetersLayout({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <BasketContext.Provider
      value={{ count, add: (quantity) => setCount((value) => value + quantity) }}
    >
      <div className="waitburys charles">
        <header className="waitburys-header">
          <span className="burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <Link to="/charlespeters" className="waitburys-logo charles-logo" aria-label="Charles Peters">
            <img src={logo} alt="Charles Peters" />
          </Link>
          <ul className="waitburys-menu">
            {menu.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <span className="basket" aria-label={count > 0 ? `Basket, ${count} items` : "Basket"}>
            <BasketMark />
            {count > 0 ? <span className="basket-count">{count}</span> : null}
          </span>
        </header>
        {children}
        <StoreFooter name="Charles Peters" />
      </div>
    </BasketContext.Provider>
  )
}
