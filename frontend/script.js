const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  initializeTabNavigation();
  initializeBookingTab();
  initializeMoviesTab();
  initializeShowtimesTab();
  initializeBookingsTab();
});

// ============================================================================
// TAB NAVIGATION
// ============================================================================

function initializeTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);

      // Update active button
      navButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

function switchTab(tabName) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach((tab) => tab.classList.remove('active'));

  const activeTab = document.getElementById(`${tabName}-tab`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Refresh data when switching tabs
  if (tabName === 'movies') loadMoviesList();
  if (tabName === 'showtimes') loadShowtimesList();
  if (tabName === 'bookings') loadBookingsList();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alert-box');
  const alertBox2 = document.getElementById('alert-box-2');
  //   console.log(error.message);
  alertBox.textContent = message;
  alertBox2.textContent = message;
  alertBox.style.color =
    type === 'success' ? 'green' : type === 'warning' ? 'orange' : 'red';
  alertBox2.style.color = alertBox.style.color;
  alertBox.style.fontWeight = 'bold';
  alertBox2.style.fontWeight = 'bold';
  setTimeout(() => {
    alertBox.textContent = '';
    alertBox2.textContent = '';
  }, 5000);
}

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      // 1. Capture the body text first
      const errorBody = await response.json().catch(() => null);

      // 2. Extract the message (NestJS puts it in 'message')
      const message =
        errorBody?.error?.message ||
        `Error: ${response.status + ' ' + response.statusText}`;
      // 3. Throw a clean error
      throw new Error(message);
    }
    // Check if response is empty (204 No Content) or has no length
    const contentType = response.headers.get('content-type');
    if (
      response.status === 204 ||
      !contentType ||
      !contentType.includes('application/json')
    ) {
      return null;
    }
    return await response.json();
  } catch (error) {
    showAlert(error.message);
    throw error;
  }
}

// ============================================================================
// BOOKING TAB
// ============================================================================

function initializeBookingTab() {
  const movieDropdown = document.getElementById('movie-dropdown');
  const showtimeDropdown = document.getElementById('showtime-dropdown');
  const bookButton = document.getElementById('book-button');

  loadMoviesForBooking();

  movieDropdown.addEventListener('change', () => {
    loadShowtimesForMovie(movieDropdown.value);
  });

  showtimeDropdown.addEventListener('change', () => {
    loadSeatsForShowtime(showtimeDropdown.value);
  });

  bookButton.addEventListener('click', handleBooking);
}

async function loadMoviesForBooking() {
  try {
    const movies = await fetchAPI('/movies');
    const dropdown = document.getElementById('movie-dropdown');
    dropdown.innerHTML = '<option value="">-- Select a Movie --</option>';

    movies.forEach((movie) => {
      const option = document.createElement('option');
      option.value = movie.id;
      option.textContent = movie.title;
      dropdown.appendChild(option);
    });
  } catch (error) {
    showAlert('Failed to load movies');
  }
}

async function loadShowtimesForMovie(movieId) {
  const dropdown = document.getElementById('showtime-dropdown');
  dropdown.innerHTML = '<option value="">-- Select a Showtime --</option>';

  if (!movieId) return;

  try {
    const showtimes = await fetchAPI(`/showtimes?movie_id=${movieId}`);

    showtimes.forEach((showtime) => {
      const option = document.createElement('option');
      option.value = showtime.id;
      option.textContent = `${showtime.start_time}`;
      dropdown.appendChild(option);
    });
  } catch (error) {
    showAlert('Failed to load showtimes');
  }
}

async function loadSeatsForShowtime(showtimeId) {
  const seatMap = document.getElementById('seat-map');
  seatMap.innerHTML = '';

  if (!showtimeId) return;

  try {
    const showtime = await fetchAPI(`/showtimes/${showtimeId}`);
    const bookings = await fetchAPI(`/bookings?showtime_id=${showtimeId}`);

    const bookedSeats = new Set();
    bookings.forEach((booking) => {
      booking.seat_numbers.forEach((seat) => bookedSeats.add(seat));
    });

    // Create seat grid based on total_seats
    const totalSeats = showtime.total_seats || 100;
    for (let i = 1; i <= totalSeats; i++) {
      const seatDiv = document.createElement('div');
      seatDiv.classList.add('seat');
      seatDiv.textContent = i;

      if (bookedSeats.has(i)) {
        seatDiv.classList.add('taken');
      } else {
        seatDiv.addEventListener('click', () => {
          seatDiv.classList.toggle('selected');
        });
      }

      seatMap.appendChild(seatDiv);
    }
  } catch (error) {
    showAlert('Failed to load seats');
  }
}

async function handleBooking() {
  const showtimeId = document.getElementById('showtime-dropdown').value;
  const selectedSeats = Array.from(
    document.querySelectorAll('#seat-map .seat.selected'),
  );
  const seat_numbers = selectedSeats.map((seat) => parseInt(seat.textContent));

  if (!showtimeId) {
    showAlert('Please select a showtime');
    return;
  }

  if (seat_numbers.length === 0) {
    showAlert('Please select at least one seat');
    return;
  }

  const customer_name = prompt('Enter your name:');
  if (!customer_name) return;

  const customer_email = prompt('Enter your email:');
  if (!customer_email) return;

  const customer_phone = prompt('Enter your phone number:');
  if (!customer_phone) return;

  try {
    // For demo purposes, calculate total_amount (you can modify this based on price per seat)
    const total_amount = seat_numbers.length * 10; // Assuming $10 per seat

    await fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        showtime_id: parseInt(showtimeId),
        customer_name,
        customer_email,
        customer_phone,
        seat_numbers,
        total_amount,
      }),
    });

    showAlert('Booking successful!', 'success');
    selectedSeats.forEach((seat) => seat.classList.remove('selected'));
    loadSeatsForShowtime(showtimeId);
  } catch (error) {
    showAlert('Booking failed: ' + error.message);
  }
}

// ============================================================================
// MOVIES TAB
// ============================================================================

function initializeMoviesTab() {
  const form = document.getElementById('create-movie-form');
  form.addEventListener('submit', handleCreateMovie);
}

async function loadMoviesList() {
  try {
    const movies = await fetchAPI('/movies');
    const container = document.getElementById('movies-list');
    container.innerHTML = '';

    if (movies.length === 0) {
      container.innerHTML = '<p>No movies yet. Create one!</p>';
      return;
    }

    movies.forEach((movie) => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.innerHTML = `
        <div class="movie-info">
          <h4>${movie.title}</h4>
          <p>Genre: ${movie.genre}</p>
          <p>Duration: ${movie.duration} minutes</p>
          <p>Rating: ${movie.rating}/10</p>
          <p>Release Year: ${movie.release_year}</p>
        </div>
        <div class="actions">
          <button class="btn btn-warning btn-small" onclick="editMovie(${movie.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteMovie(${movie.id})">Delete</button>
        </div>
      `;
      container.appendChild(movieItem);
    });
  } catch (error) {
    showAlert('Failed to load movies');
  }
}

async function handleCreateMovie(e) {
  e.preventDefault();

  const title = document.getElementById('movie-title').value;
  const genre = document.getElementById('movie-genre').value;
  const duration = parseInt(document.getElementById('movie-duration').value);
  const rating = parseFloat(document.getElementById('movie-rating').value);
  const release_year = parseInt(
    document.getElementById('movie-release-year').value,
  );

  try {
    await fetchAPI('/movies', {
      method: 'POST',
      body: JSON.stringify({
        title,
        genre,
        duration,
        rating,
        release_year,
      }),
    });

    showAlert('Movie created successfully!', 'success');
    e.target.reset();
    loadMoviesList();
    loadMoviesForBooking();
    loadMoviesForShowtimeForm();
  } catch (error) {
    showAlert('Failed to create movie: ' + error.message);
  }
}

async function deleteMovie(movieId) {
  if (!confirm('Are you sure you want to delete this movie?')) return;

  try {
    await fetchAPI(`/movies/${movieId}`, { method: 'DELETE' });
    showAlert('Movie deleted successfully!', 'success');
    loadMoviesList();
    loadMoviesForBooking();
    loadMoviesForShowtimeForm();
  } catch (error) {
    showAlert('Failed to delete movie: ' + error.message);
  }
}

async function editMovie(movieId) {
  try {
    const movie = await fetchAPI(`/movies/${movieId}`);

    const newTitle = prompt('Enter new title:', movie.title);
    if (!newTitle) return;

    const newGenre = prompt('Enter new genre:', movie.genre);
    if (newGenre === null) return;

    const newDuration = prompt(
      'Enter new duration (minutes, 1-600):',
      movie.duration,
    );
    if (!newDuration) return;

    const newRating = prompt('Enter new rating (0-10):', movie.rating);
    if (!newRating) return;

    const newReleaseYear = prompt(
      'Enter new release year (1900-2030):',
      movie.release_year,
    );
    if (!newReleaseYear) return;

    await fetchAPI(`/movies/${movieId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: newTitle,
        genre: newGenre,
        duration: parseInt(newDuration),
        rating: parseFloat(newRating),
        release_year: parseInt(newReleaseYear),
      }),
    });

    showAlert('Movie updated successfully!', 'success');
    loadMoviesList();
    loadMoviesForBooking();
    loadMoviesForShowtimeForm();
  } catch (error) {
    showAlert('Failed to update movie: ' + error.message);
  }
}

// ============================================================================
// SHOWTIMES TAB
// ============================================================================

function initializeShowtimesTab() {
  const form = document.getElementById('create-showtime-form');
  form.addEventListener('submit', handleCreateShowtime);
  loadMoviesForShowtimeForm();
}

async function loadMoviesForShowtimeForm() {
  try {
    const movies = await fetchAPI('/movies');
    const dropdown = document.getElementById('showtime-movie');
    dropdown.innerHTML = '<option value="">-- Select a Movie --</option>';

    movies.forEach((movie) => {
      const option = document.createElement('option');
      option.value = movie.id;
      option.textContent = movie.title;
      dropdown.appendChild(option);
    });
  } catch (error) {
    showAlert('Failed to load movies');
  }
}

async function loadShowtimesList() {
  try {
    const showtimes = await fetchAPI('/showtimes');
    const container = document.getElementById('showtimes-list');
    container.innerHTML = '';

    if (showtimes.length === 0) {
      container.innerHTML = '<p>No showtimes yet. Create one!</p>';
      return;
    }

    showtimes.forEach((showtime) => {
      const showtimeItem = document.createElement('div');
      showtimeItem.classList.add('showtime-item');
      showtimeItem.innerHTML = `
        <div class="showtime-info">
          <h4>Movie ID: ${showtime.movie_id}</h4>
          <p>Theater: ${showtime.theater}</p>
          <p>Start Time: ${showtime.start_time}</p>
          <p>End Time: ${showtime.end_time}</p>
          <p>Price: $${showtime.price}</p>
          <p>Total Seats: ${showtime.total_seats}</p>
          <p>Available Seats: ${showtime.available_seats}</p>
        </div>
        <div class="actions">
          <button class="btn btn-warning btn-small" onclick="editShowtime(${showtime.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteShowtime(${showtime.id})">Delete</button>
        </div>
      `;
      container.appendChild(showtimeItem);
    });
  } catch (error) {
    showAlert('Failed to load showtimes');
  }
}

async function handleCreateShowtime(e) {
  e.preventDefault();

  const movie_id = parseInt(document.getElementById('showtime-movie').value);
  const theater = document.getElementById('showtime-theater').value;
  const start_time = document.getElementById('showtime-start').value;
  const end_time = document.getElementById('showtime-end').value;
  const price = parseFloat(document.getElementById('showtime-price').value);
  const total_seats = parseInt(
    document.getElementById('showtime-total-seats').value,
  );

  if (!movie_id) {
    showAlert('Please select a movie');
    return;
  }

  try {
    await fetchAPI('/showtimes', {
      method: 'POST',
      body: JSON.stringify({
        movie_id,
        theater,
        start_time,
        end_time,
        price,
        total_seats,
      }),
    });

    showAlert('Showtime created successfully!', 'success');
    e.target.reset();
    loadShowtimesList();
  } catch (error) {
    showAlert('Failed to create showtime: ' + error.message);
  }
}

async function deleteShowtime(showtimeId) {
  if (!confirm('Are you sure you want to delete this showtime?')) return;

  try {
    await fetchAPI(`/showtimes/${showtimeId}`, { method: 'DELETE' });
    showAlert('Showtime deleted successfully!', 'success');
    loadShowtimesList();
  } catch (error) {
    showAlert('Failed to delete showtime: ' + error.message);
  }
}

async function editShowtime(showtimeId) {
  try {
    const showtime = await fetchAPI(`/showtimes/${showtimeId}`);

    const newTheater = prompt('Enter new theater:', showtime.theater);
    if (!newTheater) return;

    const newStartTime = prompt(
      'Enter new start time (ISO format):',
      showtime.start_time,
    );
    if (!newStartTime) return;

    const newEndTime = prompt(
      'Enter new end time (ISO format):',
      showtime.end_time,
    );
    if (!newEndTime) return;

    const newPrice = prompt('Enter new price:', showtime.price);
    if (!newPrice) return;

    await fetchAPI(`/showtimes/${showtimeId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        theater: newTheater,
        start_time: newStartTime,
        end_time: newEndTime,
        price: parseFloat(newPrice),
      }),
    });

    showAlert('Showtime updated successfully!', 'success');
    loadShowtimesList();
  } catch (error) {
    showAlert('Failed to update showtime: ' + error.message);
  }
}

// ============================================================================
// BOOKINGS TAB
// ============================================================================

function initializeBookingsTab() {
  // Bookings are loaded when switching to the tab
}

async function loadBookingsList() {
  try {
    const bookings = await fetchAPI('/bookings');
    const container = document.getElementById('bookings-list');
    container.innerHTML = '';

    if (bookings.length === 0) {
      container.innerHTML = '<p>No bookings yet.</p>';
      return;
    }

    bookings.forEach((booking) => {
      const bookingItem = document.createElement('div');
      bookingItem.classList.add('booking-item');
      bookingItem.innerHTML = `
        <div class="booking-info">
          <h4>Booking ID: ${booking.id}</h4>
          <p>Customer: ${booking.customer_name}</p>
          <p>Email: ${booking.customer_email}</p>
          <p>Phone: ${booking.customer_phone}</p>
          <p>Showtime ID: ${booking.showtime_id}</p>
          <p>Seats: ${booking.seat_numbers.join(', ')}</p>
          <p>Total Amount: $${booking.total_amount}</p>
          <p>Status: ${booking.status}</p>
          <p>Booking Date: ${new Date(booking.booking_date).toLocaleString()}</p>
        </div>
        <div class="actions">
          <button class="btn btn-danger btn-small" onclick="deleteBooking(${booking.id})">Cancel</button>
        </div>
      `;
      container.appendChild(bookingItem);
    });
  } catch (error) {
    showAlert('Failed to load bookings');
  }
}

async function deleteBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    await fetchAPI(`/bookings/${bookingId}`, { method: 'DELETE' });
    showAlert('Booking cancelled successfully!', 'success');
    loadBookingsList();
  } catch (error) {
    showAlert('Failed to cancel booking: ' + error.message);
  }
}
