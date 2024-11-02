// Function to get the account name from localStorage, with fallback to 'Guest'
function getAccountNameFromLocalStorage() {
    const accountName = localStorage.getItem('username');
    return accountName || "Guest"; // Fallback to 'Guest' if username is not found
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      const restrictedPages = ['blog.html', 'dog-walking.html', 'campaign.html'];
      const currentPage = window.location.pathname.split('/').pop();
      const token = localStorage.getItem('token');
      const restrictedContent = document.querySelectorAll('.restricted-content');
  
      if (restrictedPages.includes(currentPage)) {
          if (token) {
              console.log("User is logged in; displaying restricted content.");
              restrictedContent.forEach(el => el.style.display = 'block');
          } else {
              console.log("User is not logged in; hiding restricted content.");
              restrictedContent.forEach(el => el.style.display = 'none');
          }
      }
  
      // Handle Login/Logout Button
      const loginButton = document.querySelector('a[href="login-page.html"].btn.btn-primary');
      const email = localStorage.getItem('username');
      const username = email ? email.split('@')[0] : '';
  
      if (loginButton && token) {
          console.log("User is logged in. Changing the button to Logout");
  
          loginButton.textContent = 'Logout';
          const usernameDisplay = document.createElement('span');
          usernameDisplay.classList.add('username-display');
          usernameDisplay.textContent = `Welcome, ${username}`;
          usernameDisplay.style.marginRight = '10px';
          loginButton.parentNode.insertBefore(usernameDisplay, loginButton);
  
          loginButton.addEventListener('click', function(event) {
              event.preventDefault();
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              window.location.reload();
          });
      } else if (loginButton) {
          console.log("User is not logged in. Button stays as Log in.");
          loginButton.textContent = 'Log in';
          loginButton.href = 'login-page.html';
      } else {
          console.log("Login button not found.");
      }
  });
  
  // Function to add the reply form with username pre-filled
  function addReplyForm(button) {
    const replyBox = button.previousElementSibling;
    const accountName = getAccountNameFromLocalStorage();
    let replyForm = document.createElement('div');
    replyForm.className = 'mt-2';
  
    replyForm.innerHTML = `
      <input type="text" class="form-control mb-2" value="${accountName}" placeholder="Your name" required>
      <textarea class="form-control mb-2" placeholder="Your reply" rows="2" required></textarea>
      <button class="btn btn-primary btn-sm mb-2" onclick="submitReply(this)">Submit Reply</button>
      <button class="btn btn-secondary btn-sm mb-2" onclick="cancelReplyForm(this)">Cancel</button>
    `;
  
    replyBox.appendChild(replyForm);
    button.style.display = 'none';
  }
  
  // Function to handle reply submission and display it with line breaks
  function submitReply(button) {
    const replyForm = button.parentNode;
    const replyBox = replyForm.parentNode;
    const name = replyForm.querySelector('input').value.trim();
    const comment = replyForm.querySelector('textarea').value.trim().replace(/\n/g, '<br>');
  
    if (name && comment) {
      const replyItem = document.createElement('li');
      replyItem.className = 'list-group-item';
      replyItem.innerHTML = `<strong>${name}:</strong> ${comment}`;
      replyBox.appendChild(replyItem);
      replyForm.remove();
  
      // Show Add Reply button again
      replyBox.nextElementSibling.style.display = 'inline-block';
      replyBox.querySelector('li.text-muted').style.display = 'none';
    }
  }
  
  // Function to cancel the reply form and display Add Reply button
  function cancelReplyForm(button) {
    const replyForm = button.parentNode;
    const replyBox = replyForm.parentNode;
    replyForm.remove();
    replyBox.nextElementSibling.style.display = 'inline-block';
  }
  