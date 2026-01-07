        // DOM Elements
        const searchInput = document.getElementById('searchInput');
        const documentsGrid = document.getElementById('documentsGrid');
        const emptyState = document.getElementById('emptyState');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const uploadFirstBtn = document.getElementById('uploadFirstBtn');
        const deleteModal = document.getElementById('deleteModal');
        const deleteFileName = document.getElementById('deleteFileName');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        // State variables
        let allDocumentCards = Array.from(document.querySelectorAll('.document-card'));
        let visibleCount = 8;
        let documentToDelete = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            setupEventListeners();
            setupAnimations();
            updateDocumentVisibility();
        });

        // Setup animations
        function setupAnimations() {
            // Animate cards on load
            allDocumentCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Animate stat cards
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Navigation buttons
            document.getElementById('homeBtn').addEventListener('click', () => {
            });
            
            document.getElementById('uploadBtn').addEventListener('click', () => {
            });
            
            document.getElementById('profileBtn').addEventListener('click', () => {
            });
            
            document.getElementById('signoutBtn').addEventListener('click', () => {
                
                setTimeout(() => {
                    showNotification('Successfully signed out!', 'success');
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 2000);
                }, 1500);
            });
            
            // Search functionality
            searchInput.addEventListener('input', filterDocuments);
            
            // Load more
            loadMoreBtn.addEventListener('click', loadMoreDocuments);
            
            // Upload first button
            uploadFirstBtn.addEventListener('click', () => {
            });
            
            // Delete modal
            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.style.display = 'none';
                documentToDelete = null;
            });
            
            confirmDeleteBtn.addEventListener('click', () => {
                if (documentToDelete) {
                    deleteDocument(documentToDelete);
                }
                deleteModal.style.display = 'none';
                documentToDelete = null;
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === deleteModal) {
                    deleteModal.style.display = 'none';
                    documentToDelete = null;
                }
            });
        }

        // Filter documents based on search
        function filterDocuments() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                allDocumentCards.forEach(card => {
                    card.style.display = 'block';
                });
                visibleCount = 8;
                updateDocumentVisibility();
                return;
            }
            
            let visibleCards = 0;
            
            allDocumentCards.forEach((card, index) => {
                const name = card.getAttribute('data-name').toLowerCase();
                const type = card.getAttribute('data-type').toLowerCase();
                
                if (name.includes(searchTerm) || type.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCards++;
                    
                    // Add animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'fadeIn 0.6s ease';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide empty state
            if (visibleCards === 0) {
                emptyState.style.display = 'block';
                loadMoreBtn.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                loadMoreBtn.style.display = 'block';
                
                // Show first 8 matching cards
                visibleCount = Math.min(8, visibleCards);
                updateDocumentVisibilityForSearch();
            }
        }

        // Update document visibility for pagination
        function updateDocumentVisibility() {
            allDocumentCards.forEach((card, index) => {
                if (index < visibleCount) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide load more button
            if (visibleCount >= allDocumentCards.length) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Documents Loaded';
            } else {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Documents';
            }
            
            // Hide empty state since we have documents
            emptyState.style.display = 'none';
        }

        // Update visibility for search results
        function updateDocumentVisibilityForSearch() {
            let shown = 0;
            
            allDocumentCards.forEach((card, index) => {
                if (card.style.display === 'block') {
                    if (shown < visibleCount) {
                        card.style.display = 'block';
                        shown++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Update load more button
            const visibleCards = allDocumentCards.filter(card => card.style.display !== 'none').length;
            const totalVisible = allDocumentCards.filter(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const type = card.getAttribute('data-type').toLowerCase();
                const searchTerm = searchInput.value.toLowerCase().trim();
                return name.includes(searchTerm) || type.includes(searchTerm);
            }).length;
            
            if (visibleCards >= totalVisible) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Documents Loaded';
            } else {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Documents';
            }
        }

        // Load more documents
        function loadMoreDocuments() {
            visibleCount += 4;
            
            if (searchInput.value.trim() === '') {
                updateDocumentVisibility();
            } else {
                updateDocumentVisibilityForSearch();
            }
            
            // Smooth scroll to show new cards
            setTimeout(() => {
                const visibleCards = Array.from(document.querySelectorAll('.document-card[style*="block"]'));
                if (visibleCards.length > 0) {
                    visibleCards[visibleCards.length - 1].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 100);
        }

        // Document actions
        function viewDocument(url) {
            showNotification('Opening document in new tab...', 'info');
            window.open(url, '_blank');
        }

        function downloadDocument(url, filename) {
            showNotification(`Downloading ${filename}...`, 'success');
            // In a real app, this would trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function openDeleteModal(filename) {
            documentToDelete = filename;
            deleteFileName.textContent = `"${filename}"`;
            deleteModal.style.display = 'flex';
        }

        function deleteDocument(filename) {
            // Find and remove the card
            const cardToRemove = Array.from(allDocumentCards).find(card => {
                const cardName = card.querySelector('.document-name').textContent;
                return cardName === filename;
            });
            
            if (cardToRemove) {
                // Add delete animation
                cardToRemove.style.transform = 'scale(0.8)';
                cardToRemove.style.opacity = '0';
                
                setTimeout(() => {
                    cardToRemove.remove();
                    allDocumentCards = Array.from(document.querySelectorAll('.document-card'));
                    
                    // Update stats
                    updateStats();
                    
                    // Show notification
                    showNotification(`"${filename}" has been deleted`, 'success');
                    
                    // Check if any documents left
                    if (allDocumentCards.length === 0) {
                        emptyState.style.display = 'block';
                        loadMoreBtn.style.display = 'none';
                    } else {
                        updateDocumentVisibility();
                    }
                }, 300);
            }
        }

        // Update statistics after deletion
        function updateStats() {
            const totalDocs = document.querySelector('.stat-card:nth-child(1) .stat-value');
            const storageUsed = document.querySelector('.stat-card:nth-child(2) .stat-value');
            
            // Update total documents
            totalDocs.textContent = allDocumentCards.length;
            
            // Animate the update
            totalDocs.style.transform = 'scale(1.2)';
            totalDocs.style.color = '#ff7675';
            setTimeout(() => {
                totalDocs.style.transform = 'scale(1)';
                totalDocs.style.color = '#333';
            }, 300);
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

        // Initialize with welcome notification
        setTimeout(() => {
        }, 1000);