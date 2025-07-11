document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const phone = document.querySelector("input[name='phone']").value;
    const password = document.querySelector("input[name='password']").value;
    const role = document.querySelector("select[name='role']").value;
  
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        password: password,
        role: role  // ✅ send role too
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert(data.message || "Login Successful ✅");
  
        // Optionally — role based redirect
        if (role === "Admin") {
          window.location.href = "admin_dashboard.html";
        } else if (role === "Donor") {
          window.location.href = "donor_dashboard.html";
        } else {
          window.location.href = "patient_dashboard.html";
        }
  
      } else {
        alert(data.error || "Login failed. Please check your credentials.");
      }
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
    
        if (data.role === "Donor" && !data.is_profile_complete) {
          window.location.href = "complete_profile.html";
        } else if (data.role === "Donor") {
          window.location.href = "donor_dashboard.html";
        }
        // likewise for Patient/Admin
      } else {
        alert(data.error || "Login failed. Check credentials.");
      }
    })
    
    .catch(err => {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    });
  });
  