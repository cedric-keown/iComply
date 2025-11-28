/**
 * AI Chatbot Service
 * Handles API communication with backend
 */

var ChatbotService = (function() {
    'use strict';

    const API_ENDPOINT = '/functions/v1/chatbot'; // Supabase Edge Function endpoint
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    /**
     * Send message to chatbot API
     * @param {string} message - User message
     * @param {object} context - Current context (module, page, etc.)
     * @returns {Promise<object>} Response object with message
     */
    async function sendMessage(message, context = {}) {
        try {
            // Get current user session
            const session = await getSession();
            if (!session) {
                throw new Error('User not authenticated');
            }

            // Prepare request
            const requestBody = {
                message: message,
                context: context,
                userId: session.user.id
            };

            // Get Supabase client
            const supabaseUrl = _app?.config?.supabaseUrl || window._supabase?.supabaseUrl;
            const supabaseKey = _app?.config?.supabaseAnonKey || window._supabase?.supabaseKey;

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Supabase configuration not found');
            }

            // Call Supabase Edge Function
            const response = await fetch(`${supabaseUrl}${API_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                message: data.response || 'Sorry, I could not generate a response.',
                usage: data.usage,
                context: data.context
            };

        } catch (error) {
            console.error('Chatbot service error:', error);
            
            // Retry logic for network errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return retryRequest(() => sendMessage(message, context), MAX_RETRIES);
            }

            throw error;
        }
    }

    /**
     * Submit feedback for a chatbot interaction
     * @param {boolean} helpful - Whether the response was helpful
     * @param {string} interactionId - Optional interaction ID
     * @param {string} feedbackText - Optional feedback text
     */
    async function submitFeedback(helpful, interactionId = null, feedbackText = '') {
        try {
            const session = await getSession();
            if (!session) {
                console.warn('Cannot submit feedback: user not authenticated');
                return;
            }

            // Get Supabase client
            if (!window._supabase) {
                console.warn('Supabase client not available');
                return;
            }

            // If we have an interaction ID, update it
            if (interactionId) {
                const { error } = await window._supabase
                    .from('chatbot_feedback')
                    .insert({
                        interaction_id: interactionId,
                        user_id: session.user.id,
                        helpful: helpful,
                        feedback_text: feedbackText
                    });

                if (error) {
                    console.error('Failed to save feedback:', error);
                }
            } else {
                // Store in localStorage as fallback
                try {
                    const feedback = {
                        helpful,
                        feedbackText,
                        timestamp: new Date().toISOString()
                    };
                    const stored = JSON.parse(localStorage.getItem('chatbot_feedback') || '[]');
                    stored.push(feedback);
                    localStorage.setItem('chatbot_feedback', JSON.stringify(stored));
                } catch (e) {
                    console.error('Failed to store feedback locally:', e);
                }
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
        }
    }

    /**
     * Get chat history for current user
     * @param {number} limit - Number of messages to retrieve
     * @returns {Promise<Array>} Array of messages
     */
    async function getChatHistory(limit = 20) {
        try {
            const session = await getSession();
            if (!session || !window._supabase) {
                return [];
            }

            const { data, error } = await window._supabase
                .from('chatbot_interactions')
                .select('message, response, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Failed to load chat history:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Chat history error:', error);
            return [];
        }
    }

    /**
     * Get current user session
     * @returns {Promise<object|null>} Session object or null
     */
    async function getSession() {
        try {
            if (window._supabase) {
                const { data: { session } } = await window._supabase.auth.getSession();
                return session;
            }

            // Fallback: check if auth service exists
            if (typeof authService !== 'undefined' && authService.userInfo) {
                return {
                    user: {
                        id: authService.userInfo.id,
                        email: authService.userInfo.email
                    }
                };
            }

            return null;
        } catch (error) {
            console.error('Session error:', error);
            return null;
        }
    }

    /**
     * Retry a failed request
     * @param {Function} requestFn - Function that returns a promise
     * @param {number} retries - Number of retries remaining
     * @returns {Promise} Request result
     */
    async function retryRequest(requestFn, retries) {
        if (retries <= 0) {
            throw new Error('Request failed after retries');
        }

        try {
            return await requestFn();
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return retryRequest(requestFn, retries - 1);
        }
    }

    /**
     * Test chatbot connection
     * @returns {Promise<boolean>} True if connection successful
     */
    async function testConnection() {
        try {
            const response = await sendMessage('Hello', {});
            return !!response.message;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    // Public API
    return {
        sendMessage: sendMessage,
        submitFeedback: submitFeedback,
        getChatHistory: getChatHistory,
        testConnection: testConnection
    };
})();

