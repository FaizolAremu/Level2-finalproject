import { auth, database } from "./firebase.js";

// Firebase Auth
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Firebase Database
import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";



const googleLoginBtn = document.getElementById("googleLoginBtn");

const provider = new GoogleAuthProvider();

if (googleLoginBtn) {

    googleLoginBtn.addEventListener("click", async () => {

        try {

            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            const userRef = ref(database, "users/" + user.uid);

            const snapshot = await get(userRef);

            if (snapshot.exists()) {

                alert(`Welcome back ${snapshot.val().firstName}`);

                window.location.href = "dashboard.html";

            } else {

                alert("No account found. Please sign up first.");

            }

        }

        catch (error) {

            console.log(error);

            alert(error.message);

        }

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
