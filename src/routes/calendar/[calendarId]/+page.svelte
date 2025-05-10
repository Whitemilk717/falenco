<!-- script section 
------------------------------------------------------------ -->
<script>
    import { onDestroy, onMount } from "svelte";
    import { page } from "$app/state";
    import Header from "$lib/Header.svelte";
    import AddEvent from "$lib/AddEvent.svelte";
    import { FirebaseError } from "firebase/app";
    import ShowEvent from "$lib/ShowEvent.svelte";
    import DefaultMenu from "$lib/DefaultMenu.svelte";
    import ShoppingList from "$lib/ShoppingList.svelte";
    import EditCalendar from "$lib/EditCalendar.svelte";
    import { doc, onSnapshot } from "firebase/firestore";
    import { db, auth, addUnsub } from "$lib/firebase.js";
    import ChangePassword from "$lib/ChangePassword.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/svelte";

    let unsub;
    let menuState = $state(0);                          // determines what the menu shows
    let eventInfos = $state("");
    let notificationsAllowed = false;                   // guard for sending notifications
    let timeoutIds = [];                                // array containing the timeout ids for notifications
    const calendarId = page.params.calendarId;
    const docRef = doc(db, "calendars", calendarId);
    

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


    /* onMount routine: notifications and event synchronization
    -------------------------------------------------------- */
    onMount(() => {

        /* request to be able to send notifications
        ---------------------------------------------------- */
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

        /* FireStore event synchronization, notification preparation
        ---------------------------------------------------- */
        /* NOTES:
         * by removing and adding each event I capture new events, changes and eliminations
         */
        unsub = onSnapshot(
            docRef,
            (doc) => {
                calendar.getEvents().forEach(event => {
                    calendar.removeEventById(event.id); // removal of any event from the calendar
                });

                timeoutIds.forEach(id => clearTimeout(id)); // removal of every timeout
                timeoutIds = [];

                doc.data().events.forEach(event => {    
                    calendar.addEvent(event);           // adding every event to the calendar

                    const eventTime = new Date(event.start).getTime();                  // eventTime in milliseconds
                    const currentTime = new Date().getTime();                           // currentTime in milliseconds
                    const timeUntilEvent = (eventTime - currentTime) - (60*60*1000);    // 1h = 60m * 60s * 1000ms.

                    /* a notification is sent only:
                        * - to the event owner
                        * - to each invited member
                        * - when the time remaining to the event is 1h
                        * - if notifications have been allowed
                        */
                    if ( (auth.currentUser.email === event.owner.email) || (event.guests.some((guest) => guest.email === auth.currentUser.email) ) ) {
                        if ( (timeUntilEvent > 0) && notificationsAllowed ) {
                            timeoutIds.push(setTimeout(() => { 
                                const notification = new Notification(
                                    "FaLenCo",
                                    {
                                        lang: "it",
                                        body: `Hey ${auth.currentUser.email}, l'evento ${event.title} inizierà tra un'ora!`,
                                        icon: "/icons/icon-32x32.png"
                                    }
                                )}, timeUntilEvent
                            ));
                        }
                    }

                });
            },
            (error) => {console.log("Calendar : ", error)}
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