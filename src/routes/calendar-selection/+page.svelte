<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db, disconnect } from "$lib/firebase.js";
    import { updateDoc, arrayUnion, query, where, collection, getDocs } from "firebase/firestore";

    let calendarName;

    async function checkCalendar() {

        const q = query(
            collection(db, "calendars"),
            where("name", "==", calendarName)
        );
        const queryResult = await getDocs(q);

        if (queryResult.empty) {
            alert("Questo calendario non esiste, riprova!");
            return;
        }

        const calendarData = queryResult.docs[0].data();    // calendar names are unique

        if (!calendarData.members.includes(auth.currentUser.email)) {
            if (calendarData.membersNumber === calendarData.members.length) {
                alert("Il calendario ha raggiunto il massimo numero di membri");
                calendarName = "";
                return;
            }
        }

        await updateDoc(queryResult.docs[0].ref, { 
            members: arrayUnion(auth.currentUser.email)     // added to user members
        });

        goto(`/calendar/${queryResult.docs[0].id}`);
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => checkCalendar() }>
    <h1 class="main-title">FaLenCo</h1>

    <p class="welcome-text">
        Benvenuto! 
        <br>
        Quale calendario vuoi visualizzare?
    </p>
    
    <input class="main-input" bind:value={calendarName} type="text" placeholder="Nome calendario" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => disconnect() }>Esci</button>
        <button type="submit" class="small-green-button">Conferma</button>
    </div>

    <p class="first-time">Prima volta? <a class="link" href="/calendar-creation">Crea un calendario</a></p>
</form>