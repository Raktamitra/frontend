document.addEventListener('DOMContentLoaded', function() {
    // Blood type compatibility rules
    const bloodCompatibility = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    };

    // Mock donor data
    const donors = [
        { id: 1, name: 'John Smith', bloodGroup: 'A+', lastDonation: '2023-03-15', phone: '555-0101', unit: 'city-general' },
        { id: 2, name: 'Sarah Johnson', bloodGroup: 'B-', lastDonation: '2023-04-20', phone: '555-0102', unit: 'metro-medical' },
        { id: 3, name: 'Michael Brown', bloodGroup: 'O+', lastDonation: '2023-05-10', phone: '555-0103', unit: 'university' },
        { id: 4, name: 'Emily Davis', bloodGroup: 'AB+', lastDonation: '2023-01-05', phone: '555-0104', unit: 'childrens' },
        { id: 5, name: 'Robert Wilson', bloodGroup: 'A-', lastDonation: '2023-06-01', phone: '555-0105', unit: 'veterans' },
        { id: 6, name: 'Lisa White', bloodGroup: 'O-', lastDonation: '2023-02-18', phone: '555-0106', unit: 'city-general' },
        { id: 7, name: 'David Lee', bloodGroup: 'B+', lastDonation: '2023-05-22', phone: '555-0107', unit: 'metro-medical' },
        { id: 8, name: 'Jennifer Harris', bloodGroup: 'A+', lastDonation: '2023-04-30', phone: '555-0108', unit: 'university' }
    ];

    // Check Compatibility Button
    document.getElementById('checkCompatibility').addEventListener('click', function() {
        const selectedBloodGroup = document.getElementById('bloodGroup').value;
        const selectedUnit = document.getElementById('unit').value;
        
        if (!selectedBloodGroup) {
            alert('Please select a blood group first');
            return;
        }
        
        // Get compatible blood groups
        const compatibleGroups = bloodCompatibility[selectedBloodGroup];
        
        // Display compatible groups
        const compatibleGroupsElement = document.getElementById('compatibleGroups');
        compatibleGroupsElement.innerHTML = compatibleGroups.map(group => 
            `<span class="blood-group-badge ${group.replace('+', 'pos').replace('-', 'neg')}">${group}</span>`
        ).join('');
        
        // Filter donors by compatibility and unit
        let compatibleDonors = donors.filter(donor => 
            compatibleGroups.includes(donor.bloodGroup)
        );
        
        if (selectedUnit) {
            compatibleDonors = compatibleDonors.filter(donor => donor.unit === selectedUnit);
        }
        
        // Show donors count
        document.getElementById('donorsCount').innerHTML = `
            <p>Found ${compatibleDonors.length} compatible donors${selectedUnit ? ` in ${document.getElementById('unit').options[document.getElementById('unit').selectedIndex].text}` : ''}</p>
        `;
        
        // Show compatibility results
        document.getElementById('compatibilityResults').style.display = 'block';
        
        // If there are compatible donors, show the list
        if (compatibleDonors.length > 0) {
            renderDonorsList(compatibleDonors);
            document.getElementById('donorsList').style.display = 'block';
        } else {
            document.getElementById('donorsList').style.display = 'none';
        }
    });
    
    // Render donors list
    function renderDonorsList(donorsList) {
        const tbody = document.getElementById('donorsTableBody');
        tbody.innerHTML = '';
        
        donorsList.forEach(donor => {
            const row = document.createElement('tr');
            
            // Calculate if donor is eligible (at least 90 days since last donation)
            const lastDonationDate = new Date(donor.lastDonation);
            const today = new Date();
            const diffTime = today - lastDonationDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const isEligible = diffDays >= 90;
            
            row.innerHTML = `
                <td><input type="checkbox" class="donor-checkbox" data-id="${donor.id}" ${isEligible ? '' : 'disabled'}></td>
                <td>${donor.name}</td>
                <td><span class="blood-group-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}">${donor.bloodGroup}</span></td>
                <td>${donor.lastDonation} (${diffDays} days ago)</td>
                <td>${donor.phone}</td>
            `;
            
            if (!isEligible) {
                row.classList.add('not-eligible');
            }
            
            tbody.appendChild(row);
        });
        
        // Add event listener for select all checkbox
        document.getElementById('selectAllDonors').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.donor-checkbox:not(:disabled)');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Form submission
    document.getElementById('notifyDonorsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bloodGroup = document.getElementById('bloodGroup').value;
        const unit = document.getElementById('unit').value;
        const message = document.getElementById('message').value;
        
        if (!bloodGroup) {
            alert('Please select a blood group');
            return;
        }
        
        // Get selected donors
        const selectedDonors = [];
        document.querySelectorAll('.donor-checkbox:checked').forEach(checkbox => {
            selectedDonors.push(checkbox.getAttribute('data-id'));
        });
        
        if (selectedDonors.length === 0) {
            alert('Please select at least one donor to notify');
            return;
        }
        
        // In a real app, this would call an API to send notifications
        console.log('Sending notifications to donors:', selectedDonors);
        console.log('Message:', message);
        
        // Show success message
        alert(`Notifications sent successfully to ${selectedDonors.length} donors!`);
        
        // Reset form
        this.reset();
        document.getElementById('compatibilityResults').style.display = 'none';
        document.getElementById('donorsList').style.display = 'none';
    });
});