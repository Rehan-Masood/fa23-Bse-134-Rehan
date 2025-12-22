// ===== DYNAMIC MODALS =====
document.getElementById("auth-modals").innerHTML = `
<!-- Sign Up Modal -->
<div class="modal fade" id="signupModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-dark text-light">
      <div class="modal-header border-secondary">
        <h5 class="modal-title">Create an Account</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="signupForm">
          <div class="mb-3">
            <label for="signupEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="signupEmail" required />
          </div>
          <div class="mb-3">
            <label for="signupPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="signupPassword" required minlength="6" />
          </div>
          <div class="mb-3">
            <label for="signupConfirmPassword" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="signupConfirmPassword" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-warning w-100">Sign Up</button>
        </form>
      </div>
      <div class="modal-footer border-secondary">
        <p class="text-center w-100 mb-0">
          Already have an account?
          <a href="#" data-bs-toggle="modal" data-bs-target="#signinModal" data-bs-dismiss="modal" class="text-warning">Sign In</a>
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Sign In Modal -->
<div class="modal fade" id="signinModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-dark text-light">
      <div class="modal-header border-secondary">
        <h5 class="modal-title">Sign In</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="signinForm">
          <div class="mb-3">
            <label for="signinEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="signinEmail" required />
          </div>
          <div class="mb-3">
            <label for="signinPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="signinPassword" required />
          </div>
          <button type="submit" class="btn btn-warning w-100">Sign In</button>
        </form>
      </div>
      <div class="modal-footer border-secondary">
        <p class="text-center w-100 mb-0">
          Don’t have an account?
          <a href="#" data-bs-toggle="modal" data-bs-target="#signupModal" data-bs-dismiss="modal" class="text-warning">Sign Up</a>
        </p>
      </div>
    </div>
  </div>
</div>
`;
// ======= WALLPAPER PAGINATION SYSTEM =======

// Add your wallpaper image filenames here
const wallpapers = [
  "images/box1.webp", "images/box2.webp", "images/box3.webp", "images/box4.webp",
  "images/box5.webp", "images/box6.webp", "images/box7.webp", "images/box8.webp",
  "images/box9.webp", "images/box10.webp", "images/box11.webp", "images/box12.webp",
  "images/box13.webp", "images/box14.webp", "images/box15.webp", "images/box16.webp",
  "images/box17.jpg", "images/box18.jpg", "images/box19.jpg", "images/box20.jpg",
  "images/box21.jpg", "images/box22.jpg", "images/box23.jpg", "images/box24.jpg",
  "images/box25.jpeg", "images/box26.png", "images/box27.jpg", "images/box28.jpg",
  "images/box29.jpg", "images/box30.jpg", "images/box31.jpeg", "images/box32.jpg"
];

// Configuration
const wallpapersPerPage = 16;
let currentPage = 1;

// References
const wallpaperContainer = document.getElementById("wallpaperContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageIndicator = document.getElementById("pageIndicator");

// Render Wallpapers
function renderWallpapers() {
  wallpaperContainer.innerHTML = "";
  const startIndex = (currentPage - 1) * wallpapersPerPage;
  const endIndex = startIndex + wallpapersPerPage;
  const currentWallpapers = wallpapers.slice(startIndex, endIndex);

  currentWallpapers.forEach((wallpaper) => {
    const div = document.createElement("div");
    div.className = "col-6 col-md-4 col-lg-3";
    div.innerHTML = `
      <div class="wallpaper-box rounded" 
           style="background-image: url('${wallpaper}')"></div>
    `;
    wallpaperContainer.appendChild(div);
  });

  // Update pagination
  pageIndicator.textContent = `Page ${currentPage} of ${Math.ceil(wallpapers.length / wallpapersPerPage)}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = endIndex >= wallpapers.length;
}

// Handle Navigation
nextBtn.addEventListener("click", () => {
  if (currentPage * wallpapersPerPage < wallpapers.length) {
    currentPage++;
    renderWallpapers();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderWallpapers();
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", renderWallpapers);

// ===== AUTH LOGIC =====
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  // Sign Up
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const pass = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirmPassword").value;

    if (pass !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === email)) {
      alert("Email already registered!");
      return;
    }

    users.push({ email, pass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully!");

    signupForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
  });

  // Sign In
  signinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const pass = document.getElementById("signinPassword").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.email === email && u.pass === pass);
    if (user) {
      localStorage.setItem("loggedInUser", email);
      alert(`Welcome back, ${email}!`);
      signinForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("signinModal")).hide();

      const signInBtn = document.querySelector('.btn-outline-light');
      signInBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${email}`;
    } else {
      alert("Invalid credentials!");
    }
  });
});
