<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

    let calendarName;
    let maxMembersNumber;

    async function createCalendar() {

        const q = query(
            collection(db, "calendars"),
            where("name", "==", calendarName)
        );
        const queryResult = await getDocs(q);

        if (!queryResult.empty) {
            alert("Questo nome è già in uso, riprova!");
            calendarName = "";
            maxMembersNumber = "";
            return;
        }

        await addDoc(
            collection(db, "calendars"),
            { 
                name: calendarName, 
                maxMembersNumber: maxMembersNumber, 
                members: [auth.currentUser.email],
                shoppingList: [],
                events: []
            }
        );

        alert("Calendario creato con successo!");
        goto("/calendar-selection")
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => createCalendar() }>
    <h1 class="main-title">FaLenCo</h1>
    
    <input class="main-input" bind:value={calendarName} type="text" placeholder="Nome calendario" required><br>
    <input class="main-input" bind:value={maxMembersNumber} type="number" placeholder="Numero membri massimo" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => goto("calendar-selection") }>Annulla</button>
        <button type="submit" class="small-green-button">Crea</button>
    </div>
</form>