   const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
        
        // Navigation Buttons Functionality
        document.getElementById('homeBtn').addEventListener('click', function() {
            setTimeout(() => {
            }, 1500);
        });
        
        document.getElementById('uploadBtn').addEventListener('click', function() {
            setTimeout(() => {
            }, 1500);
        });
        
        document.getElementById('yourUploadsBtn').addEventListener('click', function() {
            setTimeout(() => {
            }, 1500);
        });
        
        document.getElementById('signoutBtn').addEventListener('click', function() {
            const btn = this;
            const originalText = btn.innerHTML;
        
            btn.disabled = true;
            
            setTimeout(() => {
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // In a real app, this would redirect to login page
                    // window.location.href = '/login';
                }, 2000);
            }, 1500);
        });
        
        // Change Profile Picture
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        const changePhotoModal = document.getElementById('changePhotoModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        
        
        
        
        // Animate number counting
        function animateValue(id, start, end, duration) {
            const obj = document.getElementById(id);
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                obj.textContent = value;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
        
        // Simulate activity updates every 30 seconds
        setInterval(updateStats, 30000);
        
        // Notification function
        function showNotification(message, type) {
            // Remove existing notification if any
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            let icon = 'info-circle';
            let bgColor = '#4a6cf7';
            
            if (type === 'success') {
                icon = 'check-circle';
                bgColor = '#00b894';
            } else if (type === 'error') {
                icon = 'exclamation-circle';
                bgColor = '#ff7675';
            }
            
            notification.innerHTML = `
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            `;
            
            // Style the notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                background: ${bgColor};
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            `;
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // Add to document
            document.body.appendChild(notification);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                
                setTimeout(() => {
                    notification.remove();
                    document.head.removeChild(style);
                }, 300);
            }, 5000);
        }
        
        // Add interactive hover effect to activity items
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.activity-icon i');
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.activity-icon i');
                icon.style.transform = 'scale(1)';
            });
        });
        
        // Initialize with a welcome notification
        setTimeout(() => {
            showNotification('Welcome to your profile, Alex!', 'success');
        }, 1000);