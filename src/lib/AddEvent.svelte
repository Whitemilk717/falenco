<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onDestroy, onMount } from "svelte";
    import { addUnsub, auth, db } from "$lib/firebase.js";
    import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";

    let unsub;
    const props = $props();
    let members = $state("");                                // users who can be invited to the event
    const docRef = doc(db, "calendars", props.calendarId);


    /* map attributes
    -------------------------------------------------------- */
    let map;
    let marker;


    /* new event attributes
    -------------------------------------------------------- */
    let eventName = $state("");
    let location = $state("");
    let startDate = $state("");     // yyyy-mm-ddThh:mm or yyyy-mm-dd
    let endDate = $state("");
    let allDay = $state(false);
    let guests = $state([]);


    /* sync members to invite and map creation
    -------------------------------------------------------- */
    onMount(async () => {

        /* continuous updating of possible members to invite
        -------------------------------------------------------- */
        unsub = onSnapshot(
            docRef,
            (doc) => { members = doc.data().members },
            (error) => {console.log("addEvent : ", error)}
        );
        addUnsub(unsub);

        /* map creation
        -------------------------------------------------------- */
        let L = await import("leaflet");
        await import ("leaflet/dist/leaflet.css");

        map = L.map("map")                          // instantiates a map object given the DOM ID of a <div> element
            .setView([43.720751, 10.408109], 17);   // sets the view of the map (geographical center and zoom). Returns "this"

        L.tileLayer(                                                // used to load and display tile layers on the map
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
            { attribution: '© OpenStreetMap contributors' }
        ).addTo(map);

        map.on("click", changeViewOnClick); // map click handler registration
    });

    onDestroy(() => {
        if(unsub) {
            unsub();
        }
    })


    /* function to add a marker after a click
    -------------------------------------------------------- */
    function changeViewOnClick(e) {
        changeView(e.latlng.lat, e.latlng.lng)
    }


    /* function to add a marker after a click and center the view
    -------------------------------------------------------- */
    function changeView(lat, lng) {
        if (marker) {
            marker.remove();                        // removing the old marker
        }
        map.panTo([lat, lng]);                     // pans the map to a given center. Returns this
        marker = L.marker([lat, lng]).addTo(map);  // adding a new marker
    }


    /* function to obtain the coordinates of the place entered by the user
    -------------------------------------------------------- */
    async function getCoordinates() {
        await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&q=" + location)  // HTTP request to Nominatim
            .then( (response) => response.json() )
            .then ( (data) => {
                if (data.length > 0) {                                                      // the answer is an array of objects
                    const lat = data[0].lat;
                    const lng = data[0].lon;
                    changeView(lat, lng);
                }
                else {
                    alert("Questo luogo non esiste. Riprova!");
                }
            });
    }


    /* function to add event to db
    -------------------------------------------------------- */
    async function addEvent() {
        const startDateObj = new Date(startDate);   // platform-independent format
        const endDateObj = new Date(endDate);

        if (startDateObj > endDateObj) {
            alert("La data di inizio deve essere minore di quella di fine");
            return;
        }

        const differenceInMinutes = (endDateObj - startDateObj) / (1000 * 60);
        if ((differenceInMinutes) < 60) {
            alert("La durata minima di un evento è di 60 minuti");              // otherwise the event text becomes unreadable
            return;
        }

        const owner = members.find(
            (value, index, array) => { return value.email === auth.currentUser.email }
        );

        let newEvent = {
            id: crypto.randomUUID(),
            owner: owner,
            title: eventName,
            start: startDate,
            allDay: allDay,
            end: endDate,
            location: location.length == 0? "Nome del luogo assente...":location,
            lat: marker? marker.getLatLng().lat:"",
            lng: marker? marker.getLatLng().lng:"",
            guests: guests,
            backgroundColor: owner.color,
            textColor: "#000000"
        };

        await updateDoc(
            docRef,
            { events: arrayUnion(newEvent) }
        )

        props.setMenuState(0);
    }


    /* function to add invited members
    -------------------------------------------------------- */
    function addGuests(member) {
        if (guests.includes(member)) {
            guests = guests.filter(g => g !== member);      // remove the guest
        }

        else {
            guests.push(member);    // add the guest
        }
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<div class="overflow-div">
    <p>Nuovo evento:</p>
    
    <form id="new-event-form" onsubmit={ () => addEvent() }>
        <div class="menu-centered-box">
            <input class="menu-input" type="text" bind:value={eventName} placeholder="Nome evento" required><br>
            
            <input class="menu-input" type="text" bind:value={location} placeholder="Luogo"><br>
            <div id="map"></div>
            <button class="menu-button" type="button" onclick={() => getCoordinates()}>Cerca luogo</button>

            <div class="text-and-button-in-row">
                <p>Tutto il giorno:</p>
                <input class="menu-checkbox" type="checkbox" bind:checked={allDay}>
            </div>
            
            {#if !allDay}
                <p class="left-paragraph">Inizia:</p>
                <input class="menu-input" type="datetime-local" bind:value={startDate} required><br>
                
                <p class="left-paragraph">Finisce:</p>
                <input class="menu-input" type="datetime-local" bind:value={endDate} required><br>
            {:else}
                <p class="left-paragraph">Inizia:</p>
                <input class="menu-input" type="date" bind:value={startDate} required><br>
                
                <p class="left-paragraph">Finisce:</p>
                <input class="menu-input" type="date" bind:value={endDate} required><br>
            {/if}
        </div>

        <div>
            <p class="left-paragraph">Membri invitati:</p>
            <ul>
                {#each members as member}
                    {#if member.email !== auth.currentUser.email}
                        <li>
                            <div class="text-and-button-in-row">
                                <p>{member.email}</p>
                                <input class="menu-checkbox" type="checkbox" onclick={ () => addGuests(member)}>
                            </div>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>

    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="new-event-form">Salva</button>
    <button class="menu-red-button" onclick={ () => {props.setMenuState(0)} }>Annulla</button>
</div>