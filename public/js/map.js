
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
       container: 'map', // container ID
       // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
       style: 'mapbox://styles/mapbox/streets-v12', // style URL
       center: listing.location.coordinates, // starting position [lng, lat]
       zoom: 8 // starting zoom
    });

// console.log(listing);
map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.location.coordinates)
    .setPopup(
        new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(`<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);


