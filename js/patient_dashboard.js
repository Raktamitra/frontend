document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:5000"; // Change if backend runs on a different port
  const token = localStorage.getItem("token");
  const map = L.map('map').setView([20.5937, 78.9629], 5);
  
  // Check authentication
  if (!token) {
    showToast("Please login to access the dashboard", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let marker;

  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
  });

  // DOM Elements
  const updateBtn = document.getElementById("update-profile-btn");
  const requestForm = document.getElementById("requestForm");
  const refreshHistoryBtn = document.getElementById("refresh-history");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const loadingIndicator = document.getElementById("loading");

  // Initialize variables
  let currentPage = 1;
  let totalPages = 1;

  // Event Listeners
  if (updateBtn) updateBtn.addEventListener("click", updateProfile);
  if (requestForm) requestForm.addEventListener("submit", handleBloodRequest);
  if (refreshHistoryBtn) refreshHistoryBtn.addEventListener("click", fetchRequestHistory);
  if (prevPageBtn) prevPageBtn.addEventListener("click", () => changePage(-1));
  if (nextPageBtn) nextPageBtn.addEventListener("click", () => changePage(1));

  // Initial data loading
  Promise.all([
    fetchProfile(),
    fetchRequestHistory()
  ]).catch(err => {
    console.error("Initial data loading error:", err);
    showToast("Failed to load initial data", "error");
  });

  // ================================
  // 📌 Helper Functions
  // ================================
  
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
  
  function showLoading(show = true) {
    loadingIndicator.classList.toggle("hidden", !show);
  }
  
  async function fetchWithAuth(url, options = {}) {
    showLoading(true);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      showToast(error.message || "An error occurred", "error");
      throw error;
    } finally {
      showLoading(false);
    }
  }

  // ================================
  // 📌 Profile Functions
  // ================================
  
  async function fetchProfile() {
    try {
      const data = await fetchWithAuth(`${BASE_URL}/api/auth/profile`);
      
      // Fill form fields
      document.getElementById("profileName").value = data.name || "";
      document.getElementById("profileEmail").value = data.email || "";
      document.getElementById("profilePhone").value = data.phone || "";
      document.getElementById("profileAge").value = data.age || "";
      document.getElementById("profileDOB").value = data.dob ? data.dob.split('T')[0] : "";
      document.getElementById("profileGender").value = data.gender || "";
      document.getElementById("profileBlood").value = data.bloodGrp || "";
      document.getElementById("profileAddress").value = data.address || "";
      document.getElementById("profileCity").value = data.city || "";
      document.getElementById("profileState").value = data.state || "";
      document.getElementById("profilePincode").value = data.pincode || "";
      
    } catch (error) {
      // Error already handled in fetchWithAuth
    }
  }
  
  async function updateProfile() {
    const updateText = document.getElementById("update-text");
    const updateSpinner = document.getElementById("update-spinner");
    
    try {
      // Show loading state
      updateText.textContent = "Saving...";
      updateSpinner.classList.remove("hidden");
      updateBtn.disabled = true;
      
      const latlng = await getLocation();
      
      const profileData = {
        name: document.getElementById("profileName").value,
        email: document.getElementById("profileEmail").value,
        age: document.getElementById("profileAge").value,
        dob: document.getElementById("profileDOB").value,
        gender: document.getElementById("profileGender").value,
        bloodGrp: document.getElementById("profileBlood").value,
        address: document.getElementById("profileAddress").value,
        city: document.getElementById("profileCity").value,
        state: document.getElementById("profileState").value,
        pincode: document.getElementById("profilePincode").value,
        lat: latlng.latitude,
        lng: latlng.longitude
      };
      
      await fetchWithAuth(`${BASE_URL}/api/auth/profile`, {
        method: "PUT",
        body: JSON.stringify(profileData)
      });
      
      showToast("Profile updated successfully");
    } catch (error) {
      // Error already handled in fetchWithAuth
    } finally {
      updateText.textContent = "Save Profile";
      updateSpinner.classList.add("hidden");
      updateBtn.disabled = false;
    }
  }
  
  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve({ latitude: null, longitude: null });
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve({ latitude: null, longitude: null }),
        { timeout: 5000 }
      );
    });
  }

  // ================================
  // 📌 Blood Request Functions
  // ================================
  
  async function handleBloodRequest(e) {
    e.preventDefault();
    
    const submitText = document.getElementById("submit-text");
    const submitSpinner = document.getElementById("submit-spinner");
    const lat = parseFloat(document.getElementById("latitude").value);
    const lng = parseFloat(document.getElementById("longitude").value);

    if (!lat || !lng) {
      showToast("Please select a location on the map", "error");
      return;
    }
    
    try {
      // Show loading state
      submitText.textContent = "Submitting...";
      submitSpinner.classList.remove("hidden");
      e.target.querySelector("button[type='submit']").disabled = true;
      
      const formData = new FormData(e.target);
      const requestData = {
        blood_type: formData.get("bloodGroup"),
        units_needed: parseInt(formData.get("unitsNeeded")),
        hospital_name: formData.get("hospitalName"),
        hospital_phone: formData.get("hospitalContact"),
        lat: lat,
        lng: lng,
        urgency: formData.get("urgency"),
        notes: formData.get("notes")
      };
      
      await fetchWithAuth(`${BASE_URL}/api/requests`, {
        method: "POST",
        body: JSON.stringify(requestData)
      });
      
      showToast("Blood request submitted successfully");
      e.target.reset();
      fetchRequestHistory();
    } catch (error) {
      // Error already handled in fetchWithAuth
    } finally {
      submitText.textContent = "Submit Request";
      submitSpinner.classList.add("hidden");
      e.target.querySelector("button[type='submit']").disabled = false;
    }
  }

  // ================================
  // 📌 Request History Functions
  // ================================
  
  async function fetchRequestHistory(page = 1) {
    try {
      const data = await fetchWithAuth(`${BASE_URL}/api/requests/history?page=${page}`);
      
      currentPage = data.currentPage || 1;
      totalPages = data.totalPages || 1;
      console.log(data)
      
      renderRequestHistory(data.requests);
      updatePaginationControls();
    } catch (error) {
      // Error already handled in fetchWithAuth
    }
  }
  
  function renderRequestHistory(requests) {
    const historyTable = document.getElementById("historyTable");
    
    if (!requests || requests.length === 0) {
      historyTable.innerHTML = `
        <tr>
          <td colspan="7" class="text-center p-4">No request history found</td>
        </tr>
      `;
      return;
    }
    
    historyTable.innerHTML = requests.map(request => `
      <tr class="hover:bg-gray-50">
        <td class="border p-2">${request.requestId || 'N/A'}</td>
        <td class="border p-2">${new Date(request.requestDate).toLocaleDateString()}</td>
        <td class="border p-2">${request.bloodGroup}</td>
        <td class="border p-2">${request.unitsNeeded}</td>
        <td class="border p-2">${request.hospitalName}</td>
        <td class="border p-2">
          <span class="px-2 py-1 rounded-full text-xs 
            ${request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}">
            ${request.status}
          </span>
        </td>
        <td class="border p-2 text-center">
          <button class="text-blue-600 hover:text-blue-800" onclick="viewRequestDetails('${request._id}')">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }
  
  function updatePaginationControls() {
    document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
  }
  
  function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage > 0 && newPage <= totalPages) {
      fetchRequestHistory(newPage);
    }
  }
  
  // Expose function to global scope for inline event handlers
  window.viewRequestDetails = (requestId) => {
    // Implement request details view
    showToast(`Viewing details for request ${requestId}`, "info");
  };
});