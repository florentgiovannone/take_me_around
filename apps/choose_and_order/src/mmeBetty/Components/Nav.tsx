import Logo from "../Assets/Images/Logo.png"
import { useState } from 'react'
import navigation from '../Assets/Json/navigation.json'

export default function Nav({ cart, handleRemoveAllFromCart, handleRemoveFromCart, handleAddToCart, cartCount, cartTotal, cartTotalPrice }: { cart: any[], handleRemoveAllFromCart: (item: any) => void, handleRemoveFromCart: (item: any) => void, handleAddToCart: (item: any) => void, cartCount: boolean, cartTotal: number, cartTotalPrice: number }) {
    const [isActive, setIsActive] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)


    const handleCartClick = () => {
        if (isCartOpen) {
            setIsCartOpen(false)
        } else {
            setIsCartOpen(true)
        }
    }


    return (
        <>
            <nav
                className="navbar is-dark is-fixed-top has-shadow"
                role="navigation"
                aria-label="main navigation"
                style={{
                    backgroundColor: '#000000', // Solid black for mobile
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    minHeight: 'auto',
                    height: 'auto'
                }}
            >
                <div className="container is-fluid">
                    <div className="navbar-brand" style={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
                        <a className="navbar-item" href="/mme-betty" style={{ padding: '0.5rem', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={Logo}
                                alt="Company Logo"
                                style={{ height: '120px', width: 'auto', maxHeight: 'none' }}
                            />
                        </a>

                        <a
                            role="button"
                            className={`navbar-burger is-large ${isActive ? 'is-active' : ''}`}
                            aria-label="menu"
                            aria-expanded={isActive}
                            onClick={() => setIsActive(!isActive)}
                            style={{ height: '120px', width: '120px', alignSelf: 'center' }}
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                        <p className="control is-hidden-desktop" style={{ position: 'relative' }}>
                            <button className="button is-black" onClick={handleCartClick}>
                                <span className="icon">
                                    <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                </span>
                            </button>
                            {cartCount && (
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#000000',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem'
                                }}>
                                    {cartTotal}
                                </div>
                            )}
                        </p>
                    </div>

                    <div
                        className={`navbar-menu ${isActive ? 'is-active' : ''}`}
                        style={{
                            backgroundColor: isActive ? '#000000' : 'transparent' // Keep black on mobile when active
                        }}
                    >
                        <div className="navbar-start">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="navbar-item has-text-light px-6 py-5 is-size-4-mobile is-size-6-tablet has-text-centered-mobile"
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        minHeight: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setIsActive(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="navbar-end">
                            {/* Mobile: Show social links prominently */}
                            <div className="navbar-item is-hidden-desktop has-text-centered">
                                <div className="field is-grouped is-grouped-centered mb-4">
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.facebook.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512" width="20" height="20">
                                                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.instagram.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" width="20" height="20">
                                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.tiktok.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" width="20" height="20">
                                                    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://x.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" width="20" height="20">
                                                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    {cartCount && (
                                        <div className="card-footer-item" style={{ backgroundColor: '#f5f5f5', color: '#000000', borderRadius: '50%', width: '20px', height: '20px', position: 'absolute', top: '35%', right: '20px' }}>
                                            {cartTotal}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Desktop: Compact social links */}
                            <div className="navbar-item is-hidden-touch">
                                <div className="field is-grouped">
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.facebook.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512" width="20" height="20">
                                                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.instagram.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" width="20" height="20">
                                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://www.tiktok.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" width="20" height="20">
                                                    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a className="button is-light" target="_blank" href="https://x.com/">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" width="20" height="20">
                                                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                                </svg>
                                            </span>
                                        </a>
                                    </p>
                                    <p className="control is-hidden-mobile" style={{ position: 'relative' }}>
                                        <button className="button is-black" onClick={handleCartClick}>
                                            <span className="icon">
                                                <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                </svg>
                                            </span>
                                        </button>
                                        {cartCount && (
                                            <div style={{
                                                backgroundColor: '#f5f5f5',
                                                color: '#000000',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem'
                                            }}>
                                                {cartTotal}
                                            </div>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav >
            {isCartOpen && (
                <>
                    {/* Mobile: Full screen modal */}
                    <div className="modal is-active is-hidden-desktop is-hidden-tablet">
                        <div className="modal-background" onClick={() => setIsCartOpen(false)}></div>
                        <div className="modal-content" style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '0',
                            margin: '1rem',
                            maxHeight: '90vh',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                overflowY: 'auto',
                                maxHeight: '90vh',
                                padding: '1rem'
                            }}>
                                <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                                    <h2 className="title is-4" style={{ margin: 0 }}>Your Cart</h2>
                                    <button className="delete is-large" onClick={() => setIsCartOpen(false)}></button>
                                </div>

                                {cart.filter((item) => item.quantity > 0).length === 0 ? (
                                    <div className="has-text-centered py-6">
                                        <p className="subtitle">Your cart is empty</p>
                                        <button className="button is-dark" onClick={() => setIsCartOpen(false)}>
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {cart.filter((item) => item.quantity > 0).map((item) => (
                                            <div key={item.name} className="box mb-3" style={{ padding: '1rem' }}>
                                                <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
                                                    <h4 className="subtitle is-6 has-text-weight-bold" style={{ margin: 0, flex: 1 }}>
                                                        {item.name}
                                                    </h4>
                                                    <button className="delete" onClick={() => handleRemoveAllFromCart(item)}></button>
                                                </div>
                                                <div className="is-flex is-justify-content-space-between is-align-items-center">
                                                    <div className="field has-addons">
                                                        <div className="control">
                                                            <button className="button" onClick={() => handleRemoveFromCart(item)}>
                                                                -
                                                            </button>
                                                        </div>
                                                        <div className="control">
                                                            <button className="button is-static">
                                                                {item.quantity}
                                                            </button>
                                                        </div>
                                                        <div className="control">
                                                            <button className="button" onClick={() => handleAddToCart(item)}>
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <span className="tag is-dark is-large">£{item.price * item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="box has-text-centered">
                                            <p className="title is-4">Total: £{cartTotalPrice}</p>
                                            <div className="buttons is-centered">
                                                <button className="button is-dark is-large">Checkout</button>
                                                <button className="button is-light is-large" onClick={() => setIsCartOpen(false)}>
                                                    Continue Shopping
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop & Tablet: Right-aligned modern cart */}
                    <div className="is-hidden-mobile" style={{
                        position: 'fixed',
                        top: '140px',
                        right: '20px',
                        width: '400px',
                        maxWidth: '90vw',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        maxHeight: 'calc(90vh - 140px)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            overflowY: 'auto',
                            maxHeight: 'calc(90vh - 140px)',
                            padding: '1rem'
                        }}>
                            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                                <h2 className="title is-4" style={{ margin: 0 }}>Your Cart</h2>
                                <button className="delete is-large" onClick={() => setIsCartOpen(false)}></button>
                            </div>

                            {cart.filter((item) => item.quantity > 0).length === 0 ? (
                                <div className="has-text-centered py-6">
                                    <p className="subtitle">Your cart is empty</p>
                                    <button className="button is-dark" onClick={() => setIsCartOpen(false)}>
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {cart.filter((item) => item.quantity > 0).map((item) => (
                                        <div key={item.name} className="box mb-3" style={{ padding: '1rem' }}>
                                            <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
                                                <h4 className="subtitle is-6 has-text-weight-bold" style={{ margin: 0, flex: 1 }}>
                                                    {item.name}
                                                </h4>
                                                <button className="delete" onClick={() => handleRemoveAllFromCart(item)}></button>
                                            </div>
                                            <div className="is-flex is-justify-content-space-between is-align-items-center">
                                                <div className="field has-addons">
                                                    <div className="control">
                                                        <button className="button" onClick={() => handleRemoveFromCart(item)}>
                                                            -
                                                        </button>
                                                    </div>
                                                    <div className="control">
                                                        <button className="button is-static">
                                                            {item.quantity}
                                                        </button>
                                                    </div>
                                                    <div className="control">
                                                        <button className="button" onClick={() => handleAddToCart(item)}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="tag is-dark is-large">£{item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="box has-text-centered">
                                        <p className="title is-4">Total: £{cartTotalPrice}</p>
                                        <div className="buttons is-centered">
                                            <button className="button is-dark is-large">Checkout</button>
                                            <button className="button is-light is-large" onClick={() => setIsCartOpen(false)}>
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

        </>
    )
}