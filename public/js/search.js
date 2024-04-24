
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    // console.log(locationcenter);

    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: locationcenter, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// console.log(listings);
map.addControl(new mapboxgl.NavigationControl());

for(dt of listings){
    const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(dt.location.coordinates)
    .setPopup(
        new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(`<a href="/listings/${ dt._id}" style="min-width: 8rem; height:15rem">
        <div class="card col card-listing " >
            <img src=${dt.coverImage} 
               class="card-img-top" 
               alt="listing-iamge" 
               style="height:13rem"
            >
            <div class="card-img-overlay"></div>
            <p class="card-text">
                 <b>${ dt.title}</b>
            </p>
        </div>
    </a>`)
    )
    .addTo(map);
}

