// document.addEventListener("DOMContentLoaded", () => {
//     const donorDetailsTable = document.getElementById("donor_details");
//     const searchInput = document.getElementById("donor-search");
//     const filterSelect = document.getElementById("blood-filter");

//     let allDonors = [];

//     const token = localStorage.getItem("token");

//     if (!token) {
//         alert("Please login first.");
//         window.location.href = "/login.html";
//         return;
//     }

// document.addEventListener("DOMContentLoaded", () => {
//   fetch("http://localhost:5000/api/donors/all")
//     .then(response => response.json())
//     .then(data => {
//       if (data.success && Array.isArray(data.requests)) {
//         const tbody = document.getElementById("donor_details");
//         tbody.innerHTML = "";

//         data.requests.forEach(donor => {
//           const row = `
//             <tr>
//               <td>${donor._id.$oid}</td>
//               <td>${donor.name}</td>
//               <td>${donor.bloodType}</td>
//               <td>${donor.location}</td>
//               <td>${donor.phone}</td>
//               <td>${donor.Eligibility}</td>
//             </tr>`;
//           tbody.innerHTML += row;
//         });
//       } else {
//         console.error("No donor data found.");
//       }
//     })
//     .catch(error => {
//       console.error("Error fetching donor data:", error);
//     });
// });


//     // Display donors in the table
//     function displayDonors(donors) {
//         if (donors.length === 0) {
//             donorDetailsTable.innerHTML = `<tr><td colspan="6">No donors found.</td></tr>`;
//             return;
//         }

//         donorDetailsTable.innerHTML = donors.map(donor => `
//             <tr>
//                 <td>${donor._id}</td>
//                 <td>${donor.name}</td>
//                 <td>${donor.blood_group}</td>
//                 <td>${donor.location}</td>
//                 <td>${donor.phone}</td>
//                 <td>${donor.eligible ? "Eligible" : "Not Eligible"}</td>
//             </tr>
//         `).join('');
//     }

//     // Filter and search logic
//     function applyFilters() {
//         const query = searchInput.value.toLowerCase();
//         const selectedBlood = filterSelect.value;

//         const filtered = allDonors.filter(donor => {
//             const matchesSearch = donor.name.toLowerCase().includes(query) ||
//                                   donor.blood_group.toLowerCase().includes(query) ||
//                                   donor.location.toLowerCase().includes(query);
//             const matchesBlood = selectedBlood === "" || donor.blood_group === selectedBlood;
//             return matchesSearch && matchesBlood;
//         });

//         displayDonors(filtered);
//     }

//     searchInput.addEventListener("input", applyFilters);
//     filterSelect.addEventListener("change", applyFilters);
// });
document.addEventListener("DOMContentLoaded", () => {
    const donorDetailsTable = document.getElementById("donor_details");
    const searchInput = document.getElementById("donor-search");
    const filterSelect = document.getElementById("blood-filter");

    let allDonors = [];

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "/login.html";
        return;
    }

    // Fetch donors from API
    fetch("http://localhost:5000/api/donors/all")
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.requests)) {
                // Save to allDonors for filtering
                allDonors = data.requests.map(donor => ({
                    id: donor._id.$oid,
                    name: donor.name,
                    bloodType: donor.bloodType,
                    location: donor.location,
                    phone: donor.phone,
                    last_donation_date: donor.last_donate
                }));

                displayDonors(allDonors);
            } else {
                donorDetailsTable.innerHTML = `<tr><td colspan="6">No donors found.</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Error fetching donor data:", error);
            donorDetailsTable.innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
        });

    // Display donors
    function displayDonors(donors) {
        if (donors.length === 0) {
            donorDetailsTable.innerHTML = `<tr><td colspan="6">No donors match your filter.</td></tr>`;
            return;
        }

        donorDetailsTable.innerHTML = donors.map(donor => `
            <tr>
                <td>${donor.id}</td>
                <td>${donor.name}</td>
                <td>${donor.bloodType}</td>
                <td>${donor.location}</td>
                <td>${donor.phone}</td>
                <td>${donor.last_donation_date}</td>
            </tr>
        `).join('');
    }

    // Filter and search logic
    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const selectedBlood = filterSelect.value;

        const filtered = allDonors.filter(donor => {
            const matchesSearch = donor.name.toLowerCase().includes(query) ||
                                  donor.bloodType.toLowerCase().includes(query) ||
                                  donor.location.toLowerCase().includes(query);
            const matchesBlood = selectedBlood === "" || donor.bloodType === selectedBlood;
            return matchesSearch && matchesBlood;
        });

        displayDonors(filtered);
    }

    // Events for filtering
    searchInput.addEventListener("input", applyFilters);
    filterSelect.addEventListener("change", applyFilters);
});
