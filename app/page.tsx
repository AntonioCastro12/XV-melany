'use client';

import {
  type CSSProperties,
  type FormEvent,
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
  return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
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

  return <div ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}

function formatFamilyName(value: string) {
  const name = value.trim();
  if (!name) return '';
  return /^familia\b/i.test(name) ? name : `Familia ${name}`;
}

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 ? `52${digits}` : digits;
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
  const [guest, setGuest] = useState({ name: 'Invitado especial', seats: 4, table: 1 });
  const [organizerMode, setOrganizerMode] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', seats: '2', table: '1', phone: '' });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedSeats = Number.parseInt(params.get('lugares') ?? '', 10);
    const parsedTable = Number.parseInt(params.get('mesa') ?? '', 10);
    const familyName = formatFamilyName(params.get('familia') || params.get('invitado') || '') || 'Invitado especial';
    setGuest({
      name: familyName,
      seats: Number.isFinite(parsedSeats) && parsedSeats > 0 ? parsedSeats : 4,
      table: Number.isFinite(parsedTable) && parsedTable > 0 ? parsedTable : 1,
    });
    setOrganizerMode(params.get('organizador') === '1');
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
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

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

  function generateInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const family = formatFamilyName(inviteForm.name);
    const seats = Math.max(1, Number.parseInt(inviteForm.seats, 10) || 1);
    const table = Math.max(1, Number.parseInt(inviteForm.table, 10) || 1);
    const url = new URL(window.location.origin + window.location.pathname);
    if (family) url.searchParams.set('familia', family);
    url.searchParams.set('lugares', String(seats));
    url.searchParams.set('mesa', String(table));
    setGeneratedLink(url.toString());
    setCopied(false);
  }

  async function copyGeneratedLink() {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
  }

  async function shareGeneratedLink() {
    if (!generatedLink) return;
    const family = formatFamilyName(inviteForm.name);
    const shareData = {
      title: 'XV Años de Melany Deniss',
      text: family ? `Invitación para ${family}` : 'Te invitamos a los XV años de Melany Deniss',
      url: generatedLink,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await copyGeneratedLink();
  }

  function sendPersonalizedInvitation() {
    if (!generatedLink) return '#';
    const phone = normalizeWhatsAppNumber(inviteForm.phone);
    const family = formatFamilyName(inviteForm.name);
    const seats = Math.max(1, Number.parseInt(inviteForm.seats, 10) || 1);
    const table = Math.max(1, Number.parseInt(inviteForm.table, 10) || 1);
    const seatsLabel = seats === 1 ? '1 persona' : `${seats} personas`;
    const message = encodeURIComponent(
      family
        ? `Hola ${family}, con mucha alegría les invitamos a los XV años de Melany Deniss. Su pase es para ${seatsLabel}, mesa ${table}. Abran su invitación personalizada aquí: ${generatedLink}`
        : `Hola, con mucha alegría te invitamos a los XV años de Melany Deniss. Tu pase es para ${seatsLabel}, mesa ${table}. Abre tu invitación personalizada aquí: ${generatedLink}`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  }

  function personalizedConfirmationUrl() {
    const number = WHATSAPP_NUMBER.replace(/\D/g, '');
    const details = `${guest.seats} ${guest.seats === 1 ? 'persona' : 'personas'}, mesa ${guest.table}`;
    const message = encodeURIComponent(
      `Hola, somos ${guest.name} y confirmamos nuestra asistencia a los XV años de Melany Deniss. Nuestro pase es para ${details}.`,
    );
    return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
  }

  return (
    <main className="invitation-shell">
      <audio ref={audioRef} src={invitationData.music} loop preload="none" />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {opened && (
        <div className="ambient-sparkles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <span key={index}>✦</span>)}
        </div>
      )}

      <section
        className={`welcome-screen ${opened ? 'welcome-screen--opened' : ''}`}
        aria-hidden={opened}
      >
        <div className="welcome-monogram" aria-hidden="true"><span>XV</span></div>
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
          <Reveal className="portrait-animation reveal--left">
            <div className="portrait-animation__orbit" aria-hidden="true">
              <i /><i /><i /><i />
              <span>XV</span>
              <strong>MD</strong>
            </div>
            <p>Una noche<br />inolvidable</p>
          </Reveal>
          <Reveal className="portrait-copy reveal--right" delay={120}>
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
          <Reveal className="reveal--left">
            <LocationCard icon="✝" title="Ceremonia Religiosa" {...invitationData.ceremony} />
          </Reveal>
          <Reveal className="reveal--right" delay={140}>
            <LocationCard icon="✦" title="Recepción" {...invitationData.reception} />
          </Reveal>
        </div>
      </section>

      <section className="itinerary-section section-pad">
        <Reveal><SectionHeading kicker="Cada momento cuenta" title="Itinerario" light /></Reveal>
        <div className="timeline">
          {invitationData.itinerary.map((event, index) => (
            <Reveal className="timeline__event" delay={index * 90} key={event.title}>
              <span className="timeline__time">{event.time}</span>
              <span className="timeline__dot" aria-hidden="true">{event.icon}</span>
              <div><small>0{index + 1}</small><h3>{event.title}</h3></div>
            </Reveal>
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

      {organizerMode && (
        <section className="organizer-section section-pad" id="generador">
          <Reveal>
            <SectionHeading kicker="Uso del organizador" title="Enviar invitación" />
            <p className="section-intro">Escribe los datos de cada familia para crear su pase personalizado y enviarlo directamente por WhatsApp.</p>
            <form className="invite-generator" onSubmit={generateInvitation}>
              <label>
                Apellido de la familia (opcional)
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(event) => setInviteForm({ ...inviteForm, name: event.target.value })}
                  placeholder="Este campo es opcional"
                />
              </label>
              <label>
                Número de pases
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={inviteForm.seats}
                  onChange={(event) => setInviteForm({ ...inviteForm, seats: event.target.value })}
                  required
                />
              </label>
              <label>
                Número de mesa
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={inviteForm.table}
                  onChange={(event) => setInviteForm({ ...inviteForm, table: event.target.value })}
                  required
                />
              </label>
              <label>
                Número de teléfono / WhatsApp (opcional)
                <input
                  type="tel"
                  value={inviteForm.phone}
                  onChange={(event) => setInviteForm({ ...inviteForm, phone: event.target.value })}
                  placeholder="Vacío si la compartes por otro medio"
                />
              </label>
              <button className="primary-button primary-button--wine" type="submit">Crear pase personalizado</button>
            </form>

            {generatedLink && (
              <div className="generated-invite" aria-live="polite">
                <div>
                  <span>Enlace listo para {formatFamilyName(inviteForm.name) || 'invitado sin nombre'}</span>
                  <strong>{inviteForm.seats || '1'} {Number(inviteForm.seats) === 1 ? 'persona' : 'personas'} · Mesa {inviteForm.table || '1'}</strong>
                </div>
                <p>{generatedLink}</p>
                <div className="generated-invite__actions">
                  <button className="outline-button" type="button" onClick={copyGeneratedLink}>{copied ? 'Enlace copiado' : 'Copiar enlace'}</button>
                  <button className="outline-button" type="button" onClick={shareGeneratedLink}>Compartir ↗</button>
                  {normalizeWhatsAppNumber(inviteForm.phone) && (
                    <a className="primary-button primary-button--wine" href={sendPersonalizedInvitation()} target="_blank" rel="noreferrer">Enviar por WhatsApp ↗</a>
                  )}
                </div>
              </div>
            )}
          </Reveal>
        </section>
      )}

      <section className="pass-section section-pad">
        <Reveal>
          <SectionHeading kicker="Tu invitación" title="Pase personalizado" light />
          <article className="guest-pass">
            <div className="guest-pass__main">
              <p>Pase para</p>
              <h3>{guest.name}</h3>
              <div className="guest-pass__details">
                <strong>{guest.seats} {guest.seats === 1 ? 'persona' : 'personas'}</strong>
                <span aria-hidden="true">·</span>
                <strong>Mesa {guest.table}</strong>
              </div>
              <span>XV · MD · {invitationData.eventDate.year}</span>
            </div>
            <div className="guest-pass__stub">
              <span>Pases</span>
              <strong>{guest.seats}</strong>
              <small>{guest.seats === 1 ? 'persona' : 'personas'}</small>
              <span className="guest-pass__table">Mesa {guest.table}</span>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="gifts-section section-pad">
        <Reveal>
          <SectionHeading kicker="Un detalle especial" title="Sugerencia de regalo" />
          <div className="gift-suggestion">
            <span aria-hidden="true">✦</span>
            <p>Tu presencia es mi mayor alegría.</p>
            <p>Si deseas obsequiarme algo, te agradecería que fuera en efectivo y así poder elegir mi regalo ideal.</p>
          </div>
        </Reveal>
      </section>

      <section className="rsvp-section section-pad">
        <Reveal className="rsvp-card">
          <p className="eyebrow">Reserva la fecha</p>
          <h2>Confirma tu asistencia</h2>
          <p>Tu presencia hará este día aún más especial.</p>
          <a className="primary-button" href={personalizedConfirmationUrl()} target="_blank" rel="noreferrer">
            Confirmar por WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <section className="final-section section-pad">
        <div className="final-constellation" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
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

    </main>
  );
}
