<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db, addUnsub } from "$lib/firebase.js"
    import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

    const props = $props();
    let events = $state("");
    let members = $state("");

    const docRef = doc(db, "calendars", props.calendarId);

    /* continuous updating of members to invite
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
    let startDate = $state("");     // yyyy-mm-ddThh:mm (the T does not change)
    let endDate = $state("");
    let allDay = $state(false);
    let guests = $state([]);

    /* function to add event to db
    -------------------------------------------------------- */
    async function addEvent() {
        let newEvent = {
            id: crypto.randomUUID(),
            owner: auth.currentUser.email,
            title: eventName,
            start: startDate,
            end: endDate,
            allDay: allDay,
            location: location,
            guests: guests
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
        <div class="menu-input-box">
            <input class="menu-input" type="text" bind:value={eventName} placeholder="Nome evento" required><br>
            <input class="menu-input" type="text" bind:value={location} placeholder="Luogo"><br>

            <div class="text-and-button-in-row">
                <p>Tutto il giorno:</p>
                <input class="menu-checkbox" type="checkbox" bind:checked={allDay}>
            </div>
            
            {#if !allDay}
                <p class="left-paragraph-in-add-event">Inizia:</p>
                <input class="menu-input" type="datetime-local" bind:value={startDate} required><br>
                
                <p class="left-paragraph-in-add-event">Finisce:</p>
                <input class="menu-input" type="datetime-local" bind:value={endDate} required><br>
            {:else}
                <p class="left-paragraph-in-add-event">Data:</p>
                <input class="menu-input" type="date" bind:value={startDate} required><br>
            {/if}
        </div>

        <div>
            <p class="left-paragraph-in-add-event">Membri invitati:</p>
            <ul>
                {#each members as member}
                    {#if member !== auth.currentUser.email}
                        {console.log(auth.currentUser.email)}
                        <li>
                            <div class="text-and-button-in-row">
                                <p>{member}</p>
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