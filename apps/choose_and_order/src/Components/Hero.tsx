import BrandLogo from "./BrandLogo"

export default function HeroPage() {
    return (
        <section
            className="hero is-fullheight"
            style={{
                height: "110vh",
                backgroundColor: "#F6F1E6",
                position: "relative",
            }}
        >
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="mb-5" style={{ display: "flex", justifyContent: "center" }}>
                        <BrandLogo size={180} />
                    </div>
                    <h2 className="title is-2" style={{ color: "#3F462C", fontFamily: "Fraunces, Georgia, serif" }}>
                        Buddy's Deli
                    </h2>
                    <p className="subtitle is-4" style={{ color: "#6B7344" }}>
                        Independent neighbourhood deli and bakery
                    </p>
                </div>
            </div>
        </section>
    )
}
