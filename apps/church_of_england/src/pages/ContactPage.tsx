export default function ContactPage() {
  return (
    <div className="southwell-minster church-allpages">
      <main>
        <section>
          <h1>Contact</h1>
          <p className="lede">
            For partnerships, exhibitions, technical support, or any questions about Take Me Around, please
            contact us using the details below.
          </p>

          <div className="contact">
            <div className="contact-card">
              <h3>Get in Touch</h3>
              <div className="row">
                <span>Email</span>
                <span>
                  <a href="mailto:info@takemearound.com">info@takemearound.com</a>
                </span>
              </div>
              <div className="row">
                <span>Phone</span>
                <span>
                  <a href="tel:+442000000000">+44 (0)20 0000 0000</a>
                </span>
              </div>
            </div>

            <div className="contact-card">
              <h3>Office Address</h3>
              <address>
                Take Me Around Ltd.
                <br />
                Parkgate House, 33a Pratt Street
                <br />
                London, NW1 0BG
                <br />
                United Kingdom
              </address>
            </div>
          </div>

          <h2>Find Us</h2>
          <div className="southwell-map">
            <iframe
              title="Take Me Around office map"
              src="https://www.google.com/maps?q=Parkgate+House,+33a+Pratt+Street,+NW1+0BG&output=embed"
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <footer>
        <div className="colophon">Take Me Around</div>
        <div>Church of England</div>
      </footer>
    </div>
  )
}
