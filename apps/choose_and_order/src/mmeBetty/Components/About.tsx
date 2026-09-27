export default function About() {
    return (
        <section id="about" className="section has-background-white-ter"
        style={{
            minHeight: '60vh',
            marginTop: '-100px',
        }}
        >
            <div className="container">
                <div className="has-text-centered">
                <h2 className="title is-2 mb-6">About Us</h2>
                <div className="content is-medium has-text-grey-dark" style={{ paddingBottom: "6rem" }}>
                    <p className="is-size-4">
                        Welcome to Bistro Mme Betty, where passion meets flavor. Since opening our doors,
                        we've been committed to serving delicious, high-quality food made from the freshest ingredients.
                        Our menu is inspired by timeless culinary traditions, crafted with care to satisfy every palate.
                    </p>
                    <p>
                        Whether you're joining us for a casual meal or a special occasion, our warm atmosphere and attentive service
                        will make you feel right at home. Here every dish tells a story —
                        and every guest is part of it.
                    </p>
                    <p>
                        We look forward to welcoming you and sharing our love of food with you.
                    </p>
                </div>
                </div>
            </div>
        </section>
    );
}