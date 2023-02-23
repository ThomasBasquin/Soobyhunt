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

export function MARKERS(pos){
  
  return [
  {
    title: 'Willy',
    equip: 'MOUGOU',
    coordinates: {
      latitude: pos.coords.latitude + 0.00001,
      longitude: pos.coords.longitude + 0.00001,
    },
  },
  {
    title: 'Billy',
    equip: null,
    coordinates: {
      latitude: pos.coords.latitude + 0.003,
      longitude: pos.coords.longitude - 0.003,
    },
  },
  {
    title: 'Slimane',
    equip: 'Lolo',
    coordinates: {
      latitude: pos.coords.latitude - 0.001,
      longitude: pos.coords.longitude + 0.001,
    },
  },
]}
