<!-- script section 
------------------------------------------------------------ -->
<script>
    import { db } from "$lib/firebase";
    import { doc, getDoc } from "firebase/firestore";
    import { onMount } from "svelte";

    const props = $props();

    async function getMembers () {
        const docRef = doc(db, "calendars", props.calendarName);
        const storedDoc = await getDoc(docRef);
        const calendarData = storedDoc.data();
        return calendarData.members;
    };
</script>


<!-- HTML section 
------------------------------------------------------------ -->
{#await getMembers() then members}
    <ul>
        {#each members as member}
            <li>{member}</li>
        {/each}
    </ul>
{/await}