'use client';

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { invitationData, WHATSAPP_NUMBER } from './invitation-data';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getEventDate() {
  const { year, month, day, startHour } = invitationData.eventDate;
  return new Date(year, month - 1, day, startHour, 0, 0);
}

function calculateTimeLeft(): TimeLeft {
  const distance = Math.max(0, getEventDate().getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function whatsappUrl() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  const message = encodeURIComponent(
    'Hola, confirmo mi asistencia a los XV años de Melany Deniss.',
  );
  return `https://wa.me/${number}?text=${message}`;
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function SectionHeading({ kicker, title, light = false }: { kicker: string; title: string; light?: boolean }) {
  return (
    <header className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <p>{kicker}</p>
      <h2>{title}</h2>
      <div className="western-rule" aria-hidden="true"><span>✦</span></div>
    </header>
  );
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`photo-fallback ${className}`} role="img" aria-label={`${alt}. Fotografía pendiente.`}>
        <span>MD</span>
        <small>Melany Deniss</small>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}

function LocationCard({
  icon,
  title,
  time,
  place,
  address,
  googleMaps,
  waze,
}: {
  icon: string;
  title: string;
  time: string;
  place: string;
  address: string;
  googleMaps: string;
  waze: string;
}) {
  return (
    <article className="location-card">
      <div className="location-card__icon" aria-hidden="true">{icon}</div>
      <p className="location-card__time">{time}</p>
      <h3>{title}</h3>
      <strong>{place}</strong>
      <address>{address}</address>
      <div className="button-pair">
        <a className="outline-button" href={googleMaps} target="_blank" rel="noreferrer">Google Maps</a>
        <a className="text-button" href={waze} target="_blank" rel="noreferrer">Abrir en Waze <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  );
}

function createCalendarFile() {
  const { year, month, day, startHour, endHour } = invitationData.eventDate;
  const stamp = (hour: number) =>
    `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}0000`;
  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Melany Deniss//Invitacion XV//ES',
    'BEGIN:VEVENT',
    `UID:melany-xv-${year}@invitacion`,
    `DTSTART:${stamp(startHour)}`,
    `DTEND:${stamp(endHour)}`,
    `SUMMARY:${invitationData.eventTitle}`,
    `LOCATION:${invitationData.ceremony.place} - ${invitationData.ceremony.address}`,
    `DESCRIPTION:Mis XV años. Ceremonia ${invitationData.ceremony.time}. Recepción ${invitationData.reception.time}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'xv-melany-deniss.ics';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [guest, setGuest] = useState({ name: 'Familia Ejemplo', seats: 4 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedSeats = Number.parseInt(params.get('lugares') ?? '', 10);
    setGuest({
      name: params.get('invitado')?.trim() || 'Familia Ejemplo',
      seats: Number.isFinite(parsedSeats) && parsedSeats > 0 ? parsedSeats : 4,
    });
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [opened]);

  useEffect(() => {
    if (activePhoto === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
      if (event.key === 'ArrowRight') setActivePhoto((activePhoto + 1) % invitationData.photos.gallery.length);
      if (event.key === 'ArrowLeft') setActivePhoto((activePhoto - 1 + invitationData.photos.gallery.length) % invitationData.photos.gallery.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePhoto]);

  async function openInvitation() {
    setOpened(true);
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth' }), 250);
    try {
      await audioRef.current?.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  }

  async function toggleMusic() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  }

  function closePhoto(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) setActivePhoto(null);
  }

  return (
    <main className="invitation-shell">
      <audio ref={audioRef} src={invitationData.music} loop preload="none" />

      <section
        className={`welcome-screen ${opened ? 'welcome-screen--opened' : ''}`}
        style={{ '--hero-image': `url("${invitationData.photos.hero}")` } as CSSProperties}
        aria-hidden={opened}
      >
        <div className="welcome-screen__ornament" aria-hidden="true"><span>✦</span><i /><span>✦</span></div>
        <div className="welcome-screen__content">
          <p className="eyebrow">Mis XV años</p>
          <h1>{invitationData.celebrant}</h1>
          <p className="welcome-screen__date">{invitationData.shortDate}</p>
          <button type="button" className="primary-button" onClick={openInvitation}>
            Abrir invitación <span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="welcome-screen__hint">Una noche para recordar</p>
      </section>

      <section id="inicio" ref={contentRef} className="intro-section" tabIndex={-1}>
        <div className="intro-section__stars" aria-hidden="true">✦ · ✦ · ✦</div>
        <Reveal>
          <p className="eyebrow">Mis XV años</p>
          <h2 className="script-title">{invitationData.celebrant}</h2>
          <div className="western-rule" aria-hidden="true"><span>✦</span></div>
          <p className="intro-copy">{invitationData.message}</p>
        </Reveal>
        <div className="date-lockup" aria-label={`${invitationData.shortDate} de ${invitationData.eventDate.year}`}>
          <span>Octubre</span>
          <strong>24</strong>
          <span>{invitationData.eventDate.year}</span>
        </div>
      </section>

      <section className="countdown-section section-pad">
        <Reveal>
          <SectionHeading kicker="Falta muy poco" title="Cuenta regresiva" light />
          <div className="countdown" aria-live="polite">
            {([
              ['Días', timeLeft.days],
              ['Horas', timeLeft.hours],
              ['Minutos', timeLeft.minutes],
              ['Segundos', timeLeft.seconds],
            ] as const).map(([label, value]) => (
              <div className="countdown__item" key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <button className="calendar-button" type="button" onClick={createCalendarFile}>
            <span aria-hidden="true">◇</span> Agregar al calendario
          </button>
        </Reveal>
      </section>

      <section className="portrait-section section-pad">
        <div className="content-grid content-grid--portrait">
          <Reveal className="portrait-frame">
            <Photo src={invitationData.photos.featured} alt="Fotografía principal de Melany Deniss" />
            <span className="portrait-frame__corner" aria-hidden="true">✦</span>
          </Reveal>
          <Reveal className="portrait-copy">
            <p className="eyebrow">Una nueva etapa</p>
            <h2>Quince años,<br /><em>un sueño</em></h2>
            <div className="western-rule western-rule--left" aria-hidden="true"><span>✦</span></div>
            <p>Con el corazón lleno de ilusión, quiero celebrar rodeada de las personas que hacen mi vida más especial.</p>
            <blockquote>“Los mejores recuerdos comienzan con un sí.”</blockquote>
          </Reveal>
        </div>
      </section>

      <section className="locations-section section-pad">
        <Reveal><SectionHeading kicker="Dónde nos vemos" title="La celebración" /></Reveal>
        <div className="locations-grid">
          <Reveal>
            <LocationCard icon="✝" title="Ceremonia Religiosa" {...invitationData.ceremony} />
          </Reveal>
          <Reveal>
            <LocationCard icon="✦" title="Recepción" {...invitationData.reception} />
          </Reveal>
        </div>
      </section>

      <section className="itinerary-section section-pad">
        <Reveal><SectionHeading kicker="Cada momento cuenta" title="Itinerario" light /></Reveal>
        <div className="timeline">
          {invitationData.itinerary.map((event, index) => (
            <Reveal className="timeline__event" key={event.title}>
              <span className="timeline__time">{event.time}</span>
              <span className="timeline__dot" aria-hidden="true">{event.icon}</span>
              <div><small>0{index + 1}</small><h3>{event.title}</h3></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gallery-section section-pad">
        <Reveal><SectionHeading kicker="Momentos que atesoro" title="Galería" /></Reveal>
        <p className="gallery-hint">Desliza y toca una fotografía para verla completa.</p>
        <div className="gallery-track">
          {invitationData.photos.gallery.map((photo, index) => (
            <button
              className="gallery-card"
              type="button"
              key={photo}
              onClick={() => setActivePhoto(index)}
              aria-label={`Ampliar fotografía ${index + 1}`}
            >
              <Photo src={photo} alt={`Melany Deniss, fotografía ${index + 1}`} />
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="dress-section section-pad">
        <Reveal className="dress-card">
          <div className="dress-card__motif" aria-hidden="true">✦</div>
          <SectionHeading kicker="Para esta ocasión" title="Código de Vestimenta" />
          <p className="dress-card__style">Formal <span>/</span> Vaquero Elegante</p>
          <p>Queremos verte increíble. Puedes incorporar detalles vaqueros manteniendo un estilo elegante.</p>
          <div className="western-details" aria-label="Sugerencias de vestimenta">
            <span>Botas</span><i>✦</i><span>Sombrero</span><i>✦</i><span>Formal western</span>
          </div>
          <p className="red-note"><span aria-hidden="true" /> El color rojo está reservado para la quinceañera.</p>
        </Reveal>
      </section>

      <section className="pass-section section-pad">
        <Reveal>
          <SectionHeading kicker="Tu invitación" title="Pase personalizado" light />
          <article className="guest-pass">
            <div className="guest-pass__main">
              <p>Pase para</p>
              <h3>{guest.name}</h3>
              <span>XV · MD · {invitationData.eventDate.year}</span>
            </div>
            <div className="guest-pass__stub">
              <span>Lugares</span>
              <strong>{guest.seats}</strong>
              <small>{guest.seats === 1 ? 'lugar' : 'lugares'}</small>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="gifts-section section-pad">
        <Reveal><SectionHeading kicker="Tu presencia es lo más importante" title="Mesa de Regalos" /></Reveal>
        <p className="section-intro">Si deseas tener un detalle conmigo, encontrarás aquí las opciones disponibles.</p>
        <div className="gift-grid">
          {invitationData.gifts.map((gift) => (
            gift.link === '#' ? (
              <button className="gift-card" type="button" disabled key={gift.name}>
                <span aria-hidden="true">◇</span><strong>{gift.name}</strong><small>{gift.detail} · Próximamente</small>
              </button>
            ) : (
              <a className="gift-card" href={gift.link} target="_blank" rel="noreferrer" key={gift.name}>
                <span aria-hidden="true">◇</span><strong>{gift.name}</strong><small>{gift.detail}</small>
              </a>
            )
          ))}
        </div>
      </section>

      <section className="rsvp-section section-pad">
        <Reveal className="rsvp-card">
          <p className="eyebrow">Reserva la fecha</p>
          <h2>Confirma tu asistencia</h2>
          <p>Tu presencia hará este día aún más especial.</p>
          <a className="primary-button primary-button--wine" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Confirmar por WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <section className="final-section section-pad">
        <div className="final-photo" aria-hidden="true">
          <Photo src={invitationData.photos.final} alt="Fotografía final de Melany Deniss" />
        </div>
        <div className="final-section__overlay" />
        <Reveal className="final-section__content">
          <span className="final-stars" aria-hidden="true">✦ · ✦ · ✦</span>
          <p>{invitationData.finalMessage}</p>
          <div className="western-rule" aria-hidden="true"><span>✦</span></div>
          <h2>Con cariño,<br /><em>{invitationData.celebrant}</em></h2>
          <small>{invitationData.shortDate} · {invitationData.eventDate.year}</small>
        </Reveal>
      </section>

      {opened && (
        <>
          <button className="music-control" type="button" onClick={toggleMusic} aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}>
            <span aria-hidden="true">{musicPlaying ? 'Ⅱ' : '▶'}</span>
          </button>
          <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Confirmar asistencia por WhatsApp">WA</a>
        </>
      )}

      {activePhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Fotografía ${activePhoto + 1}`} onClick={closePhoto}>
          <button className="lightbox__close" type="button" onClick={() => setActivePhoto(null)} aria-label="Cerrar fotografía">×</button>
          <button className="lightbox__nav lightbox__nav--prev" type="button" aria-label="Fotografía anterior" onClick={() => setActivePhoto((activePhoto - 1 + invitationData.photos.gallery.length) % invitationData.photos.gallery.length)}>‹</button>
          <Photo src={invitationData.photos.gallery[activePhoto]} alt={`Melany Deniss, fotografía ampliada ${activePhoto + 1}`} />
          <button className="lightbox__nav lightbox__nav--next" type="button" aria-label="Fotografía siguiente" onClick={() => setActivePhoto((activePhoto + 1) % invitationData.photos.gallery.length)}>›</button>
          <p>{activePhoto + 1} / {invitationData.photos.gallery.length}</p>
        </div>
      )}
    </main>
  );
}
