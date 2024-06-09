function loadPlaces(position) {
    const params = {
        accessToken: 'pk.eyJ1IjoiZWRtdW5kNjkiLCJhIjoiY2x4N3lhMTM5MHZmdDJqczU2dGwyOHp6eSJ9.JwXiSyHs2kWzNt5s1hWySg',
        radius: 300, // in meters
    };

    // Using a general search query to find all types of places
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/.json
        ?proximity=${position.longitude},${position.latitude}
        &limit=30
        &access_token=${params.accessToken}`;

    return fetch(endpoint)
        .then((res) => res.json())
        .then((resp) => resp.features)
        .catch((err) => {
            console.error('Error with Mapbox API', err);
        });
}


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const placeText = document.createElement('a-link');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.name);
                    placeText.setAttribute('scale', '15 15 15');
                    
                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
    
};