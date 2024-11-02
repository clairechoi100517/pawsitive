// Helper function to get the account name from localStorage, with a fallback to 'Guest'
function getAccountNameFromLocalStorage() {
  return localStorage.getItem('username') || "Guest";
}

// Toggle thread details visibility
function toggleThreadDetails(button) {
  const threadDetails = button.parentNode.nextElementSibling;
  threadDetails.style.display = threadDetails.style.display === 'none' ? 'block' : 'none';
  button.textContent = threadDetails.style.display === 'block' ? 'Hide Thread' : 'Show Thread';
}

// Open and Close Modal Functions for Thread and Reply
function closeThreadModal() {
  document.getElementById('threadModalOverlay').classList.remove('active');
  document.getElementById('threadForm').reset(); // Reset thread form on close
}

function openReplyModal() {
  document.getElementById('replyModalOverlay').classList.add('active');
}

function closeReplyModal() {
  document.getElementById('replyModalOverlay').classList.remove('active');
  document.getElementById('replyForm').reset(); // Reset reply form on close
}

// Event listener for opening thread modal
document.querySelector('.add-thread').addEventListener('click', function() {
  document.getElementById('threadModalOverlay').classList.add('active');
});

// Event listeners for closing modals with close buttons
document.querySelectorAll('.close-modal').forEach(button => {
  button.addEventListener('click', function() {
      closeThreadModal();
      closeReplyModal();
  });
});

// Event listener to close modals when clicking outside modal content
document.getElementById('threadModalOverlay').addEventListener('click', function(event) {
  if (event.target === this) closeThreadModal();
});

document.getElementById('replyModalOverlay').addEventListener('click', function(event) {
  if (event.target === this) closeReplyModal();
});

// Event listener for thread form submission inside modal
document.getElementById('threadForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  const uploadResult = await uploadImages(); // Call the uploadImages function
  if (uploadResult) {
      uploadMetaData(uploadResult.files); // Proceed with uploading metadata
  }
});


// Function to upload images
async function uploadImages() {
  const formData = new FormData();
  const fileInput = document.querySelector("input[type='file']");
  const imageFiles = fileInput.files; // Get files from the input
  const folder = document.getElementById("threadForm").getAttribute("data-folder");

  console.log(`Folder: ${folder}`);
  console.log('File input:', fileInput); // Log the file input element
  console.log('Selected files:', imageFiles); // Log the files to see if any are selected

  // Check if any files are selected
  if (imageFiles.length === 0) {
      console.error("No files selected for upload.");
      return null; // Return null if no files are selected
  }

  // Append each file to FormData
  for (const file of imageFiles) {
      formData.append("images", file); // Use 'images' as the key for multiple files
      console.log(`Appending file: ${file.name}`); // Log the name of the file being appended
  }

  // Log FormData contents
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value); // Log file name if it's a File object
  }

  try {
      // Upload the images
      const uploadResponse = await fetch(`http://localhost:5000/api/upload?folder=${folder}`, {
          method: "POST",
          body: formData
      });

      if (!uploadResponse.ok) {
          const errorMessage = await uploadResponse.text(); // Get error message from response
          console.error("Error uploading images:", errorMessage);
          return null;
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult; // Return the upload result if successful
  } catch (error) {
      console.error("Error uploading images:", error);
      return null; // Handle fetch error
  }
}


// Function to upload metadata
function uploadMetaData(files) {
  const threadName = document.getElementById("threadName").value;
  const threadTopic = document.getElementById("threadTopic").value;
  const threadDescription = document.getElementById("threadDescription").value;
  const userId = "60c72b2f9b1d8c3c8c8c8c8c"; // Example of a valid ObjectId

  // Prepare metadata with additional form values
  const metadata = {
      threadName: threadName,
      threadTopic: threadTopic,
      threadDescription: threadDescription,
      userId, // Ensure userId is included here
      images: files.map(file => ({
          name: file.originalname,  // Assuming the original name is provided in the response
          path: file.path           // Path where the file is stored
      }))
  };

  // Make a POST request to send metadata to the server
  fetch("http://localhost:5000/api/blogdata", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
  })
  .then(response => response.json())
  .then(result => {
      console.log("Metadata upload result:", result.message);
      fetchThreads();
      closeThreadModal(); // Close modal here after successful upload
  })
  .catch(error => {
      console.error("Error uploading metadata:", error);
  });
}

// Function to fetch and display threads from the database
async function fetchThreads() {
  try {
      const response = await fetch('http://localhost:5000/api/threads');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const threads = await response.json();

      const threadsList = document.getElementById('threadsList');
      threadsList.innerHTML = ''; // Clear existing threads

      // Populate threads into the list
      threads.forEach(thread => {
          const threadItem = document.createElement('li');
          threadItem.className = 'list-group-item';

          // Set data attributes for thread ID and user ID
          threadItem.setAttribute('data-thread-id', thread.id); // The unique ID of the thread
          threadItem.setAttribute('data-user-id', thread.userId); // The ID of the user who created the thread


          // Create a thread header
          const threadHeader = document.createElement('div');
          threadHeader.innerHTML = `
              <strong>${thread.threadTopic}</strong> by ${thread.threadName}<br>
              <button class="btn btn-secondary btn-sm float-end" onclick="toggleThreadDetails(this)">Show Thread</button>
              <button class="btn btn-danger btn-sm float-end me-2" onclick="deleteThread(this)">Delete</button>
          `;

          // Create thread details section
          const threadDetails = document.createElement('div');
          threadDetails.className = 'thread-details';
          threadDetails.style.display = 'none';

          // Add description to thread details
          let detailsContent = `<br><p>${thread.threadDescription}</p>`;

          // Add image previews if any images are uploaded
          if (thread.images && thread.images.length > 0) {
              thread.images.forEach(image => {
                  detailsContent += `<img src="${image.path}" class="img-thumbnail mt-2 thread-image" style="max-width: 150px; display: inline-block; margin-right: 10px;" alt="Thread Image">`;
              });
          }

          // Add reply section to thread details
          detailsContent += `
              <div class="mt-3">
                  <ul class="list-group reply-box">
                      <li class="list-group-item text-muted">No comments yet...</li>
                  </ul>
                  <button class="btn btn-outline-primary btn-sm mt-2" onclick="addReplyForm(this)">Add Reply</button>
              </div>`;

          threadDetails.innerHTML = detailsContent;

          // Append header and details to thread item
          threadItem.appendChild(threadHeader);
          threadItem.appendChild(threadDetails);

          // Append the new thread to the threads list
          threadsList.appendChild(threadItem);
      });
  } catch (error) {
      console.error('Error fetching threads:', error);
  }
}

// Call fetchThreads when the document is ready to populate existing threads
document.addEventListener('DOMContentLoaded', fetchThreads);

// Modified deleteThread function to include confirmation
function deleteThread(button) {
  if (confirm("Are you sure you want to delete this thread?")) {
    const threadItem = button.closest('li');
    threadItem.remove();
  }
}