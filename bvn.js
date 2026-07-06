import { auth, database } from "./firebase.js";

import {
    ref,
    update
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

let currentUser;
let userUID;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    userUID = user.uid;

});

function verifyBVN() {

    const bvnInput = document.getElementById("bvn");
    const dobInput = document.getElementById("dob");

    const bvnError = document.getElementById("bvnError");
    const dobError = document.getElementById("dobError");

    let bvnValue = bvnInput.value.trim();
    let dobValue = dobInput.value;

    bvnError.innerHTML = "";
    dobError.innerHTML = "";

    bvnInput.classList.remove("error-border");
    dobInput.classList.remove("error-border");

    // VALIDATION

    if (bvnValue === "") {
        bvnError.innerHTML = "Enter your BVN";
        bvnInput.classList.add("error-border");
        return;
    }

    if (dobValue === "") {
        dobError.innerHTML = "Please select your Date of Birth";
        dobInput.classList.add("error-border");
        return;
    }

    if (isNaN(bvnValue)) {
        bvnError.innerHTML = "BVN must contain only numbers";
        bvnInput.classList.add("error-border");
        return;
    }

    if (bvnValue.length !== 11) {
        bvnError.innerHTML = "BVN must be 11 digits";
        bvnInput.classList.add("error-border");
        return;
    }

    // FIREBASE

    const userRef = ref(database, "users/" + userUID);

    update(userRef, {

        bvn: bvnValue,
        dateOfBirth: dobValue

    })

        .then(() => {

            window.location.href = "welcome.html";

        })

        .catch((error) => {

            console.log(error);

            alert("Unable to save BVN.");

        });

}

const verifyBtn = document.getElementById("verifyBVNBtn");

if (verifyBtn) {

    verifyBtn.addEventListener("click", verifyBVN);

}

const bvnInput = document.getElementById("bvn");
const bvnError = document.getElementById("bvnError");

const dobInput = document.getElementById("dob");
const dobError = document.getElementById("dobError");

if (bvnInput) {

    bvnInput.addEventListener("input", () => {
        bvnInput.classList.remove("error-border");
        bvnError.innerText = "";
    });

}

if (dobInput) {

    dobInput.addEventListener("input", () => {
        dobInput.classList.remove("error-border");
        dobError.innerText = "";
    });

}