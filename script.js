// Firebase Auth functions
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Firebase Database functions
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Your firebase connection
import { auth, database } from "./firebase.js";





// ================= SIGN UP =================

const signupForm = document.getElementById("signupform");

if (signupForm) {

    const firstNameInput = document.getElementById("firstname");
    const lastNameInput = document.getElementById("lastname");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const errorMessage = document.getElementById("error");

    const halalSwitch = document.getElementById("halalAccount");
    const popupBox = document.getElementById("halalModal");
    const gotItButton = document.getElementById("gotItBtn");
    const closeButton = document.getElementById("closeModal");

    // Popup functionality
    halalSwitch.addEventListener("change", function () {
        if (halalSwitch.checked) {
            popupBox.style.display = "flex";
        }
    });

    gotItButton.addEventListener("click", function () {
        popupBox.style.display = "none";
    });

    closeButton.addEventListener("click", function () {
        popupBox.style.display = "none";
    });

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let firstNameValue = firstNameInput.value.trim();
        let lastNameValue = lastNameInput.value.trim();
        let usernameValue = usernameInput.value.trim();
        let emailValue = emailInput.value.trim();
        let phoneValue = phoneInput.value.trim();
        let passwordValue = passwordInput.value.trim();
        let confirmPasswordValue = confirmPasswordInput.value.trim();

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            firstNameValue === "" ||
            lastNameValue === "" ||
            usernameValue === "" ||
            emailValue === "" ||
            phoneValue === "" ||
            passwordValue === "" ||
            confirmPasswordValue === ""
        ) {
            errorMessage.innerHTML = "Please fill in all fields";
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "12px";
            return;
        }

        if (!emailPattern.test(emailValue)) {
            errorMessage.innerHTML = "Enter a valid email address";
            errorMessage.style.color = "red";
            return;
        }

        let phonePattern = /^[+]?[\d\s()-]{10,20}$/;

        if (!phonePattern.test(phoneValue)) {
            errorMessage.innerHTML = "Enter a valid phone number";
            errorMessage.style.color = "red";
            return;
        }

        if (passwordValue.length < 8) {
            errorMessage.innerHTML = "Password must be at least 8 characters";
            errorMessage.style.color = "red";
            return;
        }

        if (passwordValue !== confirmPasswordValue) {
            errorMessage.innerHTML = "Passwords do not match";
            errorMessage.style.color = "red";
            return;
        }

        createUserWithEmailAndPassword(auth, emailValue, passwordValue)

            .then((userCredential) => {

                const user = userCredential.user;

                return set(ref(database, "users/" + user.uid), {

                    firstName: firstNameValue,
                    lastName: lastNameValue,
                    username: usernameValue,
                    email: emailValue,
                    phone: phoneValue,
                    halal: halalSwitch.checked,
                    balance: 0

                });

            })

            .then(() => {

                signupForm.reset();

                alert("Account created successfully!");

                setTimeout(() => {

                    window.location.href = "create-pin.html";

                }, 1000);

            })

            .catch((error) => {

                const errorCode = error.code;
                const message = error.message;

                console.log(errorCode);

                if (errorCode === 'auth/invalid-email') {
                    errorMessage.innerHTML = "Enter a valid email address";
                }
                else if (errorCode === 'auth/email-already-in-use') {
                    errorMessage.innerHTML = "Email already in use";
                }
                else if (errorCode === 'auth/weak-password') {
                    errorMessage.innerHTML = "Password should be at least 6 characters";
                }
                else {
                    errorMessage.innerHTML = message;
                }

                errorMessage.style.color = "red";
                errorMessage.style.fontSize = "12px";
            });
    });

}


// ================= LOGIN =================

const loginFormLf = document.getElementById("loginForm");

if (loginFormLf) {

    const loginEmail = document.getElementById("loginemail");
    const loginPassword = document.getElementById("loginpassword");
    const loginError = document.getElementById("loginerror");

    loginFormLf.addEventListener("submit", function (event) {
        event.preventDefault();

        let emailVal = loginEmail.value.trim();
        let passwordVal = loginPassword.value.trim();

        if (emailVal === "" || passwordVal === "") {
            loginError.innerHTML = "Please fill all fields";
            loginError.style.color = "red";
            loginError.style.fontSize = "12px";
            return;
        }

        signInWithEmailAndPassword(auth, emailVal, passwordVal)
            .then((userCredential) => {

                const user = userCredential.user;

                alert("Login successful!");

                loginFormLf.reset();
                loginError.innerHTML = "";

                // go to dashboard
                window.location.href = "dashboard.html";

            })
            .catch((error) => {

                const errorCode = error.code;

                if (errorCode === "auth/user-not-found") {
                    loginError.innerHTML = "No account found with this email";
                }
                else if (errorCode === "auth/wrong-password") {
                    loginError.innerHTML = "Incorrect password";
                }
                else if (errorCode === "auth/invalid-email") {
                    loginError.innerHTML = "Invalid email format";
                }
                else if (errorCode === "auth/invalid-credential") {
                    loginError.innerHTML = "Incorrect email or password";
                }
                else {
                    loginError.innerHTML = "Login failed. Try again.";
                }

                loginError.style.color = "red";
                loginError.style.fontSize = "12px";
            });

    });
}

// Create-pin

// const createPin = () => {
//     const pin_Error = document.getElementById("pinError");
//     const pinInputs = document.querySelectorAll(".pin-inputs")[0].querySelectorAll("input");
//     const confirmpinInputs = document.querySelectorAll(".pin-inputs")[1].querySelectorAll("input");

//     function getPin(inputs) {

//         let pin = "";

//         for (let i = 0; i < inputs.length; i++) {
//             pin += inputs[i].value;
//         }
//         return pin;

//     }

//     let pin = getPin(pinInputs);
//     let confirmPin = getPin(confirmpinInputs);

//     if (pin === "" || confirmPin === "") {
//         pinError.innerHTML = "Please fill in your PIN";
//         return;
//     }

//     if (isNaN(pin) || isNaN(confirmPin)) {
//         pinError.innerHTML = "PIN must contain only numbers";
//         return;
//     }

//     if (pin.length !== 4 || confirmPin.length !== 4) {
//         pinError.innerHTML = "PIN must be 4 digits";
//         return;
//     }

//     if (pin !== confirmPin) {
//         pinError.innerHTML = "PIN does not match";
//         return;
//     }

//     let allUsers = JSON.parse(localStorage.getItem("usersDetails")) || [];

//     let lastUser = allUsers[allUsers.length - 1];

//     if (lastUser) {
//         lastUser.pin = pin;

//         localStorage.setItem(
//             "usersDetails",
//             JSON.stringify(allUsers)
//         );
//     }

//     pinError.style.color = "green";
//     pinError.innerHTML = "PIN created successfully!";

//     setTimeout(() => {
//         window.location.href = "bvn.html";
//     }, 1000);

// }

// const allPinInputs = document.querySelectorAll(".pin-inputs input");

// allPinInputs.forEach((input, index) => {

//     input.addEventListener("input", () => {

//         if (input.value.length === 1) {

//             let nextInput = allPinInputs[index + 1];

//             if (nextInput) {
//                 nextInput.focus();
//             }

//         }

//     });

// });

// allPinInputs.forEach((input, index) => {

//     input.addEventListener("keydown", (e) => {

//         if (e.key === "Backspace" && input.value === "") {

//             let prevInput = allPinInputs[index - 1];

//             if (prevInput) {
//                 prevInput.focus();
//             }

//         }

//     });

// });



// BVN
// const verifyBVN = () => {
//     const bvnInput = document.getElementById("bvn");
//     const dobInput = document.getElementById("dob");
//     const bvnError = document.getElementById("bvnError");
//     const dobError = document.getElementById("dobError");

//     let bvnValue = bvnInput.value.trim();
//     let dobValue = dobInput.value;

//     bvnError.innerHTML = "";
//     dobError.innerHTML = "";
//     bvnInput.classList.remove("error-border");
//     dobInput.classList.remove("error-border");

//     if (bvnValue === "") {
//         bvnError.innerHTML = "Enter your BVN";

//         bvnInput.classList.add("error-border");
//         return;
//     }

//     if (dobValue === "") {
//         dobError.innerHTML = "Please select your Date of Birth";

//         dobInput.classList.add("error-border");
//         return;
//     }

//     if (isNaN(bvnValue)) {
//         bvnError.innerHTML = "BVN must contain only numbers";

//         bvnInput.classList.add("error-border");
//         return;

//     }

//     if (bvnValue.length !== 11) {
//         bvnError.innerHTML = "BVN must be 11 digits";

//         bvnInput.classList.add("error-border");
//         return;

//     }

//     let allUsers = JSON.parse(localStorage.getItem("usersDetails")) || [];

//     let lastUser = allUsers[allUsers.length - 1];

//     if (lastUser) {
//         lastUser.bvn = bvnValue;
//         lastUser.dateOfBirth = dobValue;

//         localStorage.setItem(
//             "usersDetails",
//             JSON.stringify(allUsers)
//         );
//     }

//     window.location.href = "welcome.html";
// }

// const bvnInput = document.getElementById("bvn");
// const bvnError = document.getElementById("bvnError");

// const dobInput = document.getElementById("dob");
// const dobError = document.getElementById("dobError");

// if (bvnInput) {

//     bvnInput.addEventListener("input", () => {
//         bvnInput.classList.remove("error-border");
//         bvnError.innerText = "";
//     });

// }

// if (dobInput) {

//     dobInput.addEventListener("input", () => {
//         dobInput.classList.remove("error-border");
//         dobError.innerText = "";
//     });

// }



// Welcome 

// let selectedOption = "";

// function selectSavings() {

//     document.getElementById("savingsCard").classList.add("selected");
//     document.getElementById("investmentCard").classList.remove("selected");

//     selectedOption = "Savings";
// }

// function selectInvestment() {

//     document.getElementById("investmentCard").classList.add("selected");
//     document.getElementById("savingsCard").classList.remove("selected");

//     selectedOption = "Investments";
// }

// function continueBtn() {

//     if (selectedOption === "") {
//         alert("Please select an option");
//         return;
//     }

//     let allUsers = JSON.parse(localStorage.getItem("usersDetails")) || [];
//     let lastUser = allUsers[allUsers.length - 1];

//     if (lastUser) {
//         lastUser.accountType = selectedOption;
//         localStorage.setItem("usersDetails", JSON.stringify(allUsers));
//     }

//     window.location.href = "dashboard.html";
// }