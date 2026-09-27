export default function About() {
    return (
        <section
            id="about"
            className="section"
            style={{
                minHeight: "60vh",
                marginTop: "-100px",
                backgroundColor: "#3F462C",
            }}
        >
            <div className="container">
                <div className="has-text-centered">
                    <h2 className="title is-2 mb-6" style={{ color: "#F6F1E6", fontFamily: "Fraunces, Georgia, serif" }}>
                        About Us
                    </h2>
                    <div className="content is-medium" style={{ color: "#F6F1E6" }}>
                        <p className="is-size-4">
                            Buddy's is an independent neighbourhood deli and bakery in Clapham Old Town.
                            Epic sandwiches, fresh salads, speciality coffee and sweet treats — feel-good food to eat in or take away.
                        </p>
                        <p style={{ paddingBottom: "4rem" }}>
                            Open every day from 7am to 4pm at 1 The Polygon, London SW4 0JG.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
