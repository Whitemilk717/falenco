<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { doc, setDoc, getDoc } from "firebase/firestore";

    let calendarName;
    let calendarMembers;

    async function createCalendar() {
        const insertedDoc = doc(db, "calendars", calendarName);
        const storedDoc = await getDoc(insertedDoc);

        if (storedDoc.exists()) {
            alert("Questo nome è già in uso, riprova!");
            return;
        }

        await setDoc(insertedDoc,{ 
            membersNumber: calendarMembers,
            members: [auth.currentUser.email]
        });

        alert("Calendario creato con successo!");
        goto("/calendar-selection")
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => createCalendar() }>
    <h1 class="main-title">FaLenCo</h1>
    
    <input class="main-input" bind:value={calendarName} type="text" placeholder="Nome calendario" required><br>
    <input class="main-input" bind:value={calendarMembers} type="number" placeholder="Numero membri" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => goto("calendar-selection") }>Annulla</button>
        <button type="submit" class="small-green-button">Crea</button>
    </div>
</form>