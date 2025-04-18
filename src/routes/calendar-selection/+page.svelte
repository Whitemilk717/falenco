<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

    let calendarName;

    async function checkCalendar() {
        const insertedDoc = doc(db, "calendars", calendarName);
        const storedDoc = await getDoc(insertedDoc);

        if (!storedDoc.exists()) {
            alert("Questo calendario non esiste, riprova!");
            return;
        }

        const calendarData = storedDoc.data();
        
        if (!calendarData.members.includes(auth.currentUser.email)) {
            if (calendarData.membersNumber === calendarData.members.length) {
                alert("Il calendario ha raggiunto il massimo numero di membri");
                return;
            }
        }

        await updateDoc(insertedDoc,{ 
            members: arrayUnion(auth.currentUser.email)
        });

        goto(`/calendar/${calendarName}`);
    }

    function disconnect() {
        signOut(auth)
            .then(() => {
                goto("/");
            })
            .catch((error) => {
                console.log(error);
            })
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


<!-- CSS section 
------------------------------------------------------------ -->
<style>
    .welcome-text {
        font-size: calc(0.8vw + 0.8vh);
        text-align: center;
    }
</style>