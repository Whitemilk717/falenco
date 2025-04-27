<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import Header from "$lib/Header.svelte";
    import AddEvent from "$lib/AddEvent.svelte";
    import { FirebaseError } from "firebase/app";
    import ShowEvent from "$lib/ShowEvent.svelte";
    import DefaultMenu from "$lib/DefaultMenu.svelte";
    import { onAuthStateChanged } from "firebase/auth";
    import ShoppingList from "$lib/ShoppingList.svelte";
    import EditCalendar from "$lib/EditCalendar.svelte";
    import { doc, onSnapshot } from "firebase/firestore";
    import { db, addUnsub, auth } from "$lib/firebase.js";
    import ChangePassword from "$lib/ChangePassword.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/svelte";

    let menuState = $state(0);                          // determines what the menu shows
    let eventInfos = $state("");
    let notificationsAllowed = false;                   // guard for sending notifications
    let timeoutIds = [];                             // array containing the timeout ids for notifications
    const calendarId = page.params.calendarId;
    const docRef = doc(db, "calendars", calendarId);


    /* request to be able to send notifications
    -------------------------------------------------------- */
    onMount(() => {
        if (!("Notification" in window)) {
            alert("Questo browser non supporta le notifiche!")
        } else {
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === "granted") {
                        notificationsAllowed = true;
                    }
                })
        }
    })


    /* calendar options and component instance
    -------------------------------------------------------- */
    let calendar = $state();
    let options = $state({
        view: "timeGridWeek",
        events: [],
        eventClick: (info) => {
            eventInfos = info;
            setMenuState(5);        // 5: show event
        }
    });


    /* FireStore event synchronization, notification preparation
    -------------------------------------------------------- */
    /* NOTE:
     * by removing and adding each event I capture new events, changes and eliminations
     */
     onAuthStateChanged(auth, (user) => {
        if (user) {
            const unsub = onSnapshot(
                docRef,
                (doc) => {
                    calendar.getEvents().forEach(event => {
                        calendar.removeEventById(event.id);
                    })

                    timeoutIds.forEach(id => clearTimeout(id)); // removing timeouts
                    timeoutIds = [];

                    doc.data().events.forEach(event => {    
                        calendar.addEvent(event);           // adding event to calendar

                        const eventTime = new Date(event.start).getTime();                  // eventTime in milliseconds
                        const currentTime = new Date().getTime();                           // currentTime in milliseconds
                        const timeUntilEvent = (eventTime - currentTime) - (60*60*1000);    // 1h = 60m * 60s * 1000ms.

                        
                        if ( (timeUntilEvent > 0) && notificationsAllowed ) {
                            timeoutIds.push(setTimeout(() => { 
                                const notification = new Notification(
                                    "FaLenCo",
                                    {
                                        lang: "it",
                                        body: `L'evento ${event.title} inizierà tra un'ora!`,
                                        icon: "/icons/icon-32x32.png"
                                    }
                                )}, timeUntilEvent
                            ));
                        }

                    });

                },
            );
            addUnsub(unsub);
        }
    })


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
            

        <!-- 5: show event
        ---------------------------------------------------- -->
        {:else if menuState === 5}
            <ShowEvent
                calendarId={calendarId}
                setMenuState={setMenuState}
                eventInfos={eventInfos}
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