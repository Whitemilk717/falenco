<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db, addUnsub, disconnect } from "$lib/firebase.js";
    import { doc, getDoc, onSnapshot } from "firebase/firestore";
    import { onDestroy, onMount } from "svelte";

    let unsub;
    const props = $props();
    let members = $state("");


    // synchronization of members to invite
    onMount(() => {
        unsub = onSnapshot(
            doc(db, "calendars", props.calendarId),
            (doc) => { members = doc.data().members },
            (error) => {console.log("Default menu : ", error)}
        );
        addUnsub(unsub)
    })


    onDestroy(() => {
        if(unsub) {
            unsub();
        }
    })
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<div class="menu-div">
    <p>Membri:</p>
    <ul>
        {#each members as member}
            <li style="color:{member.color};">{member.email}</li>
        {/each}
    </ul>
</div>

<div class="menu-buttons-box">
    <button class="menu-button" onclick={ () => goto("/calendar-selection") }>Cambia calendario</button>
    <button class="menu-button" onclick= { () => props.setMenuState(3) }>Modifica password</button>
    <button class="menu-button" onclick= { () => props.setMenuState(4) }>Modifica calendario</button>
    <button class="menu-red-button" onclick={ () => {disconnect()} }>Esci</button>
</div>