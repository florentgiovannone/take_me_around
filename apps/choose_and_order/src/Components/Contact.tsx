import { useState, type FormEvent } from "react"

export default function Contact() {
    const [thankYouMessage, setThankYouMessage] = useState(false)

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        setThankYouMessage(true)
    }

    return (
        <section
            id="contact"
            style={{
                marginTop: "-50px",
                padding: "4rem 1.5rem 6rem",
                backgroundColor: "#3F462C",
                width: "100%",
            }}
        >
            <div className="container">
            <h2
                className="title is-2 mb-6 has-text-centered"
                style={{ color: "#F6F1E6", fontFamily: "Fraunces, Georgia, serif" }}
            >
                Contact us
            </h2>
            <p className="subtitle is-4 has-text-centered mb-6" style={{ color: "#F6F1E6" }}>
                1 The Polygon, Clapham Old Town, London SW4 0JG · 07872 317846
            </p>
            <div className="columns is-centered">
                <div className="column is-6">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label" style={{ color: "#F6F1E6" }}>Name</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="Name" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label" style={{ color: "#F6F1E6" }}>Email</label>
                            <div className="control">
                                <input className="input" type="email" placeholder="Email" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label" style={{ color: "#F6F1E6" }}>Phone</label>
                            <div className="control">
                                <input className="input" type="tel" placeholder="Phone" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label" style={{ color: "#F6F1E6" }}>Message</label>
                            <div className="control">
                                <textarea className="textarea" placeholder="Message" required />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button
                                    type="submit"
                                    className="button is-large"
                                    style={{
                                        marginTop: "2rem",
                                        width: "100%",
                                        backgroundColor: "#F6F1E6",
                                        color: "#3F462C",
                                        border: "none",
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {thankYouMessage && (
                <div
                    className="notification is-light has-text-centered"
                    style={{
                        width: "40%",
                        margin: "2rem auto 0",
                        backgroundColor: "#F6F1E6",
                        color: "#3F462C",
                        borderRadius: "10px",
                        padding: "2rem",
                        border: "1px solid #6B7344",
                    }}
                >
                    <button className="delete" type="button" onClick={() => setThankYouMessage(false)}></button>
                    Thanks for getting in touch. We'll reply soon.
                </div>
            )}
            </div>
        </section>
    )
}
