document.addEventListener('DOMContentLoaded', function() {
    // Mock data for blood requests
    const bloodRequests = [
        {
            id: 'BR-1001',
            patientName: 'John Smith',
            bloodGroup: 'A+',
            hospital: 'City General Hospital',
            urgency: 'High',
            status: 'Pending',
            date: '2023-06-15'
        },
        {
            id: 'BR-1002',
            patientName: 'Sarah Johnson',
            bloodGroup: 'B-',
            hospital: 'Metro Medical Center',
            urgency: 'Medium',
            status: 'In Progress',
            date: '2023-06-14'
        },
        {
            id: 'BR-1003',
            patientName: 'Michael Brown',
            bloodGroup: 'O+',
            hospital: 'University Hospital',
            urgency: 'High',
            status: 'Pending',
            date: '2023-06-14'
        },
        {
            id: 'BR-1004',
            patientName: 'Emily Davis',
            bloodGroup: 'AB+',
            hospital: 'Children\'s Hospital',
            urgency: 'Low',
            status: 'Completed',
            date: '2023-06-13'
        },
        {
            id: 'BR-1005',
            patientName: 'Robert Wilson',
            bloodGroup: 'A-',
            hospital: 'Veterans Medical',
            urgency: 'High',
            status: 'In Progress',
            date: '2023-06-12'
        }
    ];

    // Function to render blood requests table
    function renderBloodRequests(requests) {
        const tbody = document.querySelector('.data-table tbody');
        tbody.innerHTML = ''; // Clear existing rows
        
        requests.forEach(request => {
            const row = document.createElement('tr');
            
            // Determine status color
            let statusClass = '';
            if (request.status === 'Pending') statusClass = 'status-pending';
            else if (request.status === 'In Progress') statusClass = 'status-in-progress';
            else if (request.status === 'Completed') statusClass = 'status-completed';
            
            // Determine urgency color
            let urgencyClass = '';
            if (request.urgency === 'High') urgencyClass = 'urgency-high';
            else if (request.urgency === 'Medium') urgencyClass = 'urgency-medium';
            else if (request.urgency === 'Low') urgencyClass = 'urgency-low';
            
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.patientName}</td>
                <td>${request.bloodGroup}</td>
                <td>${request.hospital}</td>
                <td><span class="urgency-badge ${urgencyClass}">${request.urgency}</span></td>
                <td><span class="status-badge ${statusClass}">${request.status}</span></td>
                <td>
                    <button class="btn-view" data-id="${request.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                viewRequestDetails(requestId);
            });
        });
    }
    
    // Function to view request details
    function viewRequestDetails(requestId) {
        // In a real app, this would fetch details from an API
        const request = bloodRequests.find(req => req.id === requestId);
        
        if (request) {
            // Create modal HTML
            const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal">
                        <div class="modal-header">
                            <h3>Request Details: ${requestId}</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="detail-row">
                                <span class="detail-label">Patient Name:</span>
                                <span class="detail-value">${request.patientName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Blood Group:</span>
                                <span class="detail-value">${request.bloodGroup}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Hospital:</span>
                                <span class="detail-value">${request.hospital}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Urgency:</span>
                                <span class="detail-value ${request.urgency.toLowerCase()}">${request.urgency}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value ${request.status.toLowerCase().replace(' ', '-')}">${request.status}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">${request.date}</span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary close-modal">Close</button>
                            ${request.status !== 'Completed' ? 
                                `<button class="btn-primary update-status" data-id="${requestId}">
                                    ${request.status === 'Pending' ? 'Start Processing' : 'Mark as Completed'}
                                </button>` : ''
                            }
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Add event listeners for modal
            document.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', closeModal);
            });
            
            // Add event listener for update status button
            const updateBtn = document.querySelector('.update-status');
            if (updateBtn) {
                updateBtn.addEventListener('click', function() {
                    updateRequestStatus(requestId);
                });
            }
        }
    }
    
    // Function to close modal
    function closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    // Function to update request status
    function updateRequestStatus(requestId) {
        // In a real app, this would call an API
        const requestIndex = bloodRequests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            if (bloodRequests[requestIndex].status === 'Pending') {
                bloodRequests[requestIndex].status = 'In Progress';
            } else if (bloodRequests[requestIndex].status === 'In Progress') {
                bloodRequests[requestIndex].status = 'Completed';
            }
            
            // Re-render table
            renderBloodRequests(bloodRequests);
            
            // Close modal
            closeModal();
            
            // Show success message
            alert(`Request ${requestId} status updated successfully!`);
        }
    }
    
    // Initialize the page
    renderBloodRequests(bloodRequests);
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredRequests = bloodRequests.filter(request => 
                request.patientName.toLowerCase().includes(searchTerm) || 
                request.id.toLowerCase().includes(searchTerm) ||
                request.hospital.toLowerCase().includes(searchTerm)
            );
            renderBloodRequests(filteredRequests);
        } else {
            renderBloodRequests(bloodRequests);
        }
    });
    
    // Filter functionality
    const filterButton = document.querySelector('.filter-options .btn-primary');
    filterButton.addEventListener('click', function() {
        const statusFilter = document.querySelector('.filter-options select').value;
        let filteredRequests = [];
        
        if (statusFilter === 'all') {
            filteredRequests = bloodRequests;
        } else if (statusFilter === 'pending') {
            filteredRequests = bloodRequests.filter(request => request.status === 'Pending');
        } else if (statusFilter === 'in-progress') {
            filteredRequests = bloodRequests.filter(request => request.status === 'In Progress');
        } else if (statusFilter === 'completed') {
            filteredRequests = bloodRequests.filter(request => request.status === 'Completed');
        }
        
        renderBloodRequests(filteredRequests);
    });
});