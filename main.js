// Load featured events on the homepage
async function loadFeaturedEvents() {
    try {
        const response = await fetch('/api/events/list.php');
        const events = await response.json();
        
        const featuredEventsContainer = document.getElementById('featuredEvents');
        if (!featuredEventsContainer) return;

        featuredEventsContainer.innerHTML = events.map(event => `
            <div class="col-md-6 col-lg-4 event-card" data-category="${event.category}">
                <div class="card h-100 border-0 shadow-sm">
                    <img src="https://source.unsplash.com/600x400/?${event.category}" class="card-img-top" alt="${event.title}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary">${event.category}</span>
                            <small class="text-muted">
                                <i class="fas fa-ticket-alt me-2"></i>${event.available_tickets} tickets left
                            </small>
                        </div>
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
                        <div class="event-details mb-3">
                            <p class="mb-1">
                                <i class="fas fa-calendar-alt me-2"></i>${new Date(event.date).toLocaleDateString()}
                            </p>
                            <p class="mb-1">
                                <i class="fas fa-map-marker-alt me-2"></i>${event.location}
                            </p>
                            <p class="mb-1">
                                <i class="fas fa-tag me-2"></i>$${event.price}
                            </p>
                        </div>
                        <a href="smart-ticketing.html?event=${event.id}" class="btn btn-primary w-100">Get Tickets</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Filter events by category
function filterEvents(category) {
    const events = document.querySelectorAll('.event-card');
    events.forEach(event => {
        if (category === 'all' || event.dataset.category === category) {
            event.style.display = 'block';
        } else {
            event.style.display = 'none';
        }
    });
}

// Handle user authentication
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();
        
        if (result.status) {
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in. Please try again.');
    }
}

// Handle user registration
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/auth/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const result = await response.json();
        
        if (result.status) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load featured events on homepage
    loadFeaturedEvents();
    
    // Add event listeners for category filters
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterEvents(button.dataset.filter);
            
            // Update active state of filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Add event listeners for login/signup forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});
