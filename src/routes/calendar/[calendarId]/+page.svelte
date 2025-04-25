<!-- script section 
------------------------------------------------------------ -->
<script>
    import { page } from "$app/state";
    import { db, addUnsub } from "$lib/firebase.js"
    import { goto } from "$app/navigation";
    import Header from "$lib/Header.svelte";
    import AddEvent from "$lib/AddEvent.svelte";
    import DefaultMenu from "$lib/DefaultMenu.svelte";
    import ShoppingList from "$lib/ShoppingList.svelte";
    import EditCalendar from "$lib/EditCalendar.svelte";
    import ChangePassword from "$lib/ChangePassword.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/core";
    import { doc, onSnapshot } from "firebase/firestore";


    let menuState = $state(0);                      // determines what the menu shows
    let events = $state("");
    let calendarId = $state(page.params.calendarId);
    const docRef = doc(db, "calendars", calendarId);

    /* calendar options and component instance
    -------------------------------------------------------- */
    let calendar = $state();
    let options = $state({
        view: "timeGridWeek",
        events: []
    });

    /* firestore event synchronization
    -------------------------------------------------------- */
    const unsub = onSnapshot(
        docRef,
        (doc) => {
            options.events = doc.data().events;
        }
    );
    addUnsub(unsub);

    /* function to change menuState
    -------------------------------------------------------- */
    function setMenuState(newState) {
        menuState = newState;
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid">

    <!-- header
    -------------------------------------------------------- -->
    <Header 
        calendarId={calendarId} 
        setMenuState={setMenuState}
    />

    <!-- menu 
    -------------------------------------------------------- -->
    <div class="menu-box">

        <!-- 0: default 
        ---------------------------------------------------- -->
        {#if menuState === 0}
            <DefaultMenu 
                setMenuState={setMenuState} 
                calendarId={calendarId}
            />
        
        <!-- 1: shopping list
        ---------------------------------------------------- -->
        {:else if menuState === 1}
            <ShoppingList
                setMenuState={setMenuState}
                calendarId={calendarId}
            />
        
        <!-- 2: add event
        ---------------------------------------------------- -->
        {:else if menuState === 2}
            <AddEvent
                setMenuState={setMenuState}
                calendarId={calendarId}
            />
            

        <!-- 3: change password
        ---------------------------------------------------- -->
        {:else if menuState === 3}
            <ChangePassword 
                setMenuState={setMenuState} 
            />


        <!-- 4: edit calendar
        ---------------------------------------------------- -->
        {:else if menuState === 4}
            <EditCalendar 
                calendarId={calendarId}
                setMenuState={setMenuState}
            />

        {/if}
    </div>
    
    <!-- calendar
    -------------------------------------------------------- -->
    <div class="calendar-box">
        <Calendar 
            bind:this={calendar}
            plugins={[TimeGrid]}
            options={options} 
        /> 
    </div>
</div>