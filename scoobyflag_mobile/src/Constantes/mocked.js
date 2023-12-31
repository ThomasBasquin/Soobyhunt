export const MAP_COORDINATE = [
  {
    latitude: 48.534234,
    longitude: 7.755552,
  },
  {
    latitude: 48.537757,
    longitude: 7.721906,
  },
  {
    latitude: 48.519682,
    longitude: 7.717357,
  },
  {
    latitude: 48.519057,
    longitude: 7.754779,
  },
];

export const USER_MARKERS = [
  {
    username: 'Roméo',
    team: 'MOUGOU',
    latitude: 48.530146638008176,
    longitude: 7.734781059902374,
  },
  {
    username: 'Lucas', 
    team: 'MOUGOU',
    latitude: 48.529697661615046,
    longitude: 7.738207011432991,
  },
  {
    username: 'Gaetan',
    team: 'MOUGOU',
    latitude: 48.52901172635225,
    longitude: 7.734757661120344,
  },
];

export function VILAIN_MARKERS(pos) {
  return [
    {
      title: 'Willy',
      team: 'MOUGOU',
      coordinates: {
        latitude: pos.coords.latitude + 0.00001,
        longitude: pos.coords.longitude + 0.00001,
      },
    },
    {
      title: 'Billy',
      team: null,
      coordinates: {
        latitude: pos.coords.latitude + 0.003,
        longitude: pos.coords.longitude - 0.003,
      },
    },
    {
      title: 'Slimane',
      team: 'Lolo',
      coordinates: {
        latitude: pos.coords.latitude - 0.001,
        longitude: pos.coords.longitude + 0.001,
      },
    },
  ];
}

export const ITEMS = [
  {
    id: 0,
    type: 'LUNETTE_DE_VERRA',
    slug: 'les Lunettes de Verra',
    qte: 1,
    time: 15,
  },
  {
    id: 1,
    type: 'SAC_A_DOS',
    slug: 'le Sac à dos',
    qte: 3,
    time: 10,
  },
  {
    id: 2,
    type: 'FANTOME',
    slug: 'le Fantome',
    qte: 2,
    time: 30,
  },
  {
    id: 3,
    type: 'LOUPE',
    slug: 'la Loupe',
    qte: 10,
    time: 15,
  },
  {
    id: 4,
    type: 'PIEGE',
    slug: 'le Piège',
    qte: 20,
    time: 15,
  },
];
