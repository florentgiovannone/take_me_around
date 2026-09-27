import { useState } from "react";

export default function Reservations() {
    // State for thank you message
    const [thankYouMessage, setThankYouMessage] = useState(false);

    // Handle submit
    const handleSubmit = () => {
        setThankYouMessage(true);
    };
    
    return (
        <div id="reservation" className="container" style={{
            marginTop: '-100px',
            padding: '50px',
            minHeight: '130vh',
        }}>
            <h2 className="title is-2 mb-6 has-text-centered">Reservations</h2>
            <p className="subtitle is-4 has-text-centered mb-6">
                Book your table now and experience the best of our restaurant.
            </p>
            <div className="columns is-centered">
                <div className="column is-6">
                    <form>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="Name" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input className="input" type="email" placeholder="Email" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Phone</label>
                            <div className="control">
                                <input className="input" type="tel" placeholder="Phone" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Date</label>
                            <div className="control">
                                <input className="input" type="date" placeholder="Date" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Time</label>
                            <div className="control">
                                <input className="input" type="time" placeholder="Time" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Number of Guests</label>
                            <div className="control">
                                <input className="input" type="number" placeholder="Number of Guests" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Notes</label>
                            <div className="control">
                                <textarea className="textarea" placeholder="Notes" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="button is-dark is-large is-outlined"
                                    style={{
                                        marginBottom: '1rem',
                                        marginTop: '3rem',
                                        width: '100%',
                                    }}
                                >
                                    Reserve
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {thankYouMessage && (
                <div className="notification is-light has-text-centered" style={{
                    width: '40%',
                    margin: '0 auto',
                    backgroundColor: "#f5f5f5",
                    color: "#000000",
                    borderRadius: '10px',
                    padding: '2rem',
                    border: '1px solid #000000',
                }}>
                    <button className="delete" onClick={() => setThankYouMessage(false)}></button>
                    Thank you for your reservation! We will contact you soon.
                </div>
            )}
        </div>
    )
}