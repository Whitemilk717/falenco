<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onAuthStateChanged } from "firebase/auth";
    import { auth, db, addUnsub } from "$lib/firebase.js";
    import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
    
    const props = $props();
    let members = $state("");                               // users who can be invited to the event
    let modifiedEvent = $state({});                         // variable containing the clicked event data
    let eventToDelete = $state({});                         // variable containing the unchanged data
    const docRef = doc(db, "calendars", props.calendarId);  // reference to the current calendar
    
    
    /* function to get event data from db
    -------------------------------------------------------- */
    async function getEventData() {
        const docData = (await getDoc(docRef)).data();                                          // await cannot be used except inside async functions
        modifiedEvent = docData.events.find((event) => event.id === props.eventInfos.event.id); // get clicked event data
    }
    getEventData();
    
    
    /* continuous updating of possible members to invite
    -------------------------------------------------------- */
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const unsub = onSnapshot(
                docRef,
                (doc) => { members = doc.data().members }
            );
            addUnsub(unsub);
        }
    })



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
    <button class="menu-red-button" onclick={ () => props.setMenuState(0) }>Annulla</button>
</div>