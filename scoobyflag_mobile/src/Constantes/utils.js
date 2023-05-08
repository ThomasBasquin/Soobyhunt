const degreeToRadians = degree => {
  return (degree * Math.PI) / 180;
};

const distanceCalculation = (lat1, lng1, lat2, lng2) => {
  let earthRadius = 6371; //radius of Earth in KM.
  let differenceOfLatInRadians = degreeToRadians(lat1 - lat2);
  let differenceOfLngInRadians = degreeToRadians(lng1 - lng2);

  let lat1InRadians = degreeToRadians(lat1);
  let lat2InRadians = degreeToRadians(lat2);

  let a =
    Math.sin(differenceOfLatInRadians / 2) *
      Math.sin(differenceOfLatInRadians / 2) +
    Math.cos(lat1InRadians) *
      Math.cos(lat2InRadians) *
      Math.sin(differenceOfLngInRadians / 2) *
      Math.sin(differenceOfLngInRadians / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

export function pointInCircle(pointLat, pointLng, circle) {
  const {circleLat, circleLng, circleRadius} = circle;

  distanceOfPointFromCircleCenter = distanceCalculation(
    pointLat,
    pointLng,
    circleLat,
    circleLng,
  );

  return distanceOfPointFromCircleCenter <= circleRadius ? true : false;
}

export function pointInPolygon(point, polygon) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point.latitude,
    y = point.longitude;

  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    var xj = polygon[j].latitude,
      yj = polygon[j].longitude;

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function findPiture(name) {
  if (name == 'SAC_A_DOS') {
    return require('./../Assets/items/SAC_A_DOS.png');
  } else if (name == 'lunette de véra') {
    return require('./../Assets/items/LUNETTE_DE_VERRA.png');
  } else if (name == 'FANTOME') {
    return require('./../Assets/items/FANTOME.png');
  } else if (name == 'loupe') {
    return require('./../Assets/items/LOUPE.png');
  } else if (name == 'PIEGE') {
    return require('./../Assets/items/PIEGE.png');
  } else {
    return require('./../Assets/items/EMPTY.png');
  }
}

export function findInfoItem(name) {
  if (name == 'SAC_A_DOS') {
    return {slug : "le sac à dos", time: undefined};
  } else if (name == 'LUNETTE_DE_VERRA') {
    return {slug : "les lunettes de Verra", time:45 };
  } else if (name == 'FANTOME') {
    return {slug : "le fantôme", time:30 };
  } else if (name == 'loupe') {
    return {slug : "la Loupe", time:10 };
  } else if (name == 'PIEGE') {
    return {slug : "le piège", time:15 };
  } else {
    return {slug : null, time: null};
  }
}
