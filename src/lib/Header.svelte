<!-- script section 
------------------------------------------------------------ -->
<script>
    import { auth, db, addUnsub } from "$lib/firebase.js";
    import { doc, onSnapshot } from "firebase/firestore";

    const props = $props();
    let calendarName = $state("");

    const unsub = onSnapshot(
        doc(db, "calendars", props.calendarId),
        (doc) => { calendarName = doc.data().name }
    );

    addUnsub(unsub);
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