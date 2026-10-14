import { useCallback, useEffect, useRef, useState } from 'react';
import { photos } from './photos.js';
import { profile, series } from './content.js';

const ordered = series.flatMap((group) => photos.filter((photo) => photo.series === group.id));
const bySlug = Object.fromEntries(ordered.map((photo) => [photo.slug, photo]));
const seriesTitle = Object.fromEntries(series.map((group) => [group.id, group.title]));
const hero = ['sakura-night', 'shrine-pillar-profile', 'torii-obi'].map((slug) => bySlug[slug]).filter(Boolean);

const srcSet = (slug) => `/images/${slug}-640.webp 640w, /images/${slug}-1200.webp 1200w`;
const caption = (photo) => [photo.title, photo.place].filter(Boolean).join(' · ');

function Photo({ photo, sizes, eager = false, className }) {
  return <img className={className} src={`/images/${photo.slug}-1200.webp`} srcSet={srcSet(photo.slug)} sizes={sizes} width={photo.width} height={photo.height} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" style={{ backgroundColor: photo.color }} />;
}

function Lightbox({ photo, onClose, onStep }) {
  const index = ordered.indexOf(photo);
  const touch = useRef(null);
  useEffect(() => {
    document.querySelector('.lightbox__close')?.focus();
    const key = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onStep(1);
      if (event.key === 'ArrowLeft') onStep(-1);
      if (event.key === 'Tab') {
        const buttons = [...document.querySelectorAll('.lightbox button')];
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', key); document.body.classList.add('has-lightbox');
    return () => { document.removeEventListener('keydown', key); document.body.classList.remove('has-lightbox'); };
  }, [onClose, onStep]);
  useEffect(() => {
    // Warm the neighbours so stepping through feels instant.
    [-1, 1].forEach((step) => { const next = ordered[(index + step + ordered.length) % ordered.length]; new Image().src = `/images/${next.slug}-1200.webp`; });
  }, [index]);
  const start = (event) => { touch.current = event.touches[0].clientX; };
  const end = (event) => {
    if (touch.current === null) return;
    const delta = event.changedTouches[0].clientX - touch.current; touch.current = null;
    if (Math.abs(delta) > 50) onStep(delta < 0 ? 1 : -1);
  };
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer" onMouseDown={(event) => event.target === event.currentTarget && onClose()} onTouchStart={start} onTouchEnd={end}>
    <button className="lightbox__close" onClick={onClose} aria-label="Close photograph">×</button>
    <button className="lightbox__previous" onClick={() => onStep(-1)} aria-label="Previous photograph">←</button>
    <figure className="lightbox__figure">
      <img key={photo.slug} src={`/images/${photo.slug}-1200.webp`} alt={photo.alt} width={photo.width} height={photo.height} />
      <figcaption><span>{caption(photo)}</span><span className="lightbox__meta">{seriesTitle[photo.series]} · {String(index + 1).padStart(2, '0')} / {ordered.length}</span></figcaption>
    </figure>
    <button className="lightbox__next" onClick={() => onStep(1)} aria-label="Next photograph">→</button>
  </div>;
}

function App() {
  const [active, setActive] = useState(() => bySlug[window.location.hash.slice(1)] ?? null);
  const opener = useRef(null);
  const open = (photo, event) => { opener.current = event.currentTarget; setActive(photo); };
  const close = useCallback(() => { setActive(null); requestAnimationFrame(() => opener.current?.focus()); }, []);
  const step = useCallback((delta) => setActive((photo) => ordered[(ordered.indexOf(photo) + delta + ordered.length) % ordered.length]), []);
  useEffect(() => {
    // Each photograph has a shareable URL: photography.prestonzen.com/#<slug>
    const url = window.location.pathname + window.location.search + (active ? `#${active.slug}` : '');
    if (active || bySlug[window.location.hash.slice(1)]) window.history.replaceState(null, '', url);
  }, [active]);

  return <>
    <a className="skip-link" href="#work">Skip to photographs</a>
    <header className="site-header">
      <a className="wordmark" href="#top">PRESTON <span>ZEN</span></a>
      <nav aria-label="Main navigation">
        <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
    </header>

    <main id="top">
      <section className="intro">
        <div className="intro__copy">
          <p className="eyebrow">{profile.role.toUpperCase()} · {profile.base.toUpperCase()}</p>
          <h1>{profile.name}</h1>
          <p className="intro__statement"><em>{profile.statement}</em></p>
          <p className="intro__description">{profile.intro}</p>
          <ul className="series-index" aria-label="Series">
            {series.map((group) => <li key={group.id}><a href={`#${group.id}`}><span>{group.index}</span>{group.title}<small>{photos.filter((photo) => photo.series === group.id).length}</small></a></li>)}
          </ul>
        </div>
        <div className="intro__images">
          {hero.map((photo, i) => <button key={photo.slug} className={`intro__frame intro__frame--${i + 1}`} onClick={(event) => open(photo, event)} aria-label={`Open photograph: ${photo.title}`}>
            <Photo photo={photo} eager={i === 0} sizes={i === 0 ? '(max-width: 760px) 92vw, 34vw' : '(max-width: 760px) 45vw, 18vw'} />
          </button>)}
        </div>
      </section>

      <div id="work">
        {series.map((group) => {
          const items = ordered.filter((photo) => photo.series === group.id);
          return <section className="series section-wrap" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
            <div className="series__heading">
              <p className="eyebrow">{group.index} / {String(series.length).padStart(2, '0')}</p>
              <h2 id={`${group.id}-title`}>{group.title}</h2>
              <p className="series__note">{group.note}</p>
              <span className="series__count">{String(items.length).padStart(2, '0')} photographs</span>
            </div>
            <div className="gallery">
              {items.map((photo) => <figure className="photo-card" key={photo.slug}>
                <button onClick={(event) => open(photo, event)} aria-label={`Open photograph: ${photo.title}`}>
                  <Photo photo={photo} sizes="(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 380px" />
                </button>
                <figcaption><span>{photo.title}</span>{photo.place && <span className="photo-card__place">{photo.place}</span>}</figcaption>
              </figure>)}
            </div>
          </section>;
        })}
      </div>

      <section className="about section-wrap" id="about" aria-labelledby="about-title">
        <div>
          <p className="eyebrow">ABOUT</p>
          <h2 id="about-title">People first.<br /><em>Pictures follow.</em></h2>
        </div>
        <div className="about__copy">
          {profile.bio.map((paragraph) => { const [before, after] = paragraph.split('{mentor}'); return <p key={paragraph}>{before}{after !== undefined && <><a className="inline-link" href={profile.mentor.href} rel="noopener">{profile.mentor.name}</a>{after}</>}</p>; })}
          <dl className="facts">
            {profile.facts.map((fact) => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="contact section-wrap" id="contact" aria-labelledby="contact-title">
        <p className="eyebrow">CONTACT</p>
        <h2 id="contact-title">Say hello.</h2>
        <p>For questions about the work, prints or publication.</p>
        <a className="contact__email" href={`mailto:${profile.email}`}>{profile.email}</a>
        {profile.links.length > 0 && <ul className="contact__links">{profile.links.map((link) => <li key={link.href}><a href={link.href} rel="me">{link.label} ↗</a></li>)}</ul>}
      </section>
    </main>

    <footer className="site-footer">
      <a className="wordmark" href="#top">PRESTON <span>ZEN</span></a>
      <p>All photographs by {profile.name}. Please ask before reusing.</p>
      <small>© {new Date().getFullYear()} {profile.name}</small>
    </footer>

    {active && <Lightbox photo={active} onClose={close} onStep={step} />}
  </>;
}

export default App;
