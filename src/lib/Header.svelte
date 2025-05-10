<!-- script section 
------------------------------------------------------------ -->
<script>
    import { addUnsub, auth, db } from "$lib/firebase.js";
    import { doc, onSnapshot } from "firebase/firestore";
    import { onDestroy, onMount } from "svelte";

    let unsub;
    const props = $props();
    let calendarName = $state("");


    /* getting the calendar name
    -------------------------------------------------------- */
    onMount(() => {
        unsub = onSnapshot(
            doc(db, "calendars", props.calendarId),
            (doc) => { calendarName = doc.data().name },
            (error) => {console.log("Header : ", error)}
        );
        addUnsub(unsub);
    })


    /* onDestroy function
    -------------------------------------------------------- */
    onDestroy(() => {
        if(unsub) {
            unsub();
        }
    })
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<div class="header-box">
    <h1>FaLenCo</h1>

    <h1>{calendarName}</h1>

    <div>
        <button class="header-button" onclick={ () => props.setMenuState(1) }>
            <img src="/icons/shopping-cart.png" alt="shopping cart icon">
        </button>

        <button class="header-button" onclick={ () => props.setMenuState(2) }>
            <img src="/icons/plus.png" alt="shopping cart icon">
        </button>
    </div>
</div>