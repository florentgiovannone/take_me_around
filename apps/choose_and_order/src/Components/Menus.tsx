import menus from "../Assets/Json/menus.json"

export default function Menus() {
    return (
        <section
            id="menus"
            className="section pb-6"
            style={{
                minHeight: "70vh",
                backgroundColor: "#F6F1E6",
                marginTop: "-50px",
            }}
        >
            <div className="container">
                <h2
                    className="title is-2 mb-6 has-text-centered"
                    style={{ color: "#3F462C", fontFamily: "Fraunces, Georgia, serif" }}
                >
                    Breakfast & Lunch
                </h2>
                <div className="columns">
                    {menus.map((menu) => (
                        <div className="column" key={menu.name}>
                            <h3 className="title is-4 has-text-centered" style={{ color: "#3F462C" }}>
                                {menu.name}
                            </h3>
                            <ul>
                                {menu.items.map((item) => (
                                    <li key={item.id} className="mb-4" style={{ color: "#3F462C" }}>
                                        <strong>{item.name}</strong>
                                        <span> · £{item.price.toFixed(2)}</span>
                                        <p className="is-size-6" style={{ color: "#4A5132" }}>
                                            {item.description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="has-text-centered" style={{ paddingBottom: "4rem" }}>
                    <button
                        className="button is-large"
                        style={{
                            marginTop: "2rem",
                            marginBottom: "2rem",
                            backgroundColor: "#3F462C",
                            color: "#F6F1E6",
                            border: "none",
                        }}
                        onClick={() => {
                            window.location.href = "/buddysdeli/order-now"
                        }}
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </section>
    )
}
