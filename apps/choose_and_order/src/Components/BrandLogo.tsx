export default function BrandLogo({ size = 72 }: { size?: number }) {
    return (
        <svg
            viewBox="0 0 160 160"
            width={size}
            height={size}
            className="buddy-logo"
            role="img"
            aria-label="Buddy's Deli"
        >
            <circle cx="80" cy="80" r="76" fill="#F6F1E6" />
            <text
                x="80"
                y="74"
                textAnchor="middle"
                fill="#6B7344"
                fontFamily="Fraunces, Georgia, serif"
                fontSize="30"
                fontWeight="650"
            >
                Buddy's
            </text>
            <text
                x="80"
                y="102"
                textAnchor="middle"
                fill="#6B7344"
                fontFamily="Fraunces, Georgia, serif"
                fontSize="22"
                fontWeight="650"
            >
                Deli
            </text>
        </svg>
    )
}
