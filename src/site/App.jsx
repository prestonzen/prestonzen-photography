import { useEffect, useRef, useState } from 'react';
import { photos } from './photos.js';

const categories = ['All work', ...new Set(photos.map((photo) => photo.category))];

function App() {
  const [category, setCategory] = useState('All work');
  const [active, setActive] = useState(null);
  const opener = useRef(null);
  const visible = category === 'All work' ? photos : photos.filter((photo) => photo.category === category);
  const move = (step) => setActive((photo) => {
    const list = category === 'All work' ? photos : photos.filter((item) => item.category === category);
    const index = list.findIndex((item) => item.src === photo?.src);
    return list[(index + step + list.length) % list.length];
  });
  useEffect(() => {
    if (!active) return;
    const close = document.querySelector('.lightbox__close'); close?.focus();
    const key = (event) => {
      if (event.key === 'Escape') { setActive(null); requestAnimationFrame(() => opener.current?.focus()); }
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'Tab') {
        const buttons = [...document.querySelectorAll('.lightbox button')];
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', key); document.body.classList.add('has-lightbox');
    return () => { document.removeEventListener('keydown', key); document.body.classList.remove('has-lightbox'); };
  }, [active, category]);
  return <main>
    <header className="site-header"><a className="wordmark" href="#top">PRESTON <span>ZEN</span></a><nav aria-label="Main navigation"><a href="#work">Selected work</a><a href="#about">About</a><a href="mailto:contact@prestonzen.com">Contact ↗</a></nav></header>
    <section className="intro" id="top"><div className="intro__copy"><p className="eyebrow">OSAKA, JAPAN · PORTRAITS IN GOOD LIGHT</p><h1>A moment,<br/><em>held gently.</em></h1><p className="intro__description">Quiet, natural portraits that leave room for you to be yourself.</p><a className="text-link" href="#work">Explore selected work →</a></div>{photos[0] && <a className="intro__image" href="#work" aria-label="View selected portrait"><img src={photos[0].src} alt={photos[0].alt} fetchPriority="high"/><span className="intro__image-note">01 / KIMONO PORTRAITS</span></a>}</section>
    <section className="work section-wrap" id="work"><div className="section-heading"><div><p className="eyebrow">A FEW RECENT FRAMES</p><h2>Selected work</h2></div><span className="work-count">{String(visible.length).padStart(2,'0')} photographs</span></div>
      <div className="filter-row" role="group" aria-label="Filter photographs by category">{categories.map((item) => <button key={item} className={category === item ? 'filter is-active' : 'filter'} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
      <div className="gallery">{visible.map((photo) => <button className="photo-card" key={photo.src} onClick={(event) => { opener.current = event.currentTarget; setActive(photo); }} aria-label={`Open photograph: ${photo.alt}`}><img src={photo.src} alt={photo.alt} loading="lazy" decoding="async"/><span className="photo-card__caption"><span>{photo.title}</span><span className="photo-card__category">{photo.category}</span></span></button>)}</div>
    </section>
    <section className="about section-wrap" id="about"><div><p className="eyebrow">A LITTLE ABOUT ME</p></div><div className="about__copy"><h2>People first.<br/><em>Pictures follow.</em></h2><p>I'm Preston, a portrait photographer based in Higashiosaka. I've spent 12 years learning to notice the small things that make a portrait feel like you.</p><p>I grew up learning from my photographer father, and later from mentor Dan Alka. Today I bring that care to relaxed sessions around Osaka, with a particular love for kimono portraits.</p><a className="text-link" href="mailto:contact@prestonzen.com">Ask about a session →</a></div></section>
    <section className="session section-wrap"><div><p className="eyebrow">THE SESSION</p><h2>Simple, personal,<br/><em>unhurried.</em></h2></div><div className="session__details"><p>Private kimono portrait sessions in Osaka, with a small collection of kimono available to borrow.</p><ul><li><span>01</span> Two hours together</li><li><span>02</span> One or two guests</li><li><span>03</span> Ten edited digital photographs within seven days</li></ul><p className="session__note">Hair, makeup and specialist dressing services aren't provided.</p><a className="text-link" href="mailto:contact@prestonzen.com?subject=Portrait%20session%20inquiry">Start a conversation ↗</a></div></section>
    <footer className="site-footer"><a className="wordmark" href="#top">PRESTON <span>ZEN</span></a><p>Portraits made with care in Osaka.</p><a className="footer-email" href="mailto:contact@prestonzen.com">contact@prestonzen.com ↗</a><small>© {new Date().getFullYear()} Preston Zen</small></footer>
    {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer" onMouseDown={(event) => event.target === event.currentTarget && setActive(null)}><button className="lightbox__close" onClick={() => { setActive(null); requestAnimationFrame(() => opener.current?.focus()); }} aria-label="Close photograph">×</button><button className="lightbox__previous" onClick={() => move(-1)} aria-label="Previous photograph">←</button><figure className="lightbox__figure"><img src={active.src} alt={active.alt}/><figcaption>{active.title}<span>{active.category}</span></figcaption></figure><button className="lightbox__next" onClick={() => move(1)} aria-label="Next photograph">→</button></div>}
  </main>;
}

export default App;
