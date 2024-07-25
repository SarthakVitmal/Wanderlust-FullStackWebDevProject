mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://style/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 11 // starting zoom
});
console.log(listing.geometry.coordinates)
map.on('load', () => {
    if (listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
        const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat(listing.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({offset: 25})
            .setHTML(`<h6>${listing.title}</h6><p>Exact location will be provided after booking`)
            )
            .addTo(map);
    }
});

