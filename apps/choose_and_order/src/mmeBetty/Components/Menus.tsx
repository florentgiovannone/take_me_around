import MainMenus from "../Assets/Images/Menus.png"
import { useState } from "react";

export default function Menus() {

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle modal open
    const handleModalOpen = () => {
        setIsModalOpen(true);
    }
    return (
        <section id="menus" className="section pb-6" style={{
            minHeight: '70vh', backgroundColor: '#000000',
            marginTop: '-50px',
        }}>
            <div className="container has-text-centered is-hidden-desktop is-hidden-tablet">
                <h2 className="title is-2 mb-6" style={{ color: '#f5f5f5', marginTop: '-50px' }}>Our Menus</h2>
                {/* Mobile Menus */}
                {/* Row 1: Breakfast & Lunch */}
                <div className="columns is-centered is-mobile" style={{ marginBottom: '6rem' }}>
                    <div className="column has-text-centered">
                        <h3 className="title is-4 mb-3" style={{ color: '#f5f5f5' }}>Breakfast</h3>
                        <figure className="image is-128x128 mx-auto">
                            <img src={MainMenus} alt="Breakfast" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4 mb-3" style={{ color: '#f5f5f5' }}>Lunch</h3>
                        <figure className="image is-128x128 mx-auto">
                            <img src={MainMenus} alt="Lunch" />
                        </figure>
                    </div>
                </div>

                {/* Row 2: Dinner & Dessert */}
                <div className="columns is-centered is-mobile" style={{ marginBottom: '6rem' }}>
                    <div className="column has-text-centered">
                        <h3 className="title is-4 mb-3" style={{ color: '#f5f5f5' }}>Dinner</h3>
                        <figure className="image is-128x128 mx-auto">
                            <img src={MainMenus} alt="Dinner" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4 mb-3" style={{ color: '#f5f5f5' }}>Dessert</h3>
                        <figure className="image is-128x128 mx-auto">
                            <img src={MainMenus} alt="Dessert" />
                        </figure>
                    </div>
                </div>

                {/* Row 3: Drinks & Additional */}
                <div className="columns is-centered is-mobile" style={{ marginBottom: '6rem' }}>
                    <div className="column has-text-centered">
                        <h3 className="title is-4 mb-3" style={{ color: '#f5f5f5' }}>Drinks</h3>
                        <figure className="image is-128x128 mx-auto">
                            <img src={MainMenus} alt="Drinks" />
                        </figure>
                    </div>
                </div>
            </div>
            <div className="container has-text-centered is-hidden-desktop is-hidden-tablet">
                <button className="button is-light is-large is-outlined" style={{ marginBottom: '2rem' }} onClick={() => {
                    window.location.href = '/mme-betty/order-now';
                }}>
                    <span>Order Now</span>
                </button>
            </div>
            {/* Desktop Menus */}
            <div className="container has-text-centered is-hidden-mobile ">
                <h2 className="title is-2 mb-6" style={{ color: '#f5f5f5', marginTop: '-50px' }}>Our Menus</h2>

                {/* Menu Titles Row */}
                <div className="columns is-centered mb-5 ">
                    <div className="column has-text-centered">
                        <h3 className="title is-4" style={{ color: '#f5f5f5' }}>Breakfast</h3>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4" style={{ color: '#f5f5f5' }}>Lunch</h3>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4" style={{ color: '#f5f5f5' }}>Dinner</h3>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4" style={{ color: '#f5f5f5' }}>Dessert</h3>
                    </div>
                    <div className="column has-text-centered">
                        <h3 className="title is-4" style={{ color: '#f5f5f5' }}>Drinks</h3>
                    </div>
                </div>

                {/* Menu Images Row */}
                <div className="columns is-centered">
                    <div className="column has-text-centered">
                        <figure className="image is-128x128 mx-auto" onClick={handleModalOpen}>
                            <img src={MainMenus} alt="Breakfast" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <figure className="image is-128x128 mx-auto" onClick={handleModalOpen}>
                            <img src={MainMenus} alt="Lunch" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <figure className="image is-128x128 mx-auto" onClick={handleModalOpen}>
                            <img src={MainMenus} alt="Dinner" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <figure className="image is-128x128 mx-auto" onClick={handleModalOpen}>
                            <img src={MainMenus} alt="Dessert" />
                        </figure>
                    </div>
                    <div className="column has-text-centered">
                        <figure className="image is-128x128 mx-auto" onClick={handleModalOpen}>
                            <img src={MainMenus} alt="Drinks" />
                        </figure>
                    </div>
                </div>
            </div>
            <div className="container has-text-centered is-hidden-mobile">
                <button className="button is-light is-large is-outlined" style={{ marginTop: '7rem' }} onClick={() => {
                    window.location.href = '/mme-betty/order-now';
                }}>
                    <span>Order Now</span>
                </button>
            </div>
            <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
                <div className="modal-content" style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <figure className="image" style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}>
                        <img src={MainMenus} alt="Menu" style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            maxHeight: '85vh'
                        }} />
                    </figure>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setIsModalOpen(false)}></button>
            </div>
        </section>
    )
}