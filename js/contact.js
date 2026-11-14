/* ============================================================
   File:    js/contact.js
   Page:    contact.html
   Purpose: Client-side validation for the contact form.
            Rules:
              1. No field may be empty.
              2. The email address must have a valid format.
              3. The phone number may contain digits only.
   ============================================================ */

(function () {
    "use strict"; // catch common mistakes such as undeclared variables

    /* ---------- Look up the form and its elements ---------- */
    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");

    // Stop quietly if this script is loaded on a page without the form
    if (!form) { return; }

    /* ---------- Validation patterns ---------- */

    // Email: something@something.something, with no spaces.
    // [^\s@]+  = one or more characters that are not whitespace or "@"
    // \.       = a literal dot
    // [^\s@]{2,} = at least two characters after the dot (e.g. "com", "ng")
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Phone: one or more digits from start (^) to end ($), nothing else
    var DIGITS_ONLY = /^\d+$/;

    /* ---------- Field rules ----------
       Each rule receives the trimmed value and returns an error
       message, or an empty string when the value is valid. */
    var rules = {
        name: function (value) {
            if (value === "") { return "Please enter your name."; }
            return "";
        },
        email: function (value) {
            if (value === "") { return "Please enter your email address."; }
            if (!EMAIL_PATTERN.test(value)) {
                return "Please enter a valid email address, for example name@example.com.";
            }
            return "";
        },
        phone: function (value) {
            if (value === "") { return "Please enter your phone number."; }
            if (!DIGITS_ONLY.test(value)) {
                return "Phone number must contain digits only (no spaces, dashes or + sign).";
            }
            return "";
        },
        message: function (value) {
            if (value === "") { return "Please enter your message."; }
            return "";
        }
    };

    /* ---------- Show or clear one field's error ---------- */
    function setError(id, text) {
        var input = document.getElementById(id);
        var errorBox = document.getElementById(id + "Err");

        errorBox.textContent = text;

        // aria-invalid tells screen readers the field has a problem;
        // aria-describedby links the field to its error message
        if (text) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", id + "Err");
        } else {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
        }
    }

    /* ---------- Validate one field; returns true when valid ---------- */
    function validateField(id) {
        var value = document.getElementById(id).value.trim(); // trim() so "   " counts as empty
        var message = rules[id](value);
        setError(id, message);
        return message === "";
    }

    /* ---------- Handle form submission ---------- */
    form.addEventListener("submit", function (event) {
        // Stop the browser from reloading the page
        event.preventDefault();
        status.textContent = "";

        var firstInvalid = null;

        // Check every field (not just the first bad one) so all errors show together
        Object.keys(rules).forEach(function (id) {
            if (!validateField(id) && firstInvalid === null) {
                firstInvalid = document.getElementById(id);
            }
        });

        // If anything failed, move focus to the first problem field and stop
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        // All fields passed: confirm to the visitor and clear the form
        status.textContent = "Thank you! Your message has been received.";
        form.reset();
    });

    /* ---------- Live feedback ----------
       After a field has shown an error, re-check it as the visitor types
       so the message disappears as soon as the problem is fixed. */
    Object.keys(rules).forEach(function (id) {
        document.getElementById(id).addEventListener("input", function () {
            if (this.getAttribute("aria-invalid") === "true") {
                validateField(id);
            }
        });
    });
})();
