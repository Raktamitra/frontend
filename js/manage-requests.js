// let bloodRequests = []; // Declare globally

// fetch('http://localhost:5000/api/admin/requests')
//     .then(res => res.json())
//     .then(data => {
//         if (data.success) {
//     bloodRequests = data.requests;
//     renderBloodRequests(bloodRequests);
// } else {
//     console.error("Error loading requests:", data); // Inspect full data
// }
//     })
//     .catch(err => console.error('Fetch error:', err));
//  document.addEventListener('DOMContentLoaded', function() {
//             // Initialize admin.js functionality
//             if (typeof initAdmin === 'function') {
//                 initAdmin();
//   document          }
            
//             // Initialize manage-requests.js functionality
//             if (typeof initManageRequests === 'function') {
//                 initManageRequests();
//             }
//         });
// function renderBloodRequests(requests) {
//     const tableBody = document.getElementById("requests-table-body");
//  // Adjust selector as per your HTML
//     tableBody.innerHTML = "";

//     requests.forEach(request => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${request.id}</td>
//             <td>${request.patientName}</td>
//             <td>${request.bloodGroup}</td>
//             <td>${request.hospital}</td>
//             <td>${request.urgency}</td>
//             <td>${request.status}</td>
//             <td>${request.date}</td>
//             <td><button onclick="viewRequestDetails('${request.id}')">View</button></td>
//         `;
//         tableBody.appendChild(row);
//     });
// }

// fetch('http://localhost:5000/api/admin/requests')
//     .then(res => res.json())
//     .then(data => {
//         // Handle case where response is [data, status]
//         if (Array.isArray(data)) {
//             data = data[0]; // Extract actual data
//         }

//         if (data.success) {
//             bloodRequests = data.requests;
//             renderBloodRequests(bloodRequests);
//         } else {
//             console.error('Error loading requests:', data.message || data);
//         }
//     })
//     .catch(err => console.error('Fetch error:', err));

document.addEventListener('DOMContentLoaded', function () {
    // Initialize admin.js functionality
    if (typeof initAdmin === 'function') {
        initAdmin();
    }

    // Initialize manage-requests.js functionality
    if (typeof initManageRequests === 'function') {
        initManageRequests();
    }

    // Function to render blood requests
    function renderBloodRequests(requests) {
        const tableBody = document.getElementById("requests-table-body");
        if (!tableBody) {
            console.error("Table body element not found!");
            return;
        }

        tableBody.innerHTML = "";

        requests.forEach(request => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.patientName}</td>
                <td>${request.bloodGroup}</td>
                <td>${request.hospital}</td>
                <td>${request.urgency}</td>
                <td>${request.status}</td>
                <td>${request.date}</td>
                <td><button onclick="viewRequestDetails('${request.id}')">View</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fetch and render blood requests
    //     fetch('http://localhost:5000/api/admin/requests')
    //         .then(res => res.json())
    //         .then(data => {
    //             if (Array.isArray(data)) {
    //                 data = data[0]; // Optional: if your backend sends [data, status]
    //             }

    //             if (data.success) {
    //                 const bloodRequests = data.requests;
    //                 renderBloodRequests(bloodRequests);
    //             } else {
    //                 console.error('Error loading requests:', data.message || data);
    //             }
    //         })
    //         .catch(err => console.error('Fetch error:', err));
    // });

    let allRequests = []; // store requests for filtering
    fetch('http://localhost:5000/api/admin/requests')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                data = data[0]; // Optional if backend sends [data, status]
            }

            if (data.success) {
                allRequests = data.requests;
                renderBloodRequests(allRequests); // initial render
            } else {
                console.error('Error loading requests:', data.message || data);
            }
        })
        .catch(err => console.error('Fetch error:', err));

    // Apply search and filter
    function applySearchAndFilter() {
        const searchQuery = document.getElementById("request-search").value.toLowerCase();
        const selectedStatus = document.getElementById("status-filter").value.toLowerCase();

        const filtered = allRequests.filter(req => {
            const matchesSearch = req.patientName.toLowerCase().includes(searchQuery) ||
                req.bloodGroup.toLowerCase().includes(searchQuery) ||
                req.hospital.toLowerCase().includes(searchQuery);

            const matchesStatus = selectedStatus === 'all' || req.status.toLowerCase() === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        renderBloodRequests(filtered);
    }

    // Event listeners for search and filter
    document.getElementById("search-btn").addEventListener("click", applySearchAndFilter);
    document.getElementById("filter-btn").addEventListener("click", applySearchAndFilter);

    // Optional: Enter key triggers search
    document.getElementById("request-search").addEventListener("keyup", function (e) {
        if (e.key === "Enter") applySearchAndFilter();
    });
});
