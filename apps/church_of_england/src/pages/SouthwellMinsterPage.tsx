import type { CSSProperties } from "react"
import SectionAudio from "../components/SectionAudio"
import westFront from "../assets/church-of-england/images/southwell/west-front.jpg"
import westWindow from "../assets/church-of-england/images/southwell/west-window.jpg"
import leaves from "../assets/church-of-england/images/southwell/leaves.jpg"
import organ from "../assets/church-of-england/images/southwell/organ.jpg"
import choir from "../assets/church-of-england/images/southwell/choir.jpg"
import "../styles/style.css"
import "../styles/southwell-minster.css"

/** Drop `welcome-dean.mp4` (or `.webm`) in `assets/.../video/southwell/` to enable the player. */
const welcomeVideoModules = import.meta.glob(
  "../assets/church-of-england/video/southwell/welcome-dean.{mp4,webm}",
  { eager: true, import: "default" },
) as Record<string, string>
const welcomeVideoSrc = Object.values(welcomeVideoModules)[0] ?? null

export default function SouthwellMinsterPage() {
  const heroStyle = {
    "--southwell-hero-image": `url(${westFront})`,
  } as CSSProperties

  return (
    <div className="southwell-minster">
      <header className="hero" role="banner" style={heroStyle}>
        <div className="hero-inner">
          <div className="eyebrow">Nottinghamshire · Church of England</div>
          <h1>Southwell Minster</h1>
          <p className="tagline">The Cathedral &amp; Parish Church of the Blessed Virgin Mary — a Norman jewel of the English Midlands, in continuous prayer since 627.</p>
          <div className="meta">
            <span>Founded c. 627</span>
            <span>Norman rebuilding from 1108</span>
            <span>Cathedral since 1884</span>
          </div>
        </div>
      </header>

      <section className="welcome-dean" aria-labelledby="welcome-dean-heading">
        <div className="welcome-dean-inner">
          <p id="welcome-dean-heading" className="welcome-dean-invite">
            Play the welcome message below from Father Stephen
          </p>
          {welcomeVideoSrc ? (
            <video
              className="welcome-dean-video"
              controls
              playsInline
              preload="metadata"
              src={welcomeVideoSrc}
            >
              Your browser does not support the video element.
            </video>
          ) : (
            <div className="welcome-dean-placeholder" role="img" aria-label="Welcome video placeholder">
              <span className="welcome-dean-placeholder-label">Welcome video — coming soon</span>
            </div>
          )}
          <p className="welcome-dean-attribution">
            <span className="welcome-dean-role">The Very Reverend</span>
            <span className="welcome-dean-name">Dr Stephen Evans</span>
            <span className="welcome-dean-title">Dean of Southwell Minster</span>
          </p>
        </div>
      </section>

      <nav className="toc" aria-label="Section navigation">
        <ul>
          <li><a href="#history">History</a></li>
          <li><a href="#treasures">Treasures &amp; interior</a></li>
          <li><a href="#officers">Principal officers</a></li>
          <li><a href="#music">Music &amp; choirs</a></li>
          <li><a href="#worship">Liturgy &amp; services</a></li>
          <li><a href="#visit">Opening hours</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <main>

      {/* HISTORY */}
      <section id="history">
        <div className="section-head">
          <div className="section-num">I.</div>
          <SectionAudio workSlug="southwell-minster" sectionId="history" />
          <h2>A brief history</h2>
        </div>
        <p className="lede">A minster church has stood at Southwell for well over a thousand years — outlasting Vikings, the Reformation, civil war and fire — and today serves as the mother church of the Diocese of Southwell &amp; Nottingham.</p>

        <div className="split">
          <div>
            <p>Tradition holds that <strong>Paulinus, the first Archbishop of York, founded the earliest church here in 627</strong> while baptising converts in the River Trent. In <strong>956</strong> King Eadwig granted land at Southwell to Oskytel, Archbishop of York, and a Saxon minster church was established; the manor was recorded in detail in the <em>Domesday Book</em> of 1086.</p>
            <p>The present <strong>Norman Minster</strong> was begun about <strong>1108</strong>, rebuilt over the earlier Anglo-Saxon foundations. The nave, transepts, central tower and the two western “pepperpot” towers survive as one of the finest examples of severe Romanesque design in England. The <strong>Early English quire</strong> was rebuilt between 1234 and 1251, and the celebrated <strong>Chapter House</strong> was begun in 1288.</p>
            <p>Suppressed by Henry VIII in <strong>1540</strong>, the collegiate church was refounded in 1543, lost its status again in 1548, and was finally restored in 1557. During the Civil War, <strong>Charles I surrendered at Southwell in 1646</strong> after the siege of Newark. In <strong>1711</strong> lightning struck the south-west spire and fire destroyed the roofs, bells, clock and organ; both spires were removed in 1805 and only rebuilt in 1879–81 during Ewan Christian’s extensive Victorian restoration.</p>
            <p>The Minster became a <strong>cathedral in 1884</strong>, when the new Diocese of Southwell was created to serve Nottinghamshire and Derbyshire (Derby becoming a separate diocese in 1927). It remains dedicated to the Blessed Virgin Mary and, uniquely among English cathedrals, retains its ancient title of <em>Minster</em>.</p>
          </div>
          <figure>
            <img src={westWindow} alt="The great west window of Southwell Minster, framed by the two Norman ‘pepperpot’ towers." />
            <figcaption>The Norman west front, with its distinctive “pepperpot” towers and the 1996 Angel Window by Patrick Reyntiens.</figcaption>
          </figure>
        </div>

        <div className="rule-ornament">✦ ✦ ✦</div>

        <dl className="timeline" aria-label="Timeline of Southwell Minster">
          <dt>627</dt><dd>Paulinus, first Archbishop of York, credited with founding a church at Southwell.</dd>
          <dt>956</dt><dd>King Eadwig grants land to Archbishop Oskytel; a Saxon minster is established.</dd>
          <dt>1108</dt><dd>Norman rebuilding begins at the east end; nave commenced after 1120.</dd>
          <dt>1234–51</dt><dd>The Early English quire is rebuilt.</dd>
          <dt>1288</dt><dd>Construction of the octagonal Chapter House begins.</dd>
          <dt>1320–40</dt><dd>The great stone pulpitum (choir screen) is carved in the Decorated style.</dd>
          <dt>1540–57</dt><dd>Suppressed under Henry VIII, restored under Philip and Mary.</dd>
          <dt>1646</dt><dd>Charles I surrenders to Scottish Presbyterian troops at Southwell.</dd>
          <dt>1711</dt><dd>Lightning strike; fire destroys the roofs, bells, clock and organ.</dd>
          <dt>1879–81</dt><dd>Ewan Christian’s restoration; the western spires are re-erected.</dd>
          <dt>1884</dt><dd>Southwell Minster becomes a cathedral of the new diocese.</dd>
          <dt>1996</dt><dd>Patrick Reyntiens’ great Angel Window installed at the west end.</dd>
          <dt>2021</dt><dd>Chapter House reopens after major restoration, with cantilever lift for full access.</dd>
        </dl>
      </section>

      {/* TREASURES */}
      <section id="treasures">
        <div className="section-head">
          <div className="section-num">II.</div>
          <SectionAudio workSlug="southwell-minster" sectionId="treasures" />
          <h2>Treasures and places of interest</h2>
        </div>
        <p className="lede">From England’s finest medieval leaf-carvings to a 16th-century Flemish east window, the Minster is unusually rich in things worth pausing over.</p>

        <div className="split">
          <figure>
            <img src={leaves} alt="Naturalistic 13th-century leaf carvings around the doorway of Southwell Minster’s Chapter House." />
            <figcaption>“The Leaves of Southwell” — 13th-century foliage carvings around the Chapter House portal, voted the nation’s favourite cathedral treasure in 2023.</figcaption>
          </figure>
          <div>
            <h3>The Leaves of Southwell</h3>
            <p>The <strong>Chapter House</strong> (begun 1288) is octagonal, has no central pillar, and is decorated with the deeply-undercut foliage carvings collectively known as <strong>“The Leaves of Southwell.”</strong> Individual species — ivy, maple, oak, hop, hawthorn — are all identifiable, interspersed with Green Men and mythological figures. Regarded as the finest 13th-century naturalistic carving in the United Kingdom, they were the subject of Nikolaus Pevsner’s classic 1945 monograph and were voted Britain’s favourite cathedral treasure in a 2023 public poll.</p>
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <h3>The Norman nave</h3>
            <p>Seven bays of short, circular columns with scalloped capitals; a single large triforium arch in each bay; small round-headed clerestory windows and circular external openings — one of the outstanding survivals of severe English Romanesque.</p>
          </div>
          <div className="feature">
            <h3>The tympanum</h3>
            <p>The late-11th-century carved tympanum in the north transept, together with a fragment of tessellated floor, are the sole visible remains of the earlier Anglo-Saxon minster.</p>
          </div>
          <div className="feature">
            <h3>The pulpitum (rood screen)</h3>
            <p>An elaborately carved stone choir screen of 1320–40, an outstanding example of the Decorated style, with two storeys of ogee-arched niches and openwork gables framing the entrance to the quire.</p>
          </div>
          <div className="feature">
            <h3>The Early English quire</h3>
            <p>Rebuilt 1234–51 in a pure Early English style: clustered columns, twin lancets to the upper storey, ribbed stone vault and a square east end lit by two tiers of four lancet windows.</p>
          </div>
          <div className="feature">
            <h3>The east window</h3>
            <p>Four Renaissance panels of 16th-century Flemish glass by Jean Chastellain, after designs by Noël Bellemare, originally made for the Temple Church in Paris and presented to the Minster in 1818; the four evangelists above are by Clayton &amp; Bell (1876).</p>
          </div>
          <div className="feature">
            <h3>The Angel Window</h3>
            <p>Installed at the west end in <strong>1996</strong>, this great modern window by <strong>Patrick Reyntiens</strong> — one of Britain’s foremost stained-glass artists — is the Minster’s most striking recent addition.</p>
          </div>
          <div className="feature">
            <h3>Tomb of Archbishop Sandys</h3>
            <p>The finest of the Minster’s memorials: the alabaster tomb of <strong>Edwin Sandys, Archbishop of York (d. 1588)</strong>, whose family long held estates in Nottinghamshire.</p>
          </div>
          <div className="feature">
            <h3>The Newstead lectern</h3>
            <p>A medieval brass eagle lectern, believed to have been recovered from the lake at Newstead Abbey after the Dissolution and given to the Minster by Archdeacon Kaye in 1805.</p>
          </div>
          <div className="feature">
            <h3>The central Norman tower</h3>
            <p>Two ornamental stages — intersecting arches below, plain arches above — place the crossing tower high among England’s surviving Norman towers.</p>
          </div>
          <div className="feature">
            <h3>Chapels for prayer</h3>
            <p>Three chapels are set aside for private prayer, including <strong>St Oswald’s Chapel</strong> (used daily for Morning Prayer and Holy Communion) and the <strong>Airmen’s Chapel</strong>, commemorating RAF Bomber Command in Nottinghamshire.</p>
          </div>
        </div>
      </section>

      {/* OFFICERS */}
      <section id="officers">
        <div className="section-head">
          <div className="section-num">III.</div>
          <SectionAudio workSlug="southwell-minster" sectionId="officers" />
          <h2>Principal officers</h2>
        </div>
        <p className="lede">Southwell Minster is governed by its <strong>Chapter</strong>, chaired by the Dean, with support and oversight from the Cathedral Council and the wider College of Canons. Below are the principal office-holders as currently listed by the Minster.</p>

        <div className="officers">
          <div className="officer">
            <span className="role">Bishop of Southwell &amp; Nottingham</span>
            <span className="name">The Rt Revd Paul Williams</span>
          </div>
          <div className="officer">
            <span className="role">Dean of Southwell (Interim)</span>
            <span className="name">The Revd Canon Dr Neil Evans</span>
          </div>
          <div className="officer">
            <span className="role">Dean-designate (from April 2026)</span>
            <span className="name">The Very Revd Stephen Evans</span>
          </div>
          <div className="officer">
            <span className="role">Canon Precentor</span>
            <span className="name">The Revd Canon Dr Richard Frith</span>
          </div>
          <div className="officer">
            <span className="role">Executive Member of Chapter</span>
            <span className="name">The Revd Canon Dr Stephen Hippisley-Cox</span>
          </div>
          <div className="officer">
            <span className="role">Executive Member of Chapter</span>
            <span className="name">The Revd Amanda Lees</span>
          </div>
          <div className="officer">
            <span className="role">Senior Non-Executive Member</span>
            <span className="name">Mrs Jan Richardson MBE DL</span>
          </div>
          <div className="officer">
            <span className="role">Rector Chori (Director of Music)</span>
            <span className="name">Paul Provost</span>
          </div>
          <div className="officer">
            <span className="role">Assistant Director of Music</span>
            <span className="name">Jonathan Allsopp</span>
          </div>
          <div className="officer">
            <span className="role">Head Verger</span>
            <span className="name">Andrew Todd</span>
          </div>
        </div>
        <p style={{marginTop: '22px', fontSize: '.9rem', color: 'var(--ink-soft)'}}>The Non-Executive members of Chapter also include Mr Andrew Corner, Mr Nick Alexander, Mrs Ann Carter-Gray, Mrs Marion Oswald, Mr David Walker and Mr Jonathan Wheeler. The Cathedral also employs a Chief Operating Officer and Chief Finance Officer alongside some 32 staff and around 300 volunteers.</p>
      </section>

      {/* MUSIC */}
      <section id="music">
        <div className="section-head">
          <div className="section-num">IV.</div>
          <SectionAudio workSlug="southwell-minster" sectionId="music" />
          <h2>Music foundation &amp; choirs</h2>
        </div>
        <p className="lede">A choir has sung at Southwell for more than nine hundred years — a continuous tradition of choral worship stretching from the medieval Vicars Choral to today's Cathedral Choir of boy and girl choristers, professional Lay Clerks and the volunteer Minster Chorale.</p>

        <div className="split">
          <div>
            <h3>Nine centuries of song</h3>
            <p>The Minster's musical life began with a college of <strong>Vicars Choral</strong>, resident in the buildings that stood on the site of today's Vicars' Court. One or two of their number were designated <strong>Rector Chori</strong> — “Ruler of the Choir” — a title first formally recorded at Southwell in <strong>1499</strong> and still used for the Director of Music today. Boy Choristers were added to the Vicars Choral, and the Vicars were gradually replaced by lay singers — the <strong>Lay Clerks</strong> — giving the choir substantially the shape it has today.</p>
            <p>In <strong>2005</strong> a Girls’ Choir was founded by the then Assistant Director of Music. It was fully integrated into the Cathedral Choir in <strong>2019</strong>; today boy and girl choristers enjoy <strong>complete parity</strong>, sharing services, robes (cassock and surplice), age ranges and title — all are simply Cathedral Choristers. In <strong>2021</strong> Southwell appointed its <strong>first-ever female head chorister</strong> in the Minster’s thousand-year history, and in 2025 the Minster celebrated the Girls’ Choir’s twentieth anniversary.</p>
          </div>
          <figure>
            <img src={organ} alt="The medieval stone pulpitum of Southwell Minster with the Nicholson organ mounted above." />
            <figcaption>The pulpitum with the main Nicholson organ mounted above, in its Caröe case.</figcaption>
          </figure>
        </div>

        <h3 style={{marginTop: '36px'}}>The choirs today</h3>
        <div className="features">
          <div className="feature">
            <h3>Boy Choristers</h3>
            <p>The traditional treble line, drawn from The Minster School. The boys usually sing on their own for Monday and Tuesday Evensong and join the Lay Clerks from Thursday to Sunday during term, alternating with the girls.</p>
          </div>
          <div className="feature">
            <h3>Girl Choristers</h3>
            <p>Founded in 2005 and now fully equal partners in the Cathedral Choir — currently around 18 girls, sharing all chorister duties, rehearsals, tours and recordings on the same footing as the boys.</p>
          </div>
          <div className="feature">
            <h3>Lay Clerks</h3>
            <p>Six professional Lay Clerks and six Auxiliary Lay Clerks — the adult alto, tenor and bass lines, direct descendants of the medieval Vicars Choral. They sing with the choristers from Thursday to Sunday and on feast days.</p>
          </div>
          <div className="feature">
            <h3>The Minster Chorale</h3>
            <p>Founded in <strong>1994</strong>, an auditioned adult voluntary choir of up to thirty singers directed by the Assistant Director of Music. Sings for services when the Cathedral Choir is on leave, plus monthly Sunday Mattins.</p>
          </div>
          <div className="feature">
            <h3>The Minster School</h3>
            <p>All choristers are educated at <strong>The Minster School</strong>, a Church of England academy with a music-specialist Junior Department (Years 3–6) and a member of the Choir Schools’ Association.</p>
          </div>
          <div className="feature">
            <h3>Southwell Choral Society</h3>
            <p>A non-auditioning community choir of over sixty years’ standing, rehearsing weekly in the Minster during term — the wider musical community that gathers around the foundation.</p>
          </div>
        </div>

        <h3 style={{marginTop: '36px'}}>The organs</h3>
        <p>The Minster’s main instrument stands on the medieval pulpitum in an oak case designed by <strong>W. D. Caröe</strong>. The present Screen Organ was rebuilt through the 1990s by leading organ builders (advised by John Norman, Stephen Bicknell and Ian Bell) with the Caröe case preserved on historical grounds. A separate <strong>Nave Organ</strong>, whose lineage traces back to a 1662 instrument by “Mr Derbie” and repairs after the great fire of 1711, supports congregational singing at the west end, and a fine <strong>chamber organ</strong> is used for continuo and smaller-scale liturgy. A 72-page illustrated booklet, <em>The Organs of Southwell Minster</em> by former Rector Chori Paul Hale, is available from the Cathedral Shop.</p>
      </section>

      {/* WORSHIP */}
      <section id="worship">
        <div className="section-head">
          <div className="section-num">V.</div>
          <SectionAudio workSlug="southwell-minster" sectionId="worship" />
          <h2>Liturgy and daily services</h2>
        </div>
        <p className="lede">The Minster’s daily round of prayer follows the Church of England’s Common Worship pattern, sustained during term by one of the country’s most distinguished cathedral music foundations.</p>

        <div className="split">
          <div>
            <p>Southwell keeps a full <strong>Anglican cathedral daily office</strong>: Morning Prayer, Holy Communion (the Eucharist) and Evening Prayer or Evensong are offered every day. Choral services are sung most days during school terms by the <strong>Cathedral Choir</strong> — the Boy Choristers, Girl Choristers and Lay Clerks — who between them provide music for eight choral services a week. On Sundays the Girl and Boy Choristers sing the Eucharist and Evensong in rotation with the Lay Clerks. Additional services are sung by the <strong>Minster Chorale</strong>, a chamber choir of up to thirty volunteer singers founded in 1994.</p>
            <p>The <strong>Sunday Cathedral Eucharist (10.00am)</strong> and <strong>Sunday Evensong (3.30pm)</strong> are live-streamed and remain available online for a week and a day respectively. Visitors of all traditions are warmly welcome; there is no admission charge.</p>
          </div>
          <figure>
            <img src={choir} alt="The quire of Southwell Minster looking east, showing the medieval stalls and stone vaulting." />
            <figcaption>The Early English quire, where choral Evensong is sung most days during term.</figcaption>
          </figure>
        </div>

        <div className="services" style={{marginTop: '28px'}}>
          <div>
            <h3>Weekday pattern</h3>
            <table>
              <tbody>
                <tr><td>8.30am</td><td>Morning Prayer — <em>St Oswald’s Chapel</em></td></tr>
                <tr><td>12.15pm</td><td>Holy Communion — <em>St Oswald’s / Airmen’s Chapel</em><br /><small>(Saturdays: 9.00am)</small></td></tr>
                <tr><td>5.30pm</td><td>Choral Evensong — <em>The Quire</em><br /><small>(said Evening Prayer on Wednesdays; sung Mon, Tue, Thu, Fri, Sat in term time)</small></td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3>Sunday pattern</h3>
            <table>
              <tbody>
                <tr><td>8.00am</td><td>Holy Communion (BCP, said)</td></tr>
                <tr><td>10.00am</td><td>Sung Cathedral Eucharist — <em>live-streamed</em></td></tr>
                <tr><td>3.30pm</td><td>Choral Evensong — <em>live-streamed</em></td></tr>
              </tbody>
            </table>
            <p style={{fontSize: '.85rem', marginTop: '12px'}}><em>Service times can vary on feast days and during school holidays — please check the Services Calendar on the Minster website before travelling.</em></p>
          </div>
        </div>
      </section>

      {/* VISIT / HOURS */}
      <section id="visit">
        <div className="section-head">
          <div className="section-num">VI.</div>
          <h2>Opening hours</h2>
        </div>
        <p className="lede">The Minster is open to visitors every day of the year, without charge. Donations towards its upkeep are gratefully received.</p>

        <div className="hours">
          <div className="card">
            <h3>The Cathedral</h3>
            <dl>
              <dt>Monday – Saturday</dt><dd>10.00am – 6.30pm</dd>
              <dt>Sunday</dt><dd>10.00am – 4.30pm</dd>
            </dl>
            <p style={{fontSize: '.88rem', marginTop: '10px'}}>Stewards are normally on duty from 10.30am to 5.00pm (Mon–Sat) and 11.00am to 5.00pm on Sunday. Occasional service or event closures may apply at short notice.</p>
          </div>
          <div className="card">
            <h3>Minster Office</h3>
            <dl>
              <dt>Monday – Friday</dt><dd>10.00am – 1.00pm</dd>
            </dl>
            <p style={{fontSize: '.88rem', marginTop: '10px'}}>The Minster Centre houses the office, education team and tourist information point.</p>
          </div>
          <div className="card">
            <h3>Refectory</h3>
            <dl>
              <dt>Mon – Sat</dt><dd>9.30am – 4.00pm</dd>
              <dt>Sunday</dt><dd>10.00am – 4.00pm</dd>
            </dl>
          </div>
          <div className="card">
            <h3>Cathedral Shop</h3>
            <dl>
              <dt>Mon – Sat</dt><dd>10.00am – 4.00pm</dd>
              <dt>Sunday</dt><dd>11.30am – 3.30pm</dd>
            </dl>
          </div>
          <div className="card">
            <h3>Archbishop’s Palace &amp; Gardens</h3>
            <dl>
              <dt>Daily</dt><dd>9.00am – 5.00pm</dd>
            </dl>
            <p style={{fontSize: '.88rem', marginTop: '10px'}}>Free entry to the ruined medieval palace and sensory gardens adjoining the Minster.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-head">
          <div className="section-num">VII.</div>
          <h2>Contact &amp; how to find us</h2>
        </div>

        <div className="contact">
          <div className="contact-card">
            <h3>Southwell Minster</h3>
            <div className="row">
              <span>Address</span>
              <address>
                The Minster Centre<br />
                Church Street<br />
                Southwell<br />
                Nottinghamshire NG25 0HD<br />
                United Kingdom
              </address>
            </div>
            <div className="row">
              <span>Telephone</span>
              <span><a href="tel:+441636812649">01636 812649</a> <em style={{fontSize: '.85em'}}>(Main Office)</em></span>
            </div>
            <div className="row">
              <span>Email</span>
              <span><a href="mailto:office@southwellminster.org.uk">office@southwellminster.org.uk</a></span>
            </div>
            <div className="row">
              <span>Website</span>
              <span><a href="https://www.southwellminster.org" target="_blank" rel="noopener">southwellminster.org</a></span>
            </div>
            <div className="row">
              <span>Urgent clergy</span>
              <span><a href="tel:+441636817290">01636 817290</a></span>
            </div>
            <div className="row">
              <span>Shop</span>
              <span><a href="tel:+441636812933">01636 812933</a> · <a href="mailto:cathedralshop@southwellminster.org.uk">cathedralshop@southwellminster.org.uk</a></span>
            </div>
          </div>

          <div>
            <h3 style={{marginTop: '0'}}>Getting here</h3>
            <p>Southwell is a small market town in central Nottinghamshire, seven miles from the A1 and about 30 minutes by road from Nottingham on the A612. The Minster stands on Church Street in the centre of the town, a short walk from the Saturday market square.</p>
            <p><strong>Guided tours</strong> can be pre-booked through the Minster Office; <strong>education visits</strong> are arranged separately on <a href="tel:+441636817287">01636 817287</a>.</p>
            <p><strong>Online worship:</strong> the Sunday Eucharist and Evensong are live-streamed from the Minster’s website and remain available for catch-up during the following week.</p>
            <p style={{fontSize: '.88rem', color: 'var(--ink-soft)'}}>Social media: <a href="https://www.facebook.com/SouthwellMinster" target="_blank" rel="noopener">Facebook</a> · <a href="https://twitter.com/SouthwMinster" target="_blank" rel="noopener">Twitter/X</a> · <a href="https://www.instagram.com/SouthwellMinster" target="_blank" rel="noopener">Instagram</a></p>
          </div>
        </div>
      </section>

      </main>

      <footer>
        <div className="colophon">✦ Ecclesia Cathedralis Sanctae Mariae de Southwell ✦</div>
        <div>Concise visitor guide compiled from the Minster’s own publications, the Association of English Cathedrals, and Wikipedia. Not an official Minster publication.</div>
        <div style={{marginTop: '8px'}}>Photographs: west front, west window, quire, Chapter House portal and pulpitum with organ — Wikimedia Commons (Diliff and Geograph contributors), CC BY-SA.</div>
      </footer>
    </div>
  )
}
