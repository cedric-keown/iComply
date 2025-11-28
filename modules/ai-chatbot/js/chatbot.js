/**
 * AI Chatbot Widget - Main Controller
 * Handles UI interactions and message flow
 */

var ChatbotWidget = (function() {
    'use strict';

    let isOpen = false;
    let isMinimized = false;
    let messageHistory = [];
    let currentContext = {};

    // Initialize chatbot
    function init() {
        createWidget();
        bindEvents();
        loadMessageHistory();
        detectContext();
        
        // Check for unread messages or suggestions
        checkForSuggestions();
    }

    // Create chatbot widget HTML
    function createWidget() {
        const widgetHTML = `
            <!-- Floating Chat Button -->
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open AI Assistant">
                <i class="fas fa-robot"></i>
                <span class="badge d-none" id="chatbotBadge">1</span>
            </button>

            <!-- Chat Window -->
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <h6>
                        <span class="status-indicator"></span>
                        AI Assistant
                    </h6>
                    <div class="chatbot-header-actions">
                        <button id="chatbotMinimize" aria-label="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="chatbotClose" aria-label="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chatbot-message assistant">
                        <div class="chatbot-message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-message-content">
                            <p>Hello! I'm your AI compliance assistant. How can I help you today?</p>
                            <div class="chatbot-message-time">Just now</div>
                        </div>
                    </div>
                </div>

                <div class="chatbot-quick-actions" id="chatbotQuickActions">
                    <!-- Quick action buttons will be populated here -->
                </div>

                <div class="chatbot-input-area">
                    <div class="chatbot-input-wrapper">
                        <textarea 
                            id="chatbotInput" 
                            class="chatbot-input" 
                            placeholder="Type your message..."
                            rows="1"
                        ></textarea>
                        <button class="chatbot-send-button" id="chatbotSend" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // Bind event listeners
    function bindEvents() {
        // Toggle button
        const toggleBtn = document.getElementById('chatbotToggle');
        const windowEl = document.getElementById('chatbotWindow');
        const closeBtn = document.getElementById('chatbotClose');
        const minimizeBtn = document.getElementById('chatbotMinimize');
        const sendBtn = document.getElementById('chatbotSend');
        const inputEl = document.getElementById('chatbotInput');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleChat);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', minimizeChat);
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }

        if (inputEl) {
            // Auto-resize textarea
            inputEl.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });

            // Send on Enter (but allow Shift+Enter for new line)
            inputEl.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Focus input when chat opens
            if (windowEl && windowEl.classList.contains('open')) {
                inputEl.focus();
            }
        }

        // Close on outside click (optional)
        document.addEventListener('click', function(e) {
            if (isOpen && 
                !windowEl.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                // Uncomment to close on outside click
                // minimizeChat();
            }
        });
    }

    // Toggle chat window
    function toggleChat() {
        const windowEl = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');

        if (!windowEl || !toggleBtn) return;

        if (isOpen) {
            minimizeChat();
        } else {
            openChat();
        }
    }

    // Open chat window
    function openChat() {
        const windowEl = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        const inputEl = document.getElementById('chatbotInput');

        if (!windowEl || !toggleBtn) return;

        isOpen = true;
        isMinimized = false;
        windowEl.classList.add('open');
        windowEl.classList.remove('minimized');
        toggleBtn.classList.add('active');

        // Focus input
        if (inputEl) {
            setTimeout(() => inputEl.focus(), 100);
        }

        // Load quick actions based on context
        loadQuickActions();
    }

    // Close chat window
    function closeChat() {
        const windowEl = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');

        if (!windowEl || !toggleBtn) return;

        isOpen = false;
        isMinimized = false;
        windowEl.classList.remove('open');
        windowEl.classList.remove('minimized');
        toggleBtn.classList.remove('active');
    }

    // Minimize chat window
    function minimizeChat() {
        const windowEl = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');

        if (!windowEl || !toggleBtn) return;

        isMinimized = true;
        windowEl.classList.add('minimized');
        toggleBtn.classList.remove('active');
    }

    // Send message
    async function sendMessage() {
        const inputEl = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        const messagesEl = document.getElementById('chatbotMessages');

        if (!inputEl || !messagesEl) return;

        const message = inputEl.value.trim();
        if (!message) return;

        // Clear input
        inputEl.value = '';
        inputEl.style.height = 'auto';

        // Disable send button
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Add user message to UI
        addMessage('user', message);

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Get current context
            detectContext();

            // Send to chatbot service
            const response = await ChatbotService.sendMessage(message, currentContext);

            // Remove typing indicator
            removeTypingIndicator(typingId);

            // Add assistant response
            addMessage('assistant', response.message);

            // Save to history
            saveMessageToHistory('user', message);
            saveMessageToHistory('assistant', response.message);

        } catch (error) {
            console.error('Chatbot error:', error);
            removeTypingIndicator(typingId);
            addMessage('assistant', 'Sorry, I encountered an error. Please try again or contact support.', true);
        } finally {
            // Re-enable send button
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }
    }

    // Add message to chat UI
    function addMessage(role, content, isError = false) {
        const messagesEl = document.getElementById('chatbotMessages');
        if (!messagesEl) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message ${role}`;

        const avatarIcon = role === 'user' ? 'fa-user' : 'fa-robot';
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageEl.innerHTML = `
            <div class="chatbot-message-avatar">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="chatbot-message-content ${isError ? 'chatbot-error' : ''}">
                ${formatMessage(content)}
                <div class="chatbot-message-time">${time}</div>
            </div>
        `;

        messagesEl.appendChild(messageEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Add feedback buttons for assistant messages
        if (role === 'assistant' && !isError) {
            addFeedbackButtons(messageEl);
        }
    }

    // Format message content (support markdown-like formatting)
    function formatMessage(content) {
        // Convert markdown-style formatting to HTML
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/`(.*?)`/g, '<code>$1</code>');
        content = content.replace(/\n/g, '<br>');
        
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        content = content.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

        return content;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const messagesEl = document.getElementById('chatbotMessages');
        if (!messagesEl) return null;

        const typingEl = document.createElement('div');
        typingEl.className = 'chatbot-typing';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        messagesEl.appendChild(typingEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        return 'typing-indicator';
    }

    // Remove typing indicator
    function removeTypingIndicator(id) {
        const typingEl = document.getElementById(id);
        if (typingEl) {
            typingEl.remove();
        }
    }

    // Add feedback buttons to message
    function addFeedbackButtons(messageEl) {
        const contentEl = messageEl.querySelector('.chatbot-message-content');
        if (!contentEl) return;

        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'chatbot-feedback';
        feedbackEl.innerHTML = `
            <button class="feedback-helpful" data-helpful="true" aria-label="Helpful">
                <i class="fas fa-thumbs-up"></i> Helpful
            </button>
            <button class="feedback-not-helpful" data-helpful="false" aria-label="Not helpful">
                <i class="fas fa-thumbs-down"></i> Not helpful
            </button>
        `;

        contentEl.appendChild(feedbackEl);

        // Bind feedback events
        feedbackEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                const helpful = this.dataset.helpful === 'true';
                submitFeedback(helpful, messageEl);
            });
        });
    }

    // Submit feedback
    async function submitFeedback(helpful, messageEl) {
        const feedbackEl = messageEl.querySelector('.chatbot-feedback');
        if (!feedbackEl) return;

        // Update UI
        feedbackEl.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
            if ((btn.dataset.helpful === 'true' && helpful) ||
                (btn.dataset.helpful === 'false' && !helpful)) {
                btn.classList.add('active');
            }
        });

        // Send feedback to service
        try {
            await ChatbotService.submitFeedback(helpful);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    }

    // Load quick actions based on context
    function loadQuickActions() {
        const quickActionsEl = document.getElementById('chatbotQuickActions');
        if (!quickActionsEl) return;

        const suggestions = ChatbotContext.getSuggestions(currentContext);
        
        if (suggestions.length === 0) {
            quickActionsEl.innerHTML = '';
            return;
        }

        quickActionsEl.innerHTML = suggestions.map(suggestion => 
            `<button class="chatbot-quick-action" data-suggestion="${suggestion}">${suggestion}</button>`
        ).join('');

        // Bind click events
        quickActionsEl.querySelectorAll('.chatbot-quick-action').forEach(btn => {
            btn.addEventListener('click', function() {
                const suggestion = this.dataset.suggestion;
                document.getElementById('chatbotInput').value = suggestion;
                sendMessage();
            });
        });
    }

    // Detect current context
    function detectContext() {
        currentContext = ChatbotContext.detect();
    }

    // Check for suggestions (e.g., based on alerts, current page)
    function checkForSuggestions() {
        // This could check for active alerts, incomplete forms, etc.
        // and show a badge on the chatbot button
    }

    // Load message history from localStorage
    function loadMessageHistory() {
        try {
            const stored = localStorage.getItem('chatbot_history');
            if (stored) {
                messageHistory = JSON.parse(stored);
                // Optionally restore last N messages
            }
        } catch (error) {
            console.error('Failed to load message history:', error);
        }
    }

    // Save message to history
    function saveMessageToHistory(role, content) {
        messageHistory.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 messages
        if (messageHistory.length > 50) {
            messageHistory = messageHistory.slice(-50);
        }

        try {
            localStorage.setItem('chatbot_history', JSON.stringify(messageHistory));
        } catch (error) {
            console.error('Failed to save message history:', error);
        }
    }

    // Public API
    return {
        init: init,
        open: openChat,
        close: closeChat,
        toggle: toggleChat,
        sendMessage: sendMessage
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ChatbotWidget.init);
} else {
    ChatbotWidget.init();
}

