// Cambia aquí el año del evento.
export const EVENT_YEAR = 2026;

// Cambia aquí el teléfono, incluyendo código de país y sin signos.
export const WHATSAPP_NUMBER = 'XXXXXXXXXX';

export const invitationData = {
  celebrant: 'Melany Deniss',
  shortDate: '24 de octubre',
  eventTitle: 'XV Años de Melany Deniss',
  message:
    'Hay momentos inolvidables que se atesoran para siempre en el corazón. Quiero compartir contigo uno de los días más especiales de mi vida.',
  finalMessage:
    'Gracias por formar parte de esta etapa tan especial de mi vida. Espero contar con tu presencia y compartir juntos una noche inolvidable.',
  eventDate: {
    year: EVENT_YEAR,
    month: 10,
    day: 24,
    startHour: 12,
    endHour: 23,
  },
  ceremony: {
    time: '12:00 PM',
    place: 'Parroquia de Nuestra Señora de Guadalupe',
    address: 'Calz. Insurgentes Ote. #2, Zona Centro',
    // Sustituye estos enlaces si deseas usar ubicaciones guardadas específicas.
    googleMaps:
      'https://www.google.com/maps/search/?api=1&query=Parroquia%20de%20Nuestra%20Se%C3%B1ora%20de%20Guadalupe%20Calz.%20Insurgentes%20Ote.%202%20Zona%20Centro',
    waze:
      'https://www.waze.com/ul?q=Parroquia%20de%20Nuestra%20Se%C3%B1ora%20de%20Guadalupe%20Calz.%20Insurgentes%20Ote.%202%20Zona%20Centro&navigate=yes',
  },
  reception: {
    time: '4:30 PM',
    place: 'Salón Cavas de Mendiola',
    address: 'Blvd. Paseo Solidaridad #11524, Haciendas del Carrizal',
    // Sustituye estos enlaces si deseas usar ubicaciones guardadas específicas.
    googleMaps:
      'https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n%20Cavas%20de%20Mendiola%20Blvd.%20Paseo%20Solidaridad%2011524%20Haciendas%20del%20Carrizal',
    waze:
      'https://www.waze.com/ul?q=Sal%C3%B3n%20Cavas%20de%20Mendiola%20Blvd.%20Paseo%20Solidaridad%2011524%20Haciendas%20del%20Carrizal&navigate=yes',
  },
  itinerary: [
    { time: '12:00 PM', title: 'Misa', icon: '✝' },
    { time: '4:30 PM', title: 'Recepción', icon: '✦' },
    { time: '5:00 PM', title: 'Comida', icon: '♢' },
    { time: '6:00 PM', title: 'Vals', icon: '♫' },
    { time: '7:00 PM', title: 'Sonido', icon: '♪' },
    { time: '10:00 PM', title: 'Banda', icon: '♬' },
  ],
  // Sustituye estas rutas con las fotografías finales, conservando los nombres.
  photos: {
    hero: '/images/melany-principal.jpg',
    featured: '/images/melany-principal.jpg',
    final: '/images/melany-final.jpg',
    gallery: [
      '/images/melany-1.jpg',
      '/images/melany-2.jpg',
      '/images/melany-3.jpg',
      '/images/melany-4.jpg',
      '/images/melany-5.jpg',
    ],
  },
  music: '/music/melany-xv.mp3', // Sustituye este archivo con la canción elegida.
  gifts: [
    // Sustituye # por el enlace real de cada opción cuando esté disponible.
    { name: 'Liverpool', detail: 'Mesa de regalos', link: '#' },
    { name: 'Amazon', detail: 'Lista de deseos', link: '#' },
    { name: 'Regalo en efectivo', detail: 'Opción disponible', link: '#' },
  ],
};

