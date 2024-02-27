
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    console.log(center_geometry);

    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: center_geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

console.log(listing);
map.addControl(new mapboxgl.NavigationControl());

for(dt of listing){
    const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(dt.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(`<a href="/listings/${ dt._id}" style="min-width: 10rem;">
        <div class="card col card-listing" >
            <img src=${dt.Images[0]} 
               class="card-img-top" 
               alt="listing-iamge" 
               style="height:15rem"
            >
            <div class="card-img-overlay"></div>
            <div class="card-body">
              <p class="card-text">
                 <b>${ dt.title}</b>
                 <br>
                 &#8377; ${dt.price.toLocaleString("en-IN") }/night
              </p>
            </div>
        </div>
    </a>`)
    )
    .addTo(map);
}

