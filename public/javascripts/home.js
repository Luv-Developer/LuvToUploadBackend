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
        
        // Button functionality
        document.getElementById('signinBtn').addEventListener('click', function() {
        });
        
        document.getElementById('getStartedBtn').addEventListener('click', function() {
        });
        
        // Upload functionality
        const uploadTrigger = document.getElementById('uploadTrigger');
        const fileInput = document.getElementById('fileInput');
        
        uploadTrigger.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileNames = Array.from(this.files).map(file => file.name).join(', ');
                alert(`Selected ${this.files.length} file(s): ${fileNames}\n\nIn a real application, these files would now be uploaded to the server.`);
                
                // Simulate upload progress
                simulateUpload();
            }
        });
        
        // Drag and drop functionality
        const uploadArea = document.querySelector('.upload-area');
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#4a6cf7';
            this.style.backgroundColor = '#f8faff';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '#b8c4ff';
            this.style.backgroundColor = 'white';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#b8c4ff';
            this.style.backgroundColor = 'white';
            
            if (e.dataTransfer.files.length > 0) {
                const fileNames = Array.from(e.dataTransfer.files).map(file => file.name).join(', ');
                alert(`Dropped ${e.dataTransfer.files.length} file(s): ${fileNames}\n\nIn a real application, these files would now be uploaded to the server.`);
                
                // Simulate upload progress
                simulateUpload();
            }
        });
        
        // Simulate upload progress
        function simulateUpload() {
            const originalText = uploadTrigger.innerHTML;
            uploadTrigger.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            uploadTrigger.style.pointerEvents = 'none';
            
            // Simulate upload delay
            setTimeout(() => {
                uploadTrigger.innerHTML = '<i class="fas fa-check"></i> Upload Complete!';
                uploadTrigger.style.backgroundColor = '#2ecc71';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    uploadTrigger.innerHTML = originalText;
                    uploadTrigger.style.backgroundColor = '#4a6cf7';
                    uploadTrigger.style.pointerEvents = 'auto';
                }, 3000);
            }, 2000);
        }
        
        // Add some random animation to feature cards on hover
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.feature-icon i');
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.feature-icon i');
                icon.style.transform = 'scale(1)';
            });
        });