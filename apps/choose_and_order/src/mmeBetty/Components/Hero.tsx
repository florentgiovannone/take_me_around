import Hero from '../Assets/Images/Hero.avif'

export default function HeroPage() {
    return (
        <section 
            className="hero is-fullheight"
            style={{
                height: '110vh',
                backgroundImage: `url(${Hero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
            }}
        >
            {/* Optional overlay for opacity effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Black overlay for opacity
                zIndex: 1
            }} />
            
            <div className="hero-body" style={{ zIndex: 2, position: 'relative' }}>
                <div className="container has-text-centered">
                    <h2 className="title is-2 has-text-white">
                        Welcome to Bistro Mme Betty
                    </h2>
                    <button className="button is-light is-large is-outlined" onClick={() => {
                        window.location.href = '/mme-betty#reservation';
                    }}>
                        Book now
                    </button>
                </div>
            </div>
        </section>
    )
}