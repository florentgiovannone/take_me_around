export default function HomeBrandScene() {
  return (
    <section className="safe-pet-brand-scene" aria-label="Brand characters">
      <div className="safe-pet-animals">
        <figure className="safe-pet-animal safe-pet-animal-dog">
          <div className="safe-pet-bubble safe-pet-bubble-dog" role="note">
            I&rsquo;m a safe pet, are you?
          </div>
          <img src="/images/scottie.png" alt="" />
        </figure>
        <figure className="safe-pet-animal safe-pet-animal-cat">
          <div className="safe-pet-bubble safe-pet-bubble-cat" role="note">
            I most certainly am.
          </div>
          <img src="/images/tabby.png" alt="" />
        </figure>
      </div>
      <div className="safe-pet-nfc">
        <img
          src="/images/nfc_tap_pictogram.svg"
          alt="Phone tapping an NFC tag"
        />
        <p>Tap or scan the tag on a collar.</p>
      </div>
    </section>
  )
}
