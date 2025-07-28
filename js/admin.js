function renderActivity(activities) {
  const activityList = document.querySelector(".activity-list");
  activityList.innerHTML = ""; // Clear previous items

  activities.forEach((item) => {
    const div = document.createElement("div");
    div.className = "activity-item";

    div.innerHTML = `
      <div class="activity-icon">
        <i class="fas fa-bell"></i>
      </div>
      <div class="activity-details">
        <p>${item.message}</p>
        <span class="activity-time">${item.time_ago}</span>
      </div>
    `;

    activityList.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in.");
        window.location.href = "/login.html";
        return;
    }

    // Fetch Dashboard Stats
    fetch("http://localhost:5000/api/admin/dashboard", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const requiredFields = ['totalDonors', 'totalRequests', 'pendingRequests', 'totalPatients'];
        const hasAllFields = requiredFields.every(field => data.hasOwnProperty(field));

        if (!hasAllFields) throw new Error("Incomplete data received");

        document.getElementById('total-donors').textContent = data.totalDonors.toLocaleString();
        document.getElementById('total-requests').textContent = data.totalRequests.toLocaleString();
        document.getElementById('pending-requests').textContent = data.pendingRequests;
        document.getElementById('total-patients').textContent = data.totalPatients.toLocaleString();
    })
    .catch(error => {
        console.error("Error loading dashboard data:", error);
        alert("Unable to load dashboard stats.");
    });

    // Fetch Recent Activity
    fetch("http://localhost:5000/api/admin/recent-activity", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => renderActivity(data))
    .catch(err => {
        console.error("Error fetching activity:", err);
        document.querySelector(".activity-list").innerHTML = "<p>Unable to load recent activity</p>";
    });

    // Highlight current page in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.admin-nav a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref) {
            link.parentElement.classList.add('active');
        }
    });
});



