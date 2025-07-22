document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.querySelector("select[name='role']").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  fetch("http://localhost:5000/api/auth/admin_reg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
     body: JSON.stringify({
      name: name,
      phone: phone,
      password: password,
      role: role
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message && data.message.toLowerCase().includes("registered")) {
        alert("Admin registered successfully");
      } else {
        alert("Registration failed");
        console.error(data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
});
