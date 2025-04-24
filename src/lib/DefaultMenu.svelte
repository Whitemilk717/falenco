<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db, disconnect } from "$lib/firebase.js";
    import { doc, getDoc, onSnapshot } from "firebase/firestore";

    const props = $props();
    let members = $state("");

    const unsub = onSnapshot(
        doc(db, "calendars", props.calendarId),
        (doc) => { members = doc.data().members }
    );
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="menu-div">
    <p>Membri:</p>
    <ul>
        {#each members as member}
            <li>{member}</li>
        {/each}
    </ul>
</div>

<div class="menu-buttons-box">
    <button class="menu-button" onclick={ () => goto("/calendar-selection") }>Cambia calendario</button>
    <button class="menu-button" onclick= { () => props.setCalendarState(3) }>Modifica passsword</button>
    <button class="menu-button" onclick= { () => props.setCalendarState(4) }>Modifica calendario</button>
    <button class="menu-red-button" onclick={ () => disconnect() }>Esci</button>
</div>