import roundelSvg from "../assets/sevendials/seven-dials-trust-roundel.svg"

export type SevenDialsRoundelProps = {
  size?: number
  className?: string
  showPromptText?: boolean
}

export default function SevenDialsRoundel({
  size = 180,
  className,
}: SevenDialsRoundelProps) {
  return (
    <img
      src={roundelSvg}
      width={size}
      height={size}
      className={className}
      alt="Seven Dials Trust People's Plaque NFC Roundel"
    />
  )
}
