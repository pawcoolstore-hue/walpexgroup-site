const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");

    const data = {
        name: inputs[0].value,
        email: inputs[1].value,
        company: inputs[2].value,
        message: form.querySelector("textarea").value,
        token: document.querySelector('[name="cf-turnstile-response"]').value
    };

    const response = await fetch("https://walpex-contact.pawcoolstore.workers.dev/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const success = document.createElement("div");
        success.className = "form-success";
        success.innerHTML = `
            <strong>✓ Thank you!</strong><br>
            Your message has been sent successfully.<br>
            We will contact you within 24 hours.
        `;

        form.parentNode.insertBefore(success, form);

        form.reset();

        setTimeout(() => {
            success.remove();
        }, 6000);

    } else {
        const error = document.createElement("div");
        error.className = "form-error";
        error.innerHTML = `
            <strong>✕ Sorry!</strong><br>
            Something went wrong.<br>
            Please try again later.
        `;

        form.parentNode.insertBefore(error, form);

        setTimeout(() => {
            error.remove();
        }, 6000);
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, {
    threshold: 0.4
});

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});/ Reserved for animations
