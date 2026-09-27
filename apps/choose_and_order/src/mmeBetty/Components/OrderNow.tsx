import { useState } from "react";
import menus from '../Assets/Json/menus.json';


export default function OrderNow({ handleAddToCart }: { handleAddToCart: (item: any) => void }) {

    // State for active tab
    const [activeTab, setActiveTab] = useState('breakfast');

    // Handle tab click
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    }

    return (
        <section className="section" style={{ minHeight: '100vh', paddingTop: '180px' }}>
            <div className="container" style={{ padding: '0 1rem' }}>
                <h2 className="title is-2-desktop is-3-tablet is-4-mobile mb-6 has-text-centered" style={{ color: '#000000' }}>Order Now</h2>
                <p className="subtitle is-4-desktop is-5-tablet is-6-mobile has-text-centered mb-6" style={{ color: '#000000' }}>
                    Order your favorite dishes now and experience the best of our Bistro.
                </p>
            </div>
            <div className="container" style={{ padding: '0 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    {/* Row 1: First 3 tabs */}
                    <div className="columns is-mobile is-gapless mb-2">
                        <div className="column">
                            <button
                                className={`button is-fullwidth ${activeTab === 'breakfast' ? 'is-dark' : 'is-light'}`}
                                onClick={() => handleTabClick('breakfast')}
                                style={{ borderRadius: '8px 8px 0 0' }}
                            >
                                Breakfast
                            </button>
                        </div>
                        <div className="column">
                            <button
                                className={`button is-fullwidth ${activeTab === 'lunch' ? 'is-dark' : 'is-light'}`}
                                onClick={() => handleTabClick('lunch')}
                                style={{ borderRadius: '8px 8px 0 0' }}
                            >
                                Lunch
                            </button>
                        </div>
                        <div className="column">
                            <button
                                className={`button is-fullwidth ${activeTab === 'dinner' ? 'is-dark' : 'is-light'}`}
                                onClick={() => handleTabClick('dinner')}
                                style={{ borderRadius: '8px 8px 0 0' }}
                            >
                                Dinner
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Last 2 tabs */}
                    <div className="columns is-mobile is-gapless">
                        <div className="column is-6">
                            <button
                                className={`button is-fullwidth ${activeTab === 'dessert' ? 'is-dark' : 'is-light'}`}
                                onClick={() => handleTabClick('dessert')}
                                style={{ borderRadius: '0 0 8px 8px' }}
                            >
                                Dessert
                            </button>
                        </div>
                        <div className="column is-6">
                            <button
                                className={`button is-fullwidth ${activeTab === 'drinks' ? 'is-dark' : 'is-light'}`}
                                onClick={() => handleTabClick('drinks')}
                                style={{ borderRadius: '0 0 8px 8px' }}
                            >
                                Drinks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ padding: '0 1rem' }}>
                {activeTab === 'breakfast' && menus.find(menu => menu.name === 'Breakfast')?.items.map((item) => {
                    return (
                        <div key={item.name} className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f5f5' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                {/* Mobile Layout */}
                                <div className="is-hidden-tablet">
                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                        <h3 className="title is-6 has-text-weight-bold" style={{
                                            color: '#000000',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '60%'
                                        }}>{item.name}</h3>
                                        <span className="title is-6 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>£{item.price}</span>
                                    </div>
                                    <p className="subtitle is-7 mb-3" style={{
                                        color: '#666666',
                                        margin: '0 0 1rem 0',
                                        lineHeight: '1.3'
                                    }}>{item.description}</p>
                                    <button className="button is-dark is-outlined is-fullwidth" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Desktop/Tablet Layout */}
                                <div className="is-hidden-mobile">
                                    <div className="is-flex is-justify-content-space-between is-align-items-start">
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 className="title is-5 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>{item.name}</h3>
                                            <p className="subtitle is-6 mt-2" style={{ color: '#666666', margin: 0 }}>{item.description}</p>
                                        </div>
                                        <div className="has-text-centered" style={{ minWidth: '120px' }}>
                                            <span className="title is-5 has-text-weight-bold mb-2" style={{ color: '#000000', display: 'block', margin: 0 }}>£{item.price}</span>
                                            <button className="button is-dark is-outlined" onClick={() => handleAddToCart(item)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {activeTab === 'lunch' && menus.find(menu => menu.name === 'Lunch')?.items.map((item) => {
                    return (
                        <div key={item.name} className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f5f5' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                {/* Mobile Layout */}
                                <div className="is-hidden-tablet">
                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                        <h3 className="title is-6 has-text-weight-bold" style={{
                                            color: '#000000',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '60%'
                                        }}>{item.name}</h3>
                                        <span className="title is-6 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>£{item.price}</span>
                                    </div>
                                    <p className="subtitle is-7 mb-3" style={{
                                        color: '#666666',
                                        margin: '0 0 1rem 0',
                                        lineHeight: '1.3'
                                    }}>{item.description}</p>
                                    <button className="button is-dark is-outlined is-fullwidth" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Desktop/Tablet Layout */}
                                <div className="is-hidden-mobile">
                                    <div className="is-flex is-justify-content-space-between is-align-items-start">
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 className="title is-5 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>{item.name}</h3>
                                            <p className="subtitle is-6 mt-2" style={{ color: '#666666', margin: 0 }}>{item.description}</p>
                                        </div>
                                        <div className="has-text-centered" style={{ minWidth: '120px' }}>
                                            <span className="title is-5 has-text-weight-bold mb-2" style={{ color: '#000000', display: 'block', margin: 0 }}>£{item.price}</span>
                                            <button className="button is-dark is-outlined" onClick={() => handleAddToCart(item)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {activeTab === 'dinner' && menus.find(menu => menu.name === 'Dinner')?.items.map((item) => {
                    return (
                        <div key={item.name} className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f5f5' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                {/* Mobile Layout */}
                                <div className="is-hidden-tablet">
                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                        <h3 className="title is-6 has-text-weight-bold" style={{
                                            color: '#000000',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '60%'
                                        }}>{item.name}</h3>
                                        <span className="title is-6 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>£{item.price}</span>
                                    </div>
                                    <p className="subtitle is-7 mb-3" style={{
                                        color: '#666666',
                                        margin: '0 0 1rem 0',
                                        lineHeight: '1.3'
                                    }}>{item.description}</p>
                                    <button className="button is-dark is-outlined is-fullwidth" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Desktop/Tablet Layout */}
                                <div className="is-hidden-mobile">
                                    <div className="is-flex is-justify-content-space-between is-align-items-start">
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 className="title is-5 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>{item.name}</h3>
                                            <p className="subtitle is-6 mt-2" style={{ color: '#666666', margin: 0 }}>{item.description}</p>
                                        </div>
                                        <div className="has-text-centered" style={{ minWidth: '120px' }}>
                                            <span className="title is-5 has-text-weight-bold mb-2" style={{ color: '#000000', display: 'block', margin: 0 }}>£{item.price}</span>
                                            <button className="button is-dark is-outlined" onClick={() => handleAddToCart(item)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {activeTab === 'dessert' && menus.find(menu => menu.name === 'Dessert')?.items.map((item) => {
                    return (
                        <div key={item.name} className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f5f5' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                {/* Mobile Layout */}
                                <div className="is-hidden-tablet">
                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                        <h3 className="title is-6 has-text-weight-bold" style={{
                                            color: '#000000',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '60%'
                                        }}>{item.name}</h3>
                                        <span className="title is-6 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>£{item.price}</span>
                                    </div>
                                    <p className="subtitle is-7 mb-3" style={{
                                        color: '#666666',
                                        margin: '0 0 1rem 0',
                                        lineHeight: '1.3'
                                    }}>{item.description}</p>
                                    <button className="button is-dark is-outlined is-fullwidth" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Desktop/Tablet Layout */}
                                <div className="is-hidden-mobile">
                                    <div className="is-flex is-justify-content-space-between is-align-items-start">
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 className="title is-5 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>{item.name}</h3>
                                            <p className="subtitle is-6 mt-2" style={{ color: '#666666', margin: 0 }}>{item.description}</p>
                                        </div>
                                        <div className="has-text-centered" style={{ minWidth: '120px' }}>
                                            <span className="title is-5 has-text-weight-bold mb-2" style={{ color: '#000000', display: 'block', margin: 0 }}>£{item.price}</span>
                                            <button className="button is-dark is-outlined" onClick={() => handleAddToCart(item)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {activeTab === 'drinks' && menus.find(menu => menu.name === 'Drinks')?.items.map((item) => {
                    return (
                        <div key={item.name} className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f5f5' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                {/* Mobile Layout */}
                                <div className="is-hidden-tablet">
                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                        <h3 className="title is-6 has-text-weight-bold" style={{
                                            color: '#000000',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '60%'
                                        }}>{item.name}</h3>
                                        <span className="title is-6 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>£{item.price}</span>
                                    </div>
                                    <p className="subtitle is-7 mb-3" style={{
                                        color: '#666666',
                                        margin: '0 0 1rem 0',
                                        lineHeight: '1.3'
                                    }}>{item.description}</p>
                                    <button className="button is-dark is-outlined is-fullwidth" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Desktop/Tablet Layout */}
                                <div className="is-hidden-mobile">
                                    <div className="is-flex is-justify-content-space-between is-align-items-start">
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 className="title is-5 has-text-weight-bold" style={{ color: '#000000', margin: 0 }}>{item.name}</h3>
                                            <p className="subtitle is-6 mt-2" style={{ color: '#666666', margin: 0 }}>{item.description}</p>
                                        </div>
                                        <div className="has-text-centered" style={{ minWidth: '120px' }}>
                                            <span className="title is-5 has-text-weight-bold mb-2" style={{ color: '#000000', display: 'block', margin: 0 }}>£{item.price}</span>
                                            <button className="button is-dark is-outlined" onClick={() => handleAddToCart(item)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
