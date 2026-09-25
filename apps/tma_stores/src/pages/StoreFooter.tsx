const columns = [
  {
    title: "Customer services",
    links: ["Where is my order?", "Delivery", "Returns & refunds", "Contact us", "Product recalls"],
  },
  {
    title: "Shopping with us",
    links: ["Our apps", "Gift cards", "Store finder", "Price promise"],
  },
  {
    title: "Our company",
    links: ["About us", "Careers", "Sustainability", "Modern slavery statement"],
  },
]

const legal = ["Privacy policy", "Cookie policy", "Terms & conditions", "Accessibility"]

export default function StoreFooter({ name }: { name: string }) {
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <div className="store-footer-columns">
          {columns.map((column) => (
            <section key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <ul className="store-footer-legal">
          {legal.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
        <p>© {name} 2026. Demonstration shop.</p>
      </div>
    </footer>
  )
}
