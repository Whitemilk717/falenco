import { goto } from "$app/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "$lib/firebase";

function disconnect() {
    signOut(auth)
        .then(() => {
            goto("/");
        })
        .catch((error) => {
            console.log(error);
        })
}

export { disconnect };