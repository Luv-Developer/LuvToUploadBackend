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
        
        // DOM Elements
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileType = document.getElementById('fileType');
        const fileIcon = document.getElementById('fileIcon');
        const uploadBtn = document.getElementById('uploadBtn');
        const removeFileBtn = document.getElementById('removeFileBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        const successNotification = document.getElementById('successNotification');
        const totalUploads = document.getElementById('totalUploads');
        
        document.getElementById('signoutBtn').addEventListener('click', () => {
            const btn = document.getElementById('signoutBtn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Out...';
            btn.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully signed out!', 'success');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    // In real app: window.location.href = '/login';
                }, 2000);
            }, 1500);
        });
        
        // File Input Handling
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and Drop Functionality
        uploadArea.addEventListener('dragover', (e) => {
            uploadArea.classList.add('active');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('active');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            uploadArea.classList.remove('active');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect({ target: fileInput });
            }
        });
        
        // Click on upload area to trigger file input
        uploadArea.addEventListener('click', (e) => {
            if (e.target.closest('.file-input-container')) return;
            fileInput.click();
        });
        
        // File Selection Handler
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Show file preview
            showFilePreview(file);
        }
        
        // Show File Preview
        function showFilePreview(file) {
            const fileSizeFormatted = formatFileSize(file.size);
            const fileTypeName = getFileTypeName(file.type);
            const fileIconClass = getFileIconClass(file.type);
            
            fileName.textContent = file.name;
            fileSize.textContent = fileSizeFormatted;
            fileType.textContent = fileTypeName;
            
            // Update file icon
            const iconElement = fileIcon.querySelector('i');
            iconElement.className = `fas ${fileIconClass}`;
            
            // Show preview container
            filePreview.style.display = 'block';
            
            // Scroll to preview
            setTimeout(() => {
                filePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
        
        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        // Get file type name
        function getFileTypeName(mimeType) {
            const typeMap = {
                'application/pdf': 'PDF Document',
                'application/msword': 'Word Document',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
                'application/vnd.ms-excel': 'Excel Spreadsheet',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
                'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
                'text/plain': 'Text File',
                'image/jpeg': 'JPEG Image',
                'image/png': 'PNG Image',
                'image/gif': 'GIF Image'
            };
            
            return typeMap[mimeType] || 'Unknown File';
        }
        
        // Get file icon class
        function getFileIconClass(mimeType) {
            const iconMap = {
                'application/pdf': 'fa-file-pdf',
                'application/msword': 'fa-file-word',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
                'application/vnd.ms-excel': 'fa-file-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel',
                'application/vnd.ms-powerpoint': 'fa-file-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint',
                'text/plain': 'fa-file-alt',
                'image/jpeg': 'fa-file-image',
                'image/png': 'fa-file-image',
                'image/gif': 'fa-file-image'
            };
            
            return iconMap[mimeType] || 'fa-file';
        }
        
        // Upload Button Click
        uploadBtn.addEventListener('click', uploadFile);
        
        // Remove File Button
        removeFileBtn.addEventListener('click', () => {
            fileInput.value = '';
            filePreview.style.display = 'none';
            uploadProgress.style.display = 'none';
        });
        
        // Cancel Button
        cancelBtn.addEventListener('click', () => {
            fileInput.value = '';
            filePreview.style.display = 'none';
            uploadProgress.style.display = 'none';
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload File';
        });
        
        // Upload File Function
        async function uploadFile() {
            const file = fileInput.files[0];
            if (!file) {
                showNotification('Please select a file first!', 'error');
                return;
            }

            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                showNotification('File size exceeds 50MB limit!', 'error');
                return;
            }

            // Disable upload button
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

            // Show progress
            uploadProgress.style.display = 'block';

            // Build FormData
            const formData = new FormData();
            formData.append('file', file);

            // Create XHR to track progress and send cookies
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload');
            xhr.withCredentials = true;

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    updateProgress(percent);
                }
            };

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    updateProgress(100);
                    uploadComplete();
                    // Redirect to profile after short delay to allow UI animation
                    setTimeout(() => { window.location.href = '/profile'; }, 900);
                } else {
                    console.error('Upload failed:', xhr.status, xhr.responseText);
                    showNotification('Upload failed. Please try again.', 'error');
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload File';
                }
            };

            xhr.onerror = function () {
                console.error('Upload XHR error');
                showNotification('Network error during upload.', 'error');
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload File';
            };

            xhr.send(formData);
        }
        
        // Update progress bar
        function updateProgress(percent) {
            progressFill.style.width = percent + '%';
            progressPercent.textContent = Math.round(percent) + '%';
        }
        
        // Upload complete
        function uploadComplete() {
            // Success animation
            filePreview.classList.add('success-animation');
            
            // Show success notification
            showNotification('File uploaded successfully!', 'success');
            
            // Update stats
            const currentUploads = parseInt(totalUploads.textContent.replace(',', ''));
            totalUploads.textContent = (currentUploads + 1).toLocaleString();
            
            // Reset UI after delay
            setTimeout(() => {
                filePreview.classList.remove('success-animation');
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
                progressPercent.textContent = '0%';
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload File';
                
                // Auto-clear after 3 seconds
                setTimeout(() => {
                    fileInput.value = '';
                    filePreview.style.display = 'none';
                }, 3000);
            }, 2000);
        }
        
        // Show notification
        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            
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
                <div class="notification-content" style="
                    position: fixed;
                    top: 30px;
                    right: 30px;
                    padding: 20px 30px;
                    background: ${bgColor};
                    color: white;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                ">
                    <i class="fas fa-${icon}" style="font-size: 24px;"></i>
                    <span style="font-weight: 500; font-size: 16px;">${message}</span>
                </div>
            `;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // Add to document
            document.body.appendChild(notification);
            
            // Remove after 4 seconds
            setTimeout(() => {
                notification.querySelector('.notification-content').style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                    document.head.removeChild(style);
                }, 300);
            }, 4000);
        }
        
        // Initialize with some stats animation
        document.addEventListener('DOMContentLoaded', () => {
            // Animate stats on load
            setTimeout(() => {
                const statCards = document.querySelectorAll('.stat-card');
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 300);
                    }, index * 100);
                });
            }, 1000);
            
            // Show welcome notification
            setTimeout(() => {
                showNotification('Welcome to LuvToUpload! Select a file to begin.', 'info');
            }, 1500);
        });