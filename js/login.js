/*
// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the login form
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the email and password input values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Basic validation check
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        // Call the login function to handle API interaction
        login(email, password);
    });

    // Function to log in the user
    async function login(email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            console.log("Login response:", result); // Debugging log

            if (response.ok) {
                // Login successful
                //alert("Login successful!");

                // Store the JWT token and username in localStorage
                localStorage.setItem('token', result.token);

                // Extract and store the username derived from the email
                const username = email.split('@')[0];
                localStorage.setItem('username', username);

                // Redirect the user to the homepage
                window.location.href = 'index.html';
            } else {
                // Login failed, display error message
                alert(result.message || "Invalid credentials, please try again.");
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert("A network error occurred during login. Please try again.");
        }
    }
});
*/


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Default credentials
    const defaultEmail = 'Sezim@sup.com';
    const defaultPassword = 'abc';

    // Get user input
    const enteredEmail = document.getElementById('email').value.trim();
    const enteredPassword = document.getElementById('password').value.trim();

    // Check if entered credentials match the default
    if (enteredEmail === defaultEmail && enteredPassword === defaultPassword) {
        // Set token and username in localStorage
        localStorage.setItem('token', 'your-auth-token');  // This token is arbitrary for demo purposes
        localStorage.setItem('username', defaultEmail);

        // Redirect to the home page
        window.location.href = 'index.html';
    } else {
        // Alert user if credentials are incorrect
        alert('Invalid email or password. Please try again.');
    }
});
