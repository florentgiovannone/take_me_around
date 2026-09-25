import { useState } from "react"
import { Link } from "react-router-dom"
import mango from "../assets/mango.png"
import watermelon from "../assets/watermelon.png"
import WaitburysLayout, { useBasket } from "./WaitburysLayout"

const WATERMELON_PRICE = 2.69
const NORMAL_PRICE = 3.66
const OFFER_TOTAL = 3

function pounds(amount: number) {
  return `£${amount.toFixed(2)}`
}

function ProductOffer() {
  const [mangoAdded, setMangoAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { add } = useBasket()
  const total = mangoAdded ? OFFER_TOTAL : WATERMELON_PRICE

  return (
      <main className="waitburys-product">
        <p className="crumb">
          <Link to="/waitburys">Home</Link>
          <span> / Fresh Food / Fruit</span>
        </p>
        <div className="product-layout">
          <img className="product-photo" src={watermelon} alt="Watermelon" />
          <div className="product-copy">
            <p className="brand">Nature’s Pick</p>
            <h1>Watermelon</h1>
            <p className="unit">1 Each ({pounds(WATERMELON_PRICE)}/1 Each)</p>
            <p className="price">{pounds(WATERMELON_PRICE)}</p>
            <label className="mango-option">
              <img src={mango} alt="" />
              <input
                type="checkbox"
                checked={mangoAdded}
                onChange={(event) => setMangoAdded(event.target.checked)}
              />
              <span className="mango-copy">
                Add mango
                <span className="deal-price">
                  <strong>{pounds(OFFER_TOTAL)}</strong>
                  <s className="was-price">{pounds(NORMAL_PRICE)}</s>
                </span>
              </span>
            </label>
            <p className="total">
              Total <strong>{pounds(total)}</strong>
            </p>
            <div className="purchase">
              <div className="quantity" aria-label="Quantity">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="add-to-basket"
                onClick={() => add(mangoAdded ? quantity * 2 : quantity)}
              >
                Add to basket
              </button>
            </div>
            <p className="offer">This is your offer for today Mrs Spencer</p>
          </div>
        </div>
        <section className="details" aria-labelledby="details-heading">
          <h2 id="details-heading">Product Details</h2>
          <p>
            <span>Grade</span> Class 1
          </p>
          <p>
            <span>Origin</span> Italy; Spain
          </p>
        </section>
      </main>
  )
}

export default function WaitburysProductPage() {
  return (
    <WaitburysLayout>
      <ProductOffer />
    </WaitburysLayout>
  )
}
