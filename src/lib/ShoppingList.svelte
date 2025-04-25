<!-- script section 
------------------------------------------------------------ -->
<script>
    import { db, addUnsub } from "$lib/firebase.js";
    import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

    const props = $props();
    let items = $state("");
    let newItem = $state("");
    const docRef = doc(db, "calendars", props.calendarId);

    const unsub = onSnapshot(
        docRef,
        (doc) => { items = doc.data().shoppingList }
    );

    addUnsub(unsub);

    async function addItem() {
        await updateDoc(
            docRef,
            { shoppingList: arrayUnion(newItem) }   // added to shoppingList 
        );

        newItem = "";
    }

    async function removeItem(itemToRemove) {
        await updateDoc(
            docRef,
            { shoppingList: arrayRemove(itemToRemove) }
        );
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="overflow-div">
    <p>Lista della spesa:<p>
    <ul>
        {#each items as item}
            <li>
                <div class="text-and-button-in-row">
                    <p>{item}</p>

                    <button class="shopping-item-button" onclick={ () => removeItem(item) }>
                        <img src="/icons/cross.png" alt="cross icon">
                    </button>
                </div>
            </li>
        {/each}
    </ul>

    <form class="menu-input-box" id="add-item-form" onsubmit={() => addItem()}>
        <input class="menu-input" type="text" bind:value={newItem} placeholder="Nuovo prodotto" required><br>
    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="add-item-form">Aggiungi prodotto</button>
    <button class="menu-red-button" onclick={ () => props.setMenuState(0) }>Esci</button>
</div>