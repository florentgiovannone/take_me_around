import { createContext, useContext, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/waitburys-logo.png"
import BasketButton, { addBasketLines, type BasketAddition, type BasketLine } from "./BasketButton"
import StoreFooter from "./StoreFooter"

const BasketContext = createContext<{
  count: number
  add: (addition: BasketAddition) => void
} | null>(null)

export function useBasket() {
  const basket = useContext(BasketContext)
  if (!basket) {
    throw new Error("useBasket must be used inside WaitburysLayout")
  }
  return basket
}

const menu = [
  "Specials",
  "Fresh Food",
  "Food Cupboard",
  "Chilled",
  "Bakery",
  "Drinks",
  "Household",
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

export default function WaitburysLayout({ children }: { children: ReactNode }) {
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
      <div className="waitburys">
        <header className="waitburys-header">
          <span className="burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <Link to="/waitburys" className="waitburys-logo" aria-label="Waitburys">
            <img src={logo} alt="Waitburys. Your groceries, on your high street." />
          </Link>
          <ul className="waitburys-menu">
            {menu.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <BasketButton lines={lines} total={total}>
            <BasketMark />
          </BasketButton>
        </header>
        {children}
        <StoreFooter name="Waitburys" />
      </div>
    </BasketContext.Provider>
  )
}
