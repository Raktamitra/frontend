// Utility to get JWT token from localStorage
function getToken() {
    return localStorage.getItem("token");
  }
  
  // Show section and active button
  function showSection(id, button) {
    ['profile', 'form', 'history'].forEach(sec => {
      document.getElementById(sec).classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
  
    document.querySelectorAll('aside button').forEach(btn => btn.classList.remove('active-btn'));
    if (button) button.classList.add('active-btn');
    if (id === 'history') {
    fetchRequestHistory();   // <---- fetch history whenever history tab is opened
  }
  }
  
  // Global location storage
  let currentLocation = { lat: 0, lng: 0 };
  
  // Get user's current geolocation
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Location captured:", currentLocation);
        },
        (error) => {
          console.warn("Location access denied or unavailable. Using default coords.");
        }
      );
    } else {
      console.warn("Geolocation not supported by this browser.");
    }
  }
  
  // Show profile section by default
  window.onload = () => {
    showSection('profile', document.querySelector('aside button'));
    loadProfile();
    // loadRequestHistory();
    getLocation();
  };
  
  // Save profile locally
  function saveProfile() {
    const profileData = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      phone: document.getElementById("profilePhone").value,
      bloodGroup: document.getElementById("profileBlood").value
    };
    localStorage.setItem("patientProfile", JSON.stringify(profileData));
    alert("Profile saved locally!");
  }
  
  // Load profile into form
  function loadProfile() {
    const profile = JSON.parse(localStorage.getItem("patientProfile"));
    if (profile) {
      document.getElementById("profileName").value = profile.name;
      document.getElementById("profileEmail").value = profile.email;
      document.getElementById("profilePhone").value = profile.phone;
      document.getElementById("profileBlood").value = profile.bloodGroup;
    }
  }
  
  // Blood request form submission
  document.getElementById("requestForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = this;
  
    if (!form.bloodGroup.value || !form.hospitalName.value || !form.requestDate.value || !form.unitsNeeded.value) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const formData = {
      patient_name: document.getElementById("profileName").value || "Patient",
      blood_type: form.bloodGroup.value,
      units_needed: parseInt(form.unitsNeeded.value),
      lat: currentLocation.lat,
      lng: currentLocation.lng
    };
  
    fetch("http://localhost:5000/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.request_id) {
          alert("Blood request submitted successfully!");
          form.reset();
          fetchRequestHistory(); 
        } else {
          alert(data.error || "Request submission failed.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
  
  // Request History form submission (local)
  // document.getElementById("historyForm").addEventListener("submit", function (e) {
  //   e.preventDefault();
  //   const date = document.getElementById("reqDate").value;
  //   const group = document.getElementById("reqBlood").value;
  //   const status = document.getElementById("reqStatus").value;
  
  //   const entry = { date, group, status };
  //   let history = JSON.parse(localStorage.getItem("historyData")) || [];
  //   history.push(entry);
  //   localStorage.setItem("historyData", JSON.stringify(history));
  
  //   addHistoryRow(entry);
  //   this.reset();
  // });
  
  // Add row to history table
function fetchRequestHistory() {
  fetch("http://localhost:5000/api/requests/history", {
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const historyTable = document.getElementById("historyTable");
      historyTable.innerHTML = "";

      data.forEach(req => {
  const row = document.createElement("tr");

  const dateCell = document.createElement("td");
  dateCell.className = "border p-2";
  dateCell.textContent = new Date(req.created_at.$date).toLocaleDateString();

  const bloodCell = document.createElement("td");
  bloodCell.className = "border p-2";
  bloodCell.textContent = req.blood_type;

  const statusCell = document.createElement("td");
  statusCell.className = "border p-2";
  statusCell.textContent = req.status;

  const donorCell = document.createElement("td");
  donorCell.className = "border p-2";

  if (req.donors && req.donors.length > 0) {
    donorCell.innerHTML = req.donors.slice(0, 3).map(d => 
      `${d.name} (${d.phone})`
    ).join("<br>");
  } else {
    donorCell.textContent = "No donors yet";
  }

  row.appendChild(dateCell);
  row.appendChild(bloodCell);
  row.appendChild(statusCell);
  row.appendChild(donorCell);

  historyTable.appendChild(row);
   });

    })
    .catch(err => console.error("Failed to fetch history", err));
}


  
  // Load history from localStorage
  // function loadRequestHistory() {
  //   const history = JSON.parse(localStorage.getItem("historyData")) || [];
  //   history.forEach(addHistoryRow);
  // }