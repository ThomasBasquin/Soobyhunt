const degreeToRadians =  (degree) =>{
    return degree * Math.PI / 180;
}

const distanceCalculation = (lat1, lng1, lat2, lng2) => {
    let earthRadius = 6371;                               //radius of Earth in KM.
    let differenceOfLatInRadians = degreeToRadians(lat1 - lat2);
    let differenceOfLngInRadians = degreeToRadians(lng1 - lng2);

    let lat1InRadians = degreeToRadians(lat1);
    let lat2InRadians = degreeToRadians(lat2);

    let a = Math.sin(differenceOfLatInRadians/2) * Math.sin(differenceOfLatInRadians/2) +
            Math.cos(lat1InRadians) * Math.cos(lat2InRadians) * 
            Math.sin(differenceOfLngInRadians/2) * Math.sin(differenceOfLngInRadians/2) ;
    
    let c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
    return earthRadius*c;
}

export function pointInCircle(pointLat, pointLng, circle){

    const {circleLat, circleLng, circleRadius} = circle;

    distanceOfPointFromCircleCenter = distanceCalculation(pointLat, pointLng,circleLat, circleLng);

    return distanceOfPointFromCircleCenter<=circleRadius ? true:false;
}

export function pointInPolygon(point, polygon) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point.latitude, y = point.longitude;
    
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i].latitude, yi = polygon[i].longitude;
        var xj = polygon[j].latitude, yj = polygon[j].longitude;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};