<!-- script section 
------------------------------------------------------------ -->
<script>
    import { auth, db, addUnsub } from "$lib/firebase.js";
    import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";

    const props = $props();
    let members = $state("");                                // users who can be invited to the event
    const docRef = doc(db, "calendars", props.calendarId);


    /* continuous updating of possible members to invite
    -------------------------------------------------------- */
    const unsub = onSnapshot(
        docRef,
        (doc) => { members = doc.data().members }
    );
    addUnsub(unsub);


    /* new event attributes
    -------------------------------------------------------- */
    let eventName = $state("");
    let location = $state("");
    let startDate = $state("");     // yyyy-mm-ddThh:mm or yyyy-mm-dd
    let endDate = $state("");
    let allDay = $state(false);
    let guests = $state([]);


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
            location: location.length == 0? "Luogo assente...":location,
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
    <button class="menu-red-button" onclick={ () => props.setMenuState(0) }>Annulla</button>
</div>