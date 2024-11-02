document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Get the form input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation check
    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    try {
        // Send POST request to the register API
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email and password
        });

        const result = await response.json();

        if (response.ok) {
            // Registration successful
            alert("Account created successfully!");
            // Redirect to index.html
            window.location.href = 'login-page.html';
        } else {
            // Registration failed, show error message
            alert(result.message || "Error creating account. Please try again.");
        }
    } catch (error) {
        console.error('Registration failed:', error);
        alert("An error occurred during registration. Please try again.");
    }
});
