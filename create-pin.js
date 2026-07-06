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

function createPin() {

    const pin_Error = document.getElementById("pinError");

    const pinInputs = document.querySelectorAll(".pin-inputs")[0].querySelectorAll("input");
    const confirmPinInputs = document.querySelectorAll(".pin-inputs")[1].querySelectorAll("input");

    function getPin(inputs) {
        let pin = "";

        for (let i = 0; i < inputs.length; i++) {
            pin += inputs[i].value;
        }

        return pin;
    }

    let pin = getPin(pinInputs);
    let confirmPin = getPin(confirmPinInputs);

    // VALIDATION (same as yours)
    if (pin === "" || confirmPin === "") {
        pin_Error.innerHTML = "Please fill in your PIN";
        return;
    }

    if (isNaN(pin) || isNaN(confirmPin)) {
        pin_Error.innerHTML = "PIN must contain only numbers";
        return;
    }

    if (pin.length !== 4 || confirmPin.length !== 4) {
        pin_Error.innerHTML = "PIN must be 4 digits";
        return;
    }

    if (pin !== confirmPin) {
        pin_Error.innerHTML = "PIN does not match";
        return;
    }

    // 🔥 SAVE TO FIREBASE (THIS IS THE NEW PART)

    const userRef = ref(database, "users/" + userUID);

    update(userRef, {
        pin: pin
    })
        .then(() => {

            pin_Error.style.color = "green";
            pin_Error.innerHTML = "PIN created successfully!";

            setTimeout(() => {
                window.location.href = "bvn.html";
            }, 1000);

        })
        .catch((error) => {

            console.log(error);
            pin_Error.innerHTML = "Error saving PIN. Try again.";
            pin_Error.style.color = "red";

        });
}

const pinBtn = document.getElementById("createPinBtn");
if (pinBtn) {
    pinBtn.addEventListener("click", createPin);
}

const allPinInputs = document.querySelectorAll(".pin-inputs input");

allPinInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        if (input.value.length === 1) {

            let nextInput = allPinInputs[index + 1];

            if (nextInput) {
                nextInput.focus();
            }

        }

    });

});

allPinInputs.forEach((input, index) => {

    input.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && input.value === "") {

            let prevInput = allPinInputs[index - 1];

            if (prevInput) {
                prevInput.focus();
            }

        }

    });

});
