import Logo from "../Assets/Images/Logo.png"
import navigation from '../Assets/Json/navigation.json'


// Contact information
const contactInfo = [
    { label: 'Address', value: '123 Restaurant Street, City, State 12345' },
    { label: 'Phone', value: '02345 67899' },
    { label: 'Email', value: 'info@restaurant.com' },
]

// Footer component
export default function Footer() {
    return (
        <footer
            className="footer"
            style={{
                backgroundColor: '#000000',
                padding: '3rem 1rem 2rem',
                color: '#ffffff',
                marginTop: '-50px',
            }}
        >
            <div className="container is-fluid">
                <div className="columns is-multiline is-variable is-8">

                    {/* Logo and Description */}
                    <div className="column is-12-mobile is-6-tablet is-4-desktop">
                        <div className="has-text-centered-mobile has-text-left-tablet">
                            <a href="/mme-betty">
                                <img
                                    src={Logo}
                                    alt="Company Logo"
                                    style={{ height: '80px', width: 'auto', marginBottom: '1rem' }}
                                />
                            </a>
                            <p className="has-text-light is-size-6 mt-3">
                                Experience exceptional dining with our carefully crafted menu,
                                warm atmosphere, and outstanding service. Join us for an unforgettable culinary journey.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="column is-12-mobile is-6-tablet is-2-desktop">
                        <div className="has-text-centered-mobile has-text-left-tablet">
                            <h3 className="title is-5 has-text-light mb-4">Quick Links</h3>
                            <ul className="has-text-light">
                                {navigation.map((item) => (
                                    <li key={item.name} className="mb-2">
                                        <a
                                            href={item.href}
                                            className="has-text-light is-size-6 has-text-weight-normal"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="column is-12-mobile is-6-tablet is-3-desktop">
                        <div className="has-text-centered-mobile has-text-left-tablet">
                            <h3 className="title is-5 has-text-light mb-4">Contact Info</h3>
                            <ul className="has-text-light">
                                {contactInfo.map((info) => (
                                    <li key={info.label} className="mb-3">
                                        <strong className="has-text-light">{info.label}:</strong>
                                        <br />
                                        <span className="is-size-6">{info.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Social Media and Hours */}
                    <div className="column is-12-mobile is-6-tablet is-3-desktop">
                        <div className="has-text-centered-mobile has-text-left-tablet">
                            <h3 className="title is-5 has-text-light mb-4">Follow Us</h3>

                            {/* Social Media Links */}
                            <div className="field is-grouped is-grouped-centered-mobile is-grouped-left-tablet mb-4">
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
                            </div>

                            {/* Hours */}
                            <div className="has-text-light">
                                <strong className="has-text-light">Hours:</strong>
                                <br />
                                <span className="is-size-6">
                                    Mon-Thu: 11am-10pm<br />
                                    Fri-Sat: 11am-11pm<br />
                                    Sunday: 12pm-9pm
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar */}
                <hr className="has-background-grey-dark" style={{ margin: '2rem 0 1rem' }} />
                <div className="has-text-centered">
                    <p className="has-text-light is-size-6">
                        © 2024 Restaurant Name. All rights reserved. |
                        <a href="/privacy" className="has-text-light ml-2" style={{ textDecoration: 'none' }}>Privacy Policy</a> |
                        <a href="/terms" className="has-text-light ml-2" style={{ textDecoration: 'none' }}>Terms of Service</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}