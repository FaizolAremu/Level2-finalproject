import { auth, database } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


let currentUser;
let userUID;


let selectedOption = "";

const userName = document.getElementById("userName");
const savingsCard = document.getElementById("savingsCard");
const investmentCard = document.getElementById("investmentCard");
const continueButton = document.getElementById("continueBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    userUID = user.uid;

    const snapshot = await get(ref(database, "users/" + userUID));

    if (snapshot.exists()) {

        currentUser = snapshot.val();

        userName.innerHTML = currentUser.firstName;

    }

});

savingsCard.addEventListener("click", () => {

    savingsCard.classList.add("selected");

    investmentCard.classList.remove("selected");

    selectedOption = "Savings";

});


investmentCard.addEventListener("click", () => {

    investmentCard.classList.add("selected");

    savingsCard.classList.remove("selected");

    selectedOption = "Investments";

});

continueButton.addEventListener("click", () => {

    if (selectedOption === "") {

        alert("Please select an option");

        return;

    }

    const userRef = ref(database, "users/" + userUID);

    update(userRef, {

        accountType: selectedOption

    })

        .then(() => {

            window.location.href = "dashboard.html";

        })

        .catch((error) => {

            console.log(error);

            alert("Unable to save account type.");

        });
});
