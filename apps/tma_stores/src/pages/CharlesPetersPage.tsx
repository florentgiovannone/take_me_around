import { useState } from "react"
import { Link } from "react-router-dom"
import jacket from "../assets/ashby-jacket.png"
import scarf from "../assets/ralph-lauren-scarf.png"
import CharlesPetersLayout, { useCharlesBasket } from "./CharlesPetersLayout"

const JACKET_PRICE = 269
const SCARF_PRICE = 115
const OFFER_TOTAL = 300
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const

function pounds(amount: number) {
  return `£${amount.toFixed(2)}`
}

function ProductOffer() {
  const [scarfAdded, setScarfAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState<(typeof SIZES)[number]>("XS")
  const { add } = useCharlesBasket()
  const total = scarfAdded ? OFFER_TOTAL : JACKET_PRICE
  const originalPrice = JACKET_PRICE + SCARF_PRICE

  return (
    <main className="waitburys-product">
      <p className="crumb">
        <Link to="/charlespeters">Home</Link>
        <span> / Men / Jackets</span>
      </p>
      <div className="product-layout">
        <img className="product-photo" src={jacket} alt="Barbour Ashby waxed cotton field jacket in olive" />
        <div className="product-copy">
          <p className="brand">Barbour</p>
          <h1>Ashby Waxed Cotton Field Jacket</h1>
          <p className="unit">Olive ({pounds(JACKET_PRICE)})</p>
          <p className="price">{pounds(JACKET_PRICE)}</p>
          <label className="mango-option scarf-option">
            <img
              src={scarf}
              alt="Ralph Lauren wool blend reversible grid check scarf in blue navy"
            />
            <input
              type="checkbox"
              checked={scarfAdded}
              onChange={(event) => setScarfAdded(event.target.checked)}
            />
            <span className="mango-copy">
              Add scarf
              <span className="scarf-brand">Ralph Lauren</span>
              <span className="scarf-model">
                Wool Blend Reversible Grid Check Scarf, Blue Navy
              </span>
              <span className="deal-price">
                <strong>{pounds(OFFER_TOTAL)}</strong>
                <s className="was-price">{pounds(originalPrice)}</s>
              </span>
            </span>
          </label>
          <p className="total">
            Total <strong>{pounds(total)}</strong>
          </p>
          <div className="sizes" role="group" aria-label="Size">
            {SIZES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={size === option}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
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
              onClick={() => add(scarfAdded ? quantity * 2 : quantity)}
            >
              Add to basket
            </button>
          </div>
          <p className="offer">This is your offer for today Mr Marks</p>
        </div>
      </div>
      <section className="description" aria-labelledby="description-heading">
        <h2 id="description-heading">Product Description</h2>
        <p>
          Heritage brand Barbour reworks their traditional Bedale design with
          this waxed-cotton Ashby jacket, with a contemporary silhouette and
          practical detailing. Constructed in the brand&apos;s signature 6oz
          Sylkoil waxed cotton, this jacket features a weatherproof matte
          finish and a slightly tailored look, but still retains plenty of room
          for layering.
        </p>
      </section>
    </main>
  )
}

export default function CharlesPetersPage() {
  return (
    <CharlesPetersLayout>
      <ProductOffer />
    </CharlesPetersLayout>
  )
}
