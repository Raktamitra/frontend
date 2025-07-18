// Admin Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
    // This would typically fetch data from an API
    // For demo purposes, we'll use mock data
    
    // Mock data for dashboard
    const dashboardData = {
        totalDonors: 1245,
        totalRequests: 328,
        pendingRequests: 42,
        ongoingDonations: 18
    };
    
    // Update dashboard cards with data
    document.getElementById('total-donors').textContent = dashboardData.totalDonors.toLocaleString();
    document.getElementById('total-requests').textContent = dashboardData.totalRequests.toLocaleString();
    document.getElementById('pending-requests').textContent = dashboardData.pendingRequests;
    document.getElementById('ongoing-donations').textContent = dashboardData.ongoingDonations;
    
    // Simulate loading data
    setTimeout(() => {
        // This would be replaced with actual API calls
        console.log("Dashboard data loaded");
    }, 500);
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref) {
            link.parentElement.classList.add('active');
        }
    });
});