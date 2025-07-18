document.addEventListener('DOMContentLoaded', function() {
    // Mock data for blood units
    const bloodUnits = [
        { bloodGroup: 'A+', availableUnits: 35, criticalLevel: 10, lastUpdate: '2023-06-15 09:30 AM' },
        { bloodGroup: 'A-', availableUnits: 12, criticalLevel: 5, lastUpdate: '2023-06-15 10:15 AM' },
        { bloodGroup: 'B+', availableUnits: 28, criticalLevel: 10, lastUpdate: '2023-06-14 03:45 PM' },
        { bloodGroup: 'B-', availableUnits: 8, criticalLevel: 5, lastUpdate: '2023-06-14 04:20 PM' },
        { bloodGroup: 'AB+', availableUnits: 15, criticalLevel: 5, lastUpdate: '2023-06-13 11:10 AM' },
        { bloodGroup: 'AB-', availableUnits: 3, criticalLevel: 2, lastUpdate: '2023-06-13 02:30 PM' },
        { bloodGroup: 'O+', availableUnits: 42, criticalLevel: 15, lastUpdate: '2023-06-15 08:45 AM' },
        { bloodGroup: 'O-', availableUnits: 9, criticalLevel: 5, lastUpdate: '2023-06-14 05:15 PM' }
    ];

    // Mock data for recent donations
    const recentDonations = [
        { id: 'DN-1001', donorName: 'John Smith', bloodGroup: 'A+', unit: 'City General', date: '2023-06-15', status: 'Processed' },
        { id: 'DN-1002', donorName: 'Sarah Johnson', bloodGroup: 'B-', unit: 'Metro Medical', date: '2023-06-15', status: 'Processed' },
        { id: 'DN-1003', donorName: 'Michael Brown', bloodGroup: 'O+', unit: 'University', date: '2023-06-14', status: 'Stored' },
        { id: 'DN-1004', donorName: 'Emily Davis', bloodGroup: 'AB+', unit: 'Children\'s', date: '2023-06-14', status: 'Tested' },
        { id: 'DN-1005', donorName: 'Robert Wilson', bloodGroup: 'A-', unit: 'Veterans', date: '2023-06-13', status: 'Processed' }
    ];

    // Function to render blood units table
    function renderBloodUnits() {
        const tbody = document.getElementById('unitsTableBody');
        tbody.innerHTML = ''; // Clear existing rows
        
        let totalUnits = 0;
        let criticalUnits = 0;
        
        bloodUnits.forEach(unit => {
            const row = document.createElement('tr');
            
            // Check if unit is at or below critical level
            const isCritical = unit.availableUnits <= unit.criticalLevel;
            if (isCritical) criticalUnits++;
            
            totalUnits += unit.availableUnits;
            
            row.innerHTML = `
                <td>${unit.bloodGroup}</td>
                <td>${unit.availableUnits}</td>
                <td>${unit.criticalLevel}</td>
                <td>${unit.lastUpdate}</td>
                <td>
                    <span class="status-badge ${isCritical ? 'status-critical' : 'status-ok'}">
                        ${isCritical ? 'Critical' : 'OK'}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Update summary cards
        document.getElementById('total-units').textContent = totalUnits;
        document.getElementById('critical-units').textContent = criticalUnits;
        
        // Calculate expiring soon units (mock)
        const expiringSoon = Math.floor(totalUnits * 0.08); // ~8% of total
        document.getElementById('expiring-units').textContent = expiringSoon;
    }
    
    // Function to render recent donations
    function renderRecentDonations() {
        const tbody = document.getElementById('donationsTableBody');
        tbody.innerHTML = ''; // Clear existing rows
        
        recentDonations.forEach(donation => {
            const row = document.createElement('tr');
            
            // Determine status color
            let statusClass = '';
            if (donation.status === 'Processed') statusClass = 'status-completed';
            else if (donation.status === 'Stored') statusClass = 'status-in-progress';
            else if (donation.status === 'Tested') statusClass = 'status-pending';
            
            row.innerHTML = `
                <td>${donation.id}</td>
                <td>${donation.donorName}</td>
                <td>${donation.bloodGroup}</td>
                <td>${donation.unit}</td>
                <td>${donation.date}</td>
                <td><span class="status-badge ${statusClass}">${donation.status}</span></td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Refresh button functionality
    document.getElementById('refreshUnits').addEventListener('click', function() {
        // Simulate refreshing data
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        setTimeout(() => {
            // In a real app, this would fetch new data from an API
            renderBloodUnits();
            renderRecentDonations();
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            alert('Blood units data refreshed successfully!');
        }, 1500);
    });
    
    // Initialize the page
    renderBloodUnits();
    renderRecentDonations();
});

