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

    // Check Compatibility Button
    document.getElementById('checkCompatibility').addEventListener('click', function() {
        const patientBloodGroup = document.getElementById('patientBloodGroup').value;
        
        if (!patientBloodGroup) {
            alert('Please select a blood group first');
            return;
        }
        
        // Get compatible blood groups
        const compatibleGroups = bloodCompatibility[patientBloodGroup];
        
        // Display compatible groups
        const compatibleGroupsElement = document.getElementById('compatibleGroups');
        compatibleGroupsElement.innerHTML = compatibleGroups.map(group => 
            `<span class="blood-group-badge ${group.replace('+', 'pos').replace('-', 'neg')}">${group}</span>`
        ).join('');
        
        // Show results
        document.getElementById('compatibilityResults').style.display = 'block';
    });
    
    // Add blood group badge styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .blood-group-badge {
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
        }
        .blood-group-badge.Apos { background-color: #e74c3c; }
        .blood-group-badge.Aneg { background-color: #c0392b; }
        .blood-group-badge.Bpos { background-color: #3498db; }
        .blood-group-badge.Bneg { background-color: #2980b9; }
        .blood-group-badge.ABpos { background-color: #9b59b6; }
        .blood-group-badge.ABneg { background-color: #8e44ad; }
        .blood-group-badge.Opos { background-color: #2ecc71; }
        .blood-group-badge.Oneg { background-color: #27ae60; }
        
        .compatible-groups {
            display: flex;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        
        .compatibility-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        
        .compatibility-info ul {
            margin-left: 20px;
        }
        
        .blood-type-chart {
            margin-top: 40px;
            text-align: center;
        }
        
        .blood-type-chart img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        
        .chart-note {
            font-style: italic;
            color: #777;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
});