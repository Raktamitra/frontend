// Play click sound and navigate to login
  document.getElementById("get-started-btn").addEventListener("click", () => {
    const audio = document.getElementById("click-sound");
    audio.play();
  
    // Optional API call example before redirect:
    fetch("http://localhost:5000/")
      .then(response => response.json())
      .then(data => {
        console.log("Backend says:", data.message);
        // after success, navigate
        setTimeout(() => {
          window.location.href = "login.html";
        }, 500);
      })
      .catch(error => {
        console.error("API call failed:", error);
        alert("Backend is down or unreachable.");
      });
  });
  
  