<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onDestroy, onMount } from "svelte";
    import { addUnsub, auth, db } from "$lib/firebase.js";
    import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
    
    let unsub;
    let newEvent;
    const props = $props();
    let members = $state("");                               // users who can be invited to the event
    let modifiedEvent = $state({});                         // variable containing the clicked event data
    let eventToDelete = $state({});                         // variable containing the unchanged data
    const docRef = doc(db, "calendars", props.calendarId);  // reference to the current calendar
    

    /* map attributes
    -------------------------------------------------------- */
    let map;
    let marker;
    let firstLoad = true;   // flag to indicate that the map view should not be changed the first time
    

    /* map creation and event recovery
    -------------------------------------------------------- */
    onMount(async () => {
        unsub = onSnapshot(
            docRef,
            (doc) => {
                const docData = doc.data();
                newEvent = docData.events.find(
                    (event) => event.id === props.eventInfos.event.id   // get clicked event data
                )

                if (newEvent) {                                                 // change the data displayed only if the event has not been deleted
                    modifiedEvent = newEvent;
                    if (firstLoad) {
                        firstLoad = !firstLoad;                                 // on first load, map creation automatically changes the view
                    }
                    else {
                        changeView(modifiedEvent.lat, modifiedEvent.lng);
                    }
                }
                else {
                    if (auth.currentUser.email != modifiedEvent.owner.email) {
                        alert("L'evento è stato cancellato dal suo proprietario");
                        props.setMenuState(0);
                    }
                }

                /* continuous updating of possible members to invite
                -------------------------------------------------------- */
                members = doc.data().members
            },
            (error) => {console.log("Show event : ", error)}
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

        if(modifiedEvent.lat.length != 0) {
            changeView(modifiedEvent.lat, modifiedEvent.lng);
        }
    });


    onDestroy(() => {
        if(unsub) {
            unsub();
        }
    })


    /* function to add a marker after a click
    -------------------------------------------------------- */
    function changeViewOnClick(e) {
        changeView(e.latlng.lat, e.latlng.lng);
    }


    /* function to add a marker after a click and center the view
    -------------------------------------------------------- */
    function changeView(lat, lng) {
        if (marker) {
            marker.remove();                        // removing the old marker
        }
        map.panTo([lat, lng]);                     // pans the map to a given center. Returns this
        marker = L.marker([lat, lng]).addTo(map);  // adding a new marker

        modifiedEvent.lat = lat;
        modifiedEvent.lng = lng;
    }


    /* function to obtain the coordinates of the place entered by the user
    -------------------------------------------------------- */
    async function getCoordinates() {
        await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&q=" + modifiedEvent.location)  // HTTP request to Nominatim
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


    /* function to update event in db
    -------------------------------------------------------- */
    async function updateEvent() {
        const startDateObj = new Date(modifiedEvent.start); // platform-independent format
        const endDateObj = new Date(modifiedEvent.end);

        if (auth.currentUser.email != modifiedEvent.owner.email) {
            alert("L'evento appartiene a " + modifiedEvent.owner.email + ", non puoi apportare modifiche!");
            return;
        }

        if (startDateObj > endDateObj) {
            alert("La data di inizio deve essere minore di quella di fine");
            return;
        }

        const differenceInMinutes = (endDateObj - startDateObj) / (1000 * 60);
        if ((differenceInMinutes) < 60) {
            alert("La durata minima di un evento è di 60 minuti");              // otherwise the event text becomes unreadable
            return;
        }

        const docData = (await getDoc(docRef)).data();
        const updatedEvents = docData.events.map(event => { 
            if (event.id === modifiedEvent.id) {
                return modifiedEvent;                       // replacement with the modified event
            }
            return event;                                   // maintenance of the original
        })

        await updateDoc(
            docRef,
            { events: updatedEvents }
        )

        props.setMenuState(0);
    }


    /* function to add invited members
    -------------------------------------------------------- */
    function addGuests(member) {
        if (modifiedEvent.guests.some(guest => guest.email === member.email)) {
            modifiedEvent.guests = modifiedEvent.guests.filter(g => g.email !== member.email);  // remove the guest
        }

        else {
            modifiedEvent.guests.push(member);    // add the guest
        }
    }


    /* function to delete an event from the db
    -------------------------------------------------------- */
    async function deleteEvent() {
        if (auth.currentUser.email != modifiedEvent.owner.email) {
            alert("L'evento appartiene a " + modifiedEvent.owner.email + ", non puoi cancellarlo!");
            return;
        }

        const docData = (await getDoc(docRef)).data();
        const updatedEvents = docData.events.filter(
            event => event.id !== modifiedEvent.id      // removal of the event
        );

        await updateDoc(
            docRef,
            { events: updatedEvents }
        )

        props.setMenuState(0);
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<div class="overflow-div">
    <p>Modifica evento:</p>

    <form id="update-event-form" onsubmit={ () => updateEvent() }>
        <div class="menu-centered-box">
            <input class="menu-input" type="text" bind:value={modifiedEvent.title} placeholder="Nome evento" required><br>

            <input class="menu-input" type="text" bind:value={modifiedEvent.location} placeholder="Luogo"><br>
            <div id="map"></div>
            <button class="menu-button" type="button" onclick={() => getCoordinates()}>Cerca luogo</button>

            <div class="text-and-button-in-row">
                <p>Tutto il giorno:</p>
                <input class="menu-checkbox" type="checkbox" bind:checked={modifiedEvent.allDay}>
            </div>
            
            {#if !modifiedEvent.allDay}
                <p class="left-paragraph">Inizia:</p>
                <input class="menu-input" type="datetime-local" bind:value={modifiedEvent.start} required><br>
                
                <p class="left-paragraph">Finisce:</p>
                <input class="menu-input" type="datetime-local" bind:value={modifiedEvent.end} required><br>
            {:else}
                <p class="left-paragraph">Inizia:</p>
                <input class="menu-input" type="date" bind:value={modifiedEvent.start} required><br>
                
                <p class="left-paragraph">Finisce:</p>
                <input class="menu-input" type="date" bind:value={modifiedEvent.end} required><br>
            {/if}
        </div>

        <div>
            <p class="left-paragraph">Membri invitati:</p>
            <ul>
                {#each members as member}
                    {#if member.email !== modifiedEvent.owner.email}
                        <li>
                            <div class="text-and-button-in-row">
                                <p>{member.email}</p>
                                <input 
                                    class="menu-checkbox" 
                                    type="checkbox" 
                                    checked={modifiedEvent.guests.some(guest => guest.email === member.email)} 
                                    onclick={ () => addGuests(member)}
                                >
                            </div>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="update-event-form">Salva</button>
    <button class="menu-red-button" onclick={ () => deleteEvent() }>Elimina</button>
    <button class="menu-red-button" onclick={ () => {props.setMenuState(0)} }>Annulla</button>
</div>