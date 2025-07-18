document.addEventListener('DOMContentLoaded', function() {
    // Mock data for donor responses
    const donorResponses = [
        {
            requestId: 'BR-1001',
            donorName: 'John Smith',
            bloodGroup: 'A+',
            phone: '555-0101',
            response: 'Accepted',
            timestamp: '2023-06-15 10:30 AM',
            status: 'Scheduled'
        },
        {
            requestId: 'BR-1001',
            donorName: 'Sarah Johnson',
            bloodGroup: 'B-',
            phone: '555-0102',
            response: 'Declined',
            timestamp: '2023-06-15 11:15 AM',
            reason: 'Not available'
        },
        {
            requestId: 'BR-1002',
            donorName: 'Michael Brown',
            bloodGroup: 'O+',
            phone: '555-0103',
            response: 'Accepted',
            timestamp: '2023-06-14 09:45 AM',
            status: 'Completed'
        },
        {
            requestId: 'BR-1003',
            donorName: 'Emily Davis',
            bloodGroup: 'AB+',
            phone: '555-0104',
            response: 'Pending',
            timestamp: '2023-06-14 02:20 PM'
        },
        {
            requestId: 'BR-1004',
            donorName: 'Robert Wilson',
            bloodGroup: 'A-',
            phone: '555-0105',
            response: 'Accepted',
            timestamp: '2023-06-13 04:10 PM',
            status: 'Cancelled'
        },
        {
            requestId: 'BR-1005',
            donorName: 'Lisa White',
            bloodGroup: 'O-',
            phone: '555-0106',
            response: 'Declined',
            timestamp: '2023-06-12 03:45 PM',
            reason: 'Medical reasons'
        }
    ];

    // Function to render donor responses
    function renderDonorResponses(responses) {
        const tbody = document.getElementById('responsesTableBody');
        tbody.innerHTML = ''; // Clear existing rows
        
        responses.forEach(response => {
            const row = document.createElement('tr');
            
            // Determine response color
            let responseClass = '';
            if (response.response === 'Accepted') responseClass = 'status-accepted';
            else if (response.response === 'Declined') responseClass = 'status-declined';
            else if (response.response === 'Pending') responseClass = 'status-pending';
            
            row.innerHTML = `
                <td>${response.requestId}</td>
                <td>${response.donorName}</td>
                <td>${response.bloodGroup}</td>
                <td>${response.phone}</td>
                <td><span class="status-badge ${responseClass}">${response.response}</span></td>
                <td>${response.timestamp}</td>
                <td>
                    <button class="btn-view" data-id="${response.requestId}" data-donor="${response.donorName}">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                const donorName = this.getAttribute('data-donor');
                viewResponseDetails(requestId, donorName);
            });
        });
    }
    
    // Function to view response details
    function viewResponseDetails(requestId, donorName) {
        // Find the response in our mock data
        const response = donorResponses.find(res => 
            res.requestId === requestId && res.donorName === donorName
        );
        
        if (response) {
            // Create modal HTML
            const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal">
                        <div class="modal-header">
                            <h3>Response Details</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="detail-row">
                                <span class="detail-label">Request ID:</span>
                                <span class="detail-value">${response.requestId}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Donor Name:</span>
                                <span class="detail-value">${response.donorName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Blood Group:</span>
                                <span class="detail-value">${response.bloodGroup}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Phone:</span>
                                <span class="detail-value">${response.phone}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Response:</span>
                                <span class="detail-value ${response.response.toLowerCase()}">${response.response}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Timestamp:</span>
                                <span class="detail-value">${response.timestamp}</span>
                            </div>
                            ${response.reason ? `
                            <div class="detail-row">
                                <span class="detail-label">Decline Reason:</span>
                                <span class="detail-value">${response.reason}</span>
                            </div>
                            ` : ''}
                            ${response.status ? `
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value ${response.status.toLowerCase()}">${response.status}</span>
                            </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary close-modal">Close</button>
                            ${response.response === 'Accepted' && response.status !== 'Completed' && response.status !== 'Cancelled' ? `
                                <button class="btn-primary update-status" data-id="${response.requestId}" data-donor="${response.donorName}">
                                    ${response.status === 'Scheduled' ? 'Mark as Completed' : 'Update Status'}
                                </button>
                            ` : ''}
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
            
            // Add event listener for update status button if it exists
            const updateBtn = document.querySelector('.update-status');
            if (updateBtn) {
                updateBtn.addEventListener('click', function() {
                    updateDonationStatus(requestId, donorName);
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
    
    // Function to update donation status
    function updateDonationStatus(requestId, donorName) {
        // In a real app, this would call an API
        const responseIndex = donorResponses.findIndex(res => 
            res.requestId === requestId && res.donorName === donorName
        );
        
        if (responseIndex !== -1) {
            if (donorResponses[responseIndex].status === 'Scheduled') {
                donorResponses[responseIndex].status = 'Completed';
            }
            
            // Re-render table
            renderDonorResponses(donorResponses);
            
            // Close modal
            closeModal();
            
            // Show success message
            alert(`Donation status updated successfully for ${donorName}!`);
        }
    }
    
    // Filter functionality
    document.getElementById('applyFilters').addEventListener('click', function() {
        const statusFilter = document.getElementById('responseStatus').value;
        const requestIdFilter = document.getElementById('requestId').value.toLowerCase();
        
        let filteredResponses = donorResponses;
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filteredResponses = filteredResponses.filter(response => 
                response.response.toLowerCase() === statusFilter
            );
        }
        
        // Apply request ID filter
        if (requestIdFilter) {
            filteredResponses = filteredResponses.filter(response => 
                response.requestId.toLowerCase().includes(requestIdFilter)
            );
        }
        
        renderDonorResponses(filteredResponses);
    });
    
    // Reset filters
    document.getElementById('resetFilters').addEventListener('click', function() {
        document.getElementById('responseStatus').value = 'all';
        document.getElementById('requestId').value = '';
        renderDonorResponses(donorResponses);
    });
    
    // Initialize the page
    renderDonorResponses(donorResponses);
});