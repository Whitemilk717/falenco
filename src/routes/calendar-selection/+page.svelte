<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { getRandomColor } from "$lib/getRandomColor";
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

        const calendarData = queryResult.docs[0].data();    // calendar names are unique, so it returns at most one result

        const isAlreadyMember = calendarData.members.find(                      // is the user new? (undefined if yes)
            (value, index, array) => value.email === auth.currentUser.email
        )

        if (isAlreadyMember === undefined) {
            if (calendarData.membersNumber === calendarData.members.length) {
                alert("Il calendario ha raggiunto il massimo numero di membri");
                calendarName = "";
                return;
            }

            await updateDoc(queryResult.docs[0].ref, {  // if new, the user is added only if the maximum number of members allows it
                members: arrayUnion(
                    {
                        email: auth.currentUser.email,  // email of the new user
                        color: getRandomColor()         // color of the new user
                    }
                )
            });
        }

        goto(`/calendar/${queryResult.docs[0].id}`);
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => checkCalendar() }>
    <h1 class="main-title">FaLenCo</h1>

    <p class="center-paragraph">
        Benvenuto! 
        <br>
        Quale calendario vuoi visualizzare?
    </p>
    
    <input class="main-input" bind:value={calendarName} type="text" placeholder="Nome calendario" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => disconnect() }>Esci</button>
        <button type="submit" class="small-green-button">Conferma</button>
    </div>

    <p class="small-text">Prima volta? <a class="link" href="/calendar-creation">Crea un calendario</a></p>
</form>