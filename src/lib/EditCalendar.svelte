<!-- script section 
------------------------------------------------------------ -->
<script>
    import { db } from "$lib/firebase.js";
    import { doc, getDoc, updateDoc } from "firebase/firestore";

    const props = $props();
    let newCalendarName = $state("");
    let newMaxMembersNumber = $state("");

    async function editCalendar() {
        const oldDocRef = doc(db, "calendars", props.calendarId);
        const oldDoc = await getDoc(oldDocRef);
        const oldData = oldDoc.data();

        // is newMaxMembersNumber admissible?
        if (oldData.members.length > newMaxMembersNumber) {
            alert(`Questo calendario ha un numero attuale di membri maggiore (${oldData.members.length}). Riprova!`);
            newCalendarName = "";
            newMaxMembersNumber = "";
            return;
        }

        // renaming the calendar
        await updateDoc(
            oldDocRef,
            { 
                name: newCalendarName,
                maxMembersNumber: newMaxMembersNumber
            }
        );

        props.setCalendarState(0);
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="menu-div">
    <p>Modifica calendario:<p>
    <form class="menu-input-box" id="edit-calendar-form" onsubmit={() => editCalendar()}>
        <input class="menu-input" type="text" bind:value={newCalendarName} placeholder="Nuovo nome" required><br>
        <input class="menu-input" type="number" bind:value={newMaxMembersNumber} placeholder="Nuovo numero membri" required>
    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="edit-calendar-form">Salva</button>
    <button class="menu-red-button" onclick={ () => props.setCalendarState(0) }>Annulla</button>
</div>