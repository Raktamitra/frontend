
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "http://localhost:5000";
    const token = localStorage.getItem("token");
    const profileForm = document.getElementById("profileForm");
    const toast = document.getElementById("toast");
    const loading = document.getElementById("loading");
    const updateBtn = document.getElementById("update-profile-btn");
    const updateText = document.getElementById("update-text");
    const updateSpinner = document.getElementById("update-spinner");
    const profilePhotoInput = document.getElementById("profilePhotoInput");
    const profileImage = document.getElementById("profileImage");
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const completionBar = document.getElementById("completionBar");
    const completionPercent = document.getElementById("completionPercent");
    const locationText = document.getElementById("locationText");
    const locationLat = document.getElementById("locationLat");
    const locationLng = document.getElementById("locationLng");

    // Initialize map with a more centered view
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add geocoder control for location search
    const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    position: 'topright',
    placeholder: 'Search location...',
    errorMessage: 'Location not found'
    }).addTo(map);

    // Custom marker icon
    const redIcon = L.divIcon({
    className: 'location-marker',
    iconSize: [24, 24]
    });

    let marker = null;

    // Handle map clicks to set location
    map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    
    // Remove existing marker if any
    if (marker) {
        map.removeLayer(marker);
    }
    
    // Add new marker
    marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
    
    // Update form fields
    locationLat.value = lat.toFixed(6);
    locationLng.value = lng.toFixed(6);
    
    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
        const address = data.display_name || "Selected location";
        locationText.textContent = address;
        })
        .catch(() => {
        locationText.textContent = `Location selected at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        });
    });

    // Handle geocoder results
    geocoder.on('markgeocode', function(e) {
    const { center, name } = e.geocode;
    map.setView(center, 15);
    
    // Simulate click to set marker
    map.fire('click', {
        latlng: center
    });
    });

    // Change photo button
    changePhotoBtn.addEventListener("click", () => {
    profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
        profileImage.src = event.target.result;
        updateCompletion(5); // Add 5% for photo upload
        };
        reader.readAsDataURL(file);
    }
    });

    // Form field change listeners for completion calculation
    const formFields = profileForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
    field.addEventListener('change', () => {
        calculateCompletion();
    });
    });

    // Calculate profile completion percentage
    function calculateCompletion() {
    let completedFields = 0;
    const totalFields = [...formFields].filter(f => f.required).length + 1;
    
    formFields.forEach(field => {
        if (field.required && field.value.trim() !== '') {
        completedFields++;
        }
    });
    
    // Check if location is selected
    if (locationLat.value && locationLng.value) {
        completedFields++;
    }
    
    const percent = Math.min(100, Math.round((completedFields / totalFields) * 100));
    updateCompletion(percent);
    }

    // Update completion UI
    function updateCompletion(percent) {
    completionBar.style.width = `${percent}%`;
    completionPercent.textContent = percent;
    
    // Change color based on completion
    if (percent < 30) {
        completionBar.classList.remove('bg-yellow-500', 'bg-green-500');
        completionBar.classList.add('bg-red-500');
    } else if (percent < 80) {
        completionBar.classList.remove('bg-red-500', 'bg-green-500');
        completionBar.classList.add('bg-yellow-500');
    } else {
        completionBar.classList.remove('bg-red-500', 'bg-yellow-500');
        completionBar.classList.add('bg-green-500');
    }
    }

    // Form submission
    profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validate location selection
    if (!locationLat.value || !locationLng.value) {
        showToast("Please select your preferred donation location on the map", "error");
        return;
    }

    updateText.textContent = "Saving...";
    updateSpinner.classList.remove("hidden");
    updateBtn.disabled = true;
    loading.classList.remove("hidden");

    const profileData = {
        name: document.getElementById("profileName").value,
        email: document.getElementById("profileEmail").value,
        age: document.getElementById("profileAge").value,
        dob: document.getElementById("profileDOB").value,
        gender: document.getElementById("profileGender").value,
        bloodGrp: document.getElementById("profileBlood").value,
        lastDonated: document.getElementById("profileLastDonated").value || null,
        totalDonations: 0,
        address: document.getElementById("profileAddress").value,
        city: document.getElementById("profileCity").value,
        state: document.getElementById("profileState").value,
        pincode: document.getElementById("profilePincode").value,
        lat: locationLat.value,
        lng: locationLng.value
    };

    // Validate last donation date if provided
    const lastDonatedInput = document.getElementById("profileLastDonated");
    if (lastDonatedInput.value) {
        const lastDonationDate = new Date(lastDonatedInput.value);
        const today = new Date();
        
        if (lastDonationDate > today) {
            showToast("Last donation date cannot be in the future", "error");
            return;
        }
        
        // Validate minimum age
        const dob = new Date(document.getElementById("profileDOB").value);
        const ageAtDonation = lastDonationDate.getFullYear() - dob.getFullYear();
        if (ageAtDonation < 18) {
            showToast("You must have been at least 18 years old when you donated", "error");
            return;
        }
    }

    try {
        await fetch(`${BASE_URL}/api/auth/profile`, {
            method: "PUT",
            body: JSON.stringify(profileData),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        showToast("Profile completed successfully!", "success");
        
        // Redirect to donor dashboard after delay
        setTimeout(() => {
        window.location.href = "donor_dashboard.html";
        }, 1500);
    } catch (error) {
        showToast("Failed to save profile. Please try again.", "error");
        updateText.textContent = "Complete Profile";
        updateSpinner.classList.add("hidden");
        updateBtn.disabled = false;
        loading.classList.add("hidden");
    }
    });

    // Toast function
    function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
    }

    // Initialize completion calculation
    calculateCompletion();
});