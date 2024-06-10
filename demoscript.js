function loadPlaces(position) {
    const params = {
        accessToken: 'pk.eyJ1IjoiZWRtdW5kNjkiLCJhIjoiY2x4N3lhMTM5MHZmdDJqczU2dGwyOHp6eSJ9.JwXiSyHs2kWzNt5s1hWySg',
        radius: 300, // in meters
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

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
                if (!places || !Array.isArray(places)) {
                    throw new Error('No places found or places is not an array');
                }
                places.forEach((place) => {
                    const latitude = place.geometry.coordinates[1];
                    const longitude = place.geometry.coordinates[0];

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

navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    // Camera access granted, proceed with your augmented reality logic
  })
  .catch(function(error) {
    // Handle errors or user denial of camera access permission
    console.error('Could not access the camera:', error);
  });
