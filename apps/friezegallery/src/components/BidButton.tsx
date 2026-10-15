import { FormEvent, useState } from "react"
import { useUiCopy } from "../i18n/locale"
import { fill } from "../i18n/uiCopy"

type BidButtonProps = {
  originalCurrency: string
}

export function currencyForPrice(price: string | null): string {
  if (!price) return ""
  if (price.includes("£")) return "£"
  if (price.includes("€")) return "€"
  if (price.includes("$")) return "$"
  return ""
}

export default function BidButton({ originalCurrency }: BidButtonProps) {
  const copy = useUiCopy()
  const [open, setOpen] = useState(false)
  const [usePounds, setUsePounds] = useState(true)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState<string | null>(null)
  const canSwitch = originalCurrency !== "" && originalCurrency !== "£"
  const currency = usePounds || !canSwitch ? "£" : originalCurrency

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(amount.replace(/,/g, "").trim())
    if (!Number.isFinite(value) || value <= 0) {
      setError(copy.enterBid)
      setSent(null)
      return
    }
    const formatted = new Intl.NumberFormat("en-GB").format(value)
    setError("")
    setSent([currency, formatted].filter(Boolean).join(" "))
  }

  if (sent) {
    return <p className="bid-thanks">{fill(copy.bidThanks, { amount: sent })}</p>
  }

  if (!open) {
    return (
      <button type="button" className="bid-button" onClick={() => setOpen(true)}>
        {copy.bid}
      </button>
    )
  }

  return (
    <form className="bid-form" onSubmit={onSubmit}>
      <div className="bid-label-row">
        <label htmlFor="bid-amount">{copy.yourBid}</label>
        {canSwitch ? (
          <button type="button" className="text-button" onClick={() => setUsePounds((current) => !current)}>
            {usePounds ? copy.changeCurrency : copy.usePounds}
          </button>
        ) : null}
      </div>
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
      <button type="submit">{copy.submitBid}</button>
    </form>
  )
}
