import { FormEvent, useState } from "react"

type BidButtonProps = {
  currency: string
}

function currencySymbol(price: string | null): string {
  if (!price) return ""
  if (price.includes("£")) return "£"
  if (price.includes("€")) return "€"
  if (price.includes("$")) return "$"
  return ""
}

export function currencyForPrice(price: string | null): string {
  return currencySymbol(price)
}

export default function BidButton({ currency }: BidButtonProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState<string | null>(null)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(amount.replace(/,/g, "").trim())
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a bid amount.")
      setSent(null)
      return
    }
    const formatted = new Intl.NumberFormat("en-GB").format(value)
    setError("")
    setSent([currency, formatted].filter(Boolean).join(" "))
  }

  if (sent) {
    return <p className="bid-thanks">Thank you. Your bid of {sent} has been received.</p>
  }

  if (!open) {
    return (
      <button type="button" className="bid-button" onClick={() => setOpen(true)}>
        Bid
      </button>
    )
  }

  return (
    <form className="bid-form" onSubmit={onSubmit}>
      <label htmlFor="bid-amount">Your bid</label>
      <div className="bid-amount">
        {currency ? <span>{currency}</span> : null}
        <input
          id="bid-amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      {error ? <p className="field-error">{error}</p> : null}
      <button type="submit">Submit bid</button>
    </form>
  )
}
