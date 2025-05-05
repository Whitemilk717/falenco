<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onMount } from "svelte";

    let map;
    let marker;
    let query = $state("");


    /* map creation and map click handler registration
    -------------------------------------------------------- */
    /* NOTE:
     * leaflet needs window to work, this is why I use onMount
     */
    onMount(async () => {
        let L = await import("leaflet");
        await import ("leaflet/dist/leaflet.css");

        map = L.map("map")                          // instantiates a map object given the DOM ID of a <div> element
            .setView([43.685355, 10.618784], 20);   // sets the view of the map (geographical center and zoom). Returns "this"

        L.tileLayer(                                                // used to load and display tile layers on the map
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
            { attribution: '© OpenStreetMap contributors' }
        ).addTo(map);

        map.on("click", addMarker);
    });


    /* function to add a marker after a click
    -------------------------------------------------------- */
    function addMarker(e) {
        changeView(e.latlng.lat, e.latlng.lng)
    }


    /* function to add a marker after a click and center the view
    -------------------------------------------------------- */
    function changeView(lat, long) {
        if (marker) {
            marker.remove();                        // removing the old marker
        }
        map.panTo([lat, long]);                     // pans the map to a given center. Returns this
        marker = L.marker([lat, long]).addTo(map);  // adding a new marker
    }


    /* function to obtain the coordinates of the place entered by the user
    -------------------------------------------------------- */
    async function getCoordinates() {
        await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&q=" + query)  // HTTP request to Nominatim
            .then( (response) => response.json() )
            .then ( (data) => {
                if (data.length > 0) {          // the answer is an array of objects
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    changeView(lat, lon);
                }
                else {
                    alert("Questo luogo non esiste. Riprova!");
                }
            });
    }
</script>



<!-- HTML section
------------------------------------------------------------ -->
<p>Mappa</p>

<button onclick={() => changeView(43.722991, 10.395450)}>
    Vai a Pisa
</button>

<button onclick={() => changeView(43.685355, 10.618784)}>
    Vai a Calcinaia
</button>

<form onsubmit={() => getCoordinates()}>
    <input bind:value={query} placeholder="Luogo o indirizzo" required>
    <button type="submit">Invia</button>
</form>

<div id="map"></div>



<!-- CSS section
------------------------------------------------------------ -->
<style>
    #map { height: 900px; }
</style>