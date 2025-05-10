<!-- script section 
------------------------------------------------------------ -->
<script>
    import { addUnsub, db } from "$lib/firebase.js";
    import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
    import { onDestroy, onMount } from "svelte";

    let unsub;
    const props = $props();
    let items = $state([]);
    let newItem = $state("");
    const docRef = doc(db, "calendars", props.calendarId);


    /* continuous updating of the shopping list
    -------------------------------------------------------- */
    onMount(() => {
        unsub = onSnapshot(
            docRef,
            (doc) => { items = doc.data().shoppingList },
            (error) => {console.log("Shopping list : ", error)}
        );
        addUnsub(unsub);
    });


    /* onDestroy function
    -------------------------------------------------------- */
    onDestroy(() => {
        if(unsub) {
            unsub();
        }
    })


    /* function to add an item to the shopping list
    -------------------------------------------------------- */
    async function addItem() {
        await updateDoc(
            docRef,
            { shoppingList: arrayUnion(newItem) }   // added to shoppingList 
        );
        newItem = "";
    }


    /* function to remove an item to the shopping list
    -------------------------------------------------------- */
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

    <form class="menu-centered-box" id="add-item-form" onsubmit={() => addItem()}>
        <input class="menu-input" type="text" bind:value={newItem} placeholder="Nuovo prodotto" required><br>
    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="add-item-form">Aggiungi prodotto</button>
    <button class="menu-red-button" onclick={ () => {props.setMenuState(0)} }>Esci</button>
</div>