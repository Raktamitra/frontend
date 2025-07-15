function setRole(role) {
  selectedRole = role;
  const roles = ['patient', 'donor'];
  roles.forEach(r => {
    document.getElementById('tab-' + r).classList.remove(
      'bg-orange-100', 'bg-yellow-100', 'text-orange-600', 'text-yellow-700', 'text-orange-700'
    );
  });

  const tab = document.getElementById('tab-' + role.toLowerCase());
  if (role === 'Donor') {
    tab.classList.add('bg-orange-100', 'text-orange-700');
  } else {
    tab.classList.add('bg-orange-100', 'text-orange-600');
  }
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const role = document.querySelector("select[name='role']").value; // ✅ get from select now
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        phone: phone,
        password: password,
        role: role  // ✅ use value from select
      })
    })
      .then(response => {
        if (response.status === 201) {
          alert("Account created successfully!");
          window.location.href = "/login.html";
        } else {
          return response.json();
        }
      })
      .then(data => {
        if (data && data.error) {
          alert(data.error);
        } else if (data && data.message) {
          alert(data.message);
        }
      })
  
      .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
  