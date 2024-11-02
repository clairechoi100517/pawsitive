// Array of member data to simulate database content
const members = [
    {
        name: "Jiwoo Choi",
        description: "Co-Founder of the Club / Co-Leader",
        image: "img/slideshow_jiwoo.png"
    },
    {
        name: "Claire Choi",
        description: "Founder of the Club / Leader",
        image: "img/slideshow_claire.jpg"
    }
];

const slidesContainer = document.getElementById("slides");

// Clone the first and last slide for smooth transitions
const firstClone = { ...members[0] };
const lastClone = { ...members[members.length - 1] };

// Add the last clone to the beginning, and the first clone to the end
const clonedMembers = [lastClone, ...members, firstClone];

// Generate slides based on member data (including cloned slides)
clonedMembers.forEach((member) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
        <img class="profile-pic" src="${member.image}" alt="${member.name}">
        <div class="description">
            <h2>${member.name}</h2>
            <p>${member.description}</p>
        </div>
    `;

    slidesContainer.appendChild(slide);
});

// Variables for controlling the slideshow
let currentSlide = 1; // Start at the first real slide (index 1, after the last clone)
const totalSlides = clonedMembers.length;
const realSlides = members.length;

slidesContainer.style.transform = `translateX(-100%)`; // Start at the first real slide

// Function to show the next slide
function showSlide(index, smooth = true) {
    const offset = -index * 100; // Calculate the offset for each slide
    slidesContainer.style.transition = smooth ? "transform 0.5s ease" : "none"; // Enable or disable smooth transition
    slidesContainer.style.transform = `translateX(${offset}%)`;
}

// Show the next slide
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);

    if (currentSlide === totalSlides - 1) {
        // When the transition ends, immediately jump to the first real slide without animation
        setTimeout(() => {
            currentSlide = 1;
            showSlide(currentSlide, false);
        }, 500); // Allow the transition to complete before the jump
    }
}

// Show the previous slide
function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);

    if (currentSlide === 0) {
        // When the transition ends, immediately jump to the last real slide without animation
        setTimeout(() => {
            currentSlide = totalSlides - 2;
            showSlide(currentSlide, false);
        }, 500); // Allow the transition to complete before the jump
    }
}

// Set the interval for changing slides every 5 seconds
setInterval(nextSlide, 5000);
