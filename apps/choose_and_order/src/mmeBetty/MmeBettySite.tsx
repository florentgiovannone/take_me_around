import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import Footer from "./Components/Footer"
import Home from "./Components/Home"
import Nav from "./Components/Nav"
import OrderNow from "./Components/OrderNow"
import "./mmeBetty.css"

type CartItem = {
  id: string
  quantity: number
  price: number
}

type MmeBettySiteProps = {
  cart: CartItem[]
  handleRemoveFromCart: (item: CartItem) => void
  handleAddToCart: (item: CartItem) => void
  handleRemoveAllFromCart: (item: CartItem) => void
  cartCount: boolean
  cartTotal: number
  cartTotalPrice: number
}

export default function MmeBettySite({
  cart,
  handleRemoveFromCart,
  handleAddToCart,
  handleRemoveAllFromCart,
  cartCount,
  cartTotal,
  cartTotalPrice,
}: MmeBettySiteProps) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Bistro Mme Betty"
    document.body.classList.add("mme-betty-site")
    return () => {
      document.title = previousTitle
      document.body.classList.remove("mme-betty-site")
    }
  }, [])

  return (
    <div className="mme-betty-site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav
        cart={cart}
        handleRemoveFromCart={handleRemoveFromCart}
        handleAddToCart={handleAddToCart}
        handleRemoveAllFromCart={handleRemoveAllFromCart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartTotalPrice={cartTotalPrice}
      />
      <main style={{ flex: "1", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="order-now" element={<OrderNow handleAddToCart={handleAddToCart} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
