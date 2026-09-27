import { useState } from "react"
import menus from "../Assets/Json/menus.json"

type MenuItem = {
    id: string
    name: string
    price: number
    description: string
    quantity: number
}

export default function OrderNow({ handleAddToCart }: { handleAddToCart: (item: MenuItem) => void }) {
    const [activeTab, setActiveTab] = useState("Breakfast")
    const activeMenu = menus.find((menu) => menu.name === activeTab)

    return (
        <section className="section" style={{ minHeight: "100vh", paddingTop: "180px", backgroundColor: "#F6F1E6" }}>
            <div className="container" style={{ padding: "0 1rem" }}>
                <h2
                    className="title is-2-desktop is-3-tablet is-4-mobile mb-6 has-text-centered"
                    style={{ color: "#3F462C", fontFamily: "Fraunces, Georgia, serif" }}
                >
                    Order Now
                </h2>
                <p className="subtitle is-4-desktop is-5-tablet is-6-mobile has-text-centered mb-6" style={{ color: "#6B7344" }}>
                    Breakfast and lunch from Buddy's Deli. No dinner, no wine list.
                </p>
                <div className="columns is-mobile is-gapless mb-5">
                    {menus.map((menu) => (
                        <div className="column" key={menu.name}>
                            <button
                                className="button is-fullwidth"
                                onClick={() => setActiveTab(menu.name)}
                                style={{
                                    backgroundColor: activeTab === menu.name ? "#6B7344" : "#F6F1E6",
                                    color: activeTab === menu.name ? "#F6F1E6" : "#3F462C",
                                    borderColor: "#6B7344",
                                }}
                            >
                                {menu.name}
                            </button>
                        </div>
                    ))}
                </div>
                {activeMenu?.items.map((item) => (
                    <div key={item.id} className="card" style={{ marginBottom: "1.5rem", backgroundColor: "#EFE8DA", border: "1px solid #E7E0D2" }}>
                        <div className="card-content" style={{ padding: "1rem" }}>
                            <div className="is-hidden-tablet">
                                <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                    <h3 className="title is-6 has-text-weight-bold" style={{ color: "#3F462C", margin: 0 }}>
                                        {item.name}
                                    </h3>
                                    <span className="title is-6 has-text-weight-bold" style={{ color: "#3F462C", margin: 0 }}>
                                        £{item.price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="mb-3" style={{ color: "#4A5132" }}>{item.description}</p>
                                <button
                                    className="button is-fullwidth"
                                    style={{ backgroundColor: "#6B7344", color: "#F6F1E6", border: "none" }}
                                    onClick={() => handleAddToCart(item)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="is-hidden-mobile is-flex is-justify-content-space-between is-align-items-start">
                                <div style={{ flex: 1, paddingRight: "1rem" }}>
                                    <h3 className="title is-5 has-text-weight-bold" style={{ color: "#3F462C", margin: 0 }}>
                                        {item.name}
                                    </h3>
                                    <p className="mt-2" style={{ color: "#4A5132" }}>{item.description}</p>
                                </div>
                                <div className="has-text-centered" style={{ minWidth: "140px" }}>
                                    <span className="title is-5 has-text-weight-bold mb-2" style={{ color: "#3F462C", display: "block" }}>
                                        £{item.price.toFixed(2)}
                                    </span>
                                    <button
                                        className="button"
                                        style={{ backgroundColor: "#6B7344", color: "#F6F1E6", border: "none" }}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
