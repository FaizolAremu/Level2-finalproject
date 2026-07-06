import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";


const toggleIcon = document.getElementById('toggleVisibility');
const balanceValue = document.getElementById('balanceValue');
const balanceCents = document.getElementById('balanceCents');

let isVisible = true;

toggleIcon.addEventListener('click', () => {
    isVisible = !isVisible;

    if (isVisible) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');

        balanceValue.textContent = currentUser.balance;
        balanceCents.textContent = '.00';
        balanceCents.style.display = 'inline';

    } else {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');

        balanceValue.textContent = '****';
        balanceCents.style.display = 'none';
    }
});

const cashBtns = document.querySelectorAll('.cash-btn');

cashBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        cashBtns.forEach(b => {
            b.classList.remove('border-primary', 'text-primary', 'bg-primary-subtle');
        });

        btn.classList.add('border-primary', 'text-primary', 'bg-primary-subtle');
    });
});

const cash20k = document.getElementById("cash20k");
const cash50k = document.getElementById("cash50k");
const cash100k = document.getElementById("cash100k");

if (cash20k) {
    cash20k.addEventListener("click", () => {
        payWithPaystack(20000);
    });
}

if (cash50k) {
    cash50k.addEventListener("click", () => {
        payWithPaystack(50000);
    });
}

if (cash100k) {
    cash100k.addEventListener("click", () => {
        payWithPaystack(100000);
    });
}

// PROTECT DASHBOARD

// DISPLAY USER DETAILS
let currentUser;
let authUser;

let dashboardUser = document.getElementById("dashboardName");

let nairaFundsBalance = document.getElementById("nairaFundsBalance");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    authUser = user;

    const snapshot = await get(ref(database, "users/" + user.uid));

    if (!snapshot.exists()) {

        window.location.href = "signup.html";
        return;

    }

    currentUser = snapshot.val();

    if (!currentUser.pin) {
        window.location.href = "create-pin.html";
        return;
    }

    if (!currentUser.bvn) {
        window.location.href = "bvn.html";
        return;
    }

    if (!currentUser.accountType) {
        window.location.href = "welcome.html";
        return;

    }

    // DISPLAY USER DETAILS

    dashboardUser.innerHTML = currentUser.firstName;
    balanceValue.textContent = currentUser.balance;

    if (nairaFundsBalance) {
        nairaFundsBalance.textContent = currentUser.balance;
    }

});

// LOGOUT

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.log(error);
            alert("Logout failed");
        });

});

// PAYSTACK PAYMENT

function payWithPaystack(amountFromButton = null) {

    let amountInput = document.getElementById("paymentAmount");

    let amount;

    // If button clicked (10k, 20k, 50k)
    if (amountFromButton) {
        amount = amountFromButton;
    } else {
        amount = Number(amountInput.value);
    }

    if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    let handler = PaystackPop.setup({

        key: "pk_test_66fcb7bbecf30cee80d81bfea2009fd27831c8fd",

        email: currentUser.email,

        amount: amount * 100,

        currency: "NGN",

        callback: function (response) {

            (async () => {

                let newBalance = currentUser.balance + amount;

                const userRef = ref(database, "users/" + authUser.uid);

                await update(userRef, {
                    balance: newBalance
                });

                currentUser.balance = newBalance;

                balanceValue.textContent = currentUser.balance;

                if (nairaFundsBalance) {
                    nairaFundsBalance.textContent = currentUser.balance;
                }

                alert("Payment successful! Ref: " + response.reference);

            })();

        },

        onClose: function () {
            alert("Transaction cancelled");
        }

    });

    handler.openIframe();
}

const payBtn = document.getElementById("payBtn");

if (payBtn) {
    payBtn.addEventListener("click", () => {
        payWithPaystack();
    });
}