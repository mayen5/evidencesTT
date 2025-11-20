// Export API client and interceptors
export { apiClient, default } from './client';
export { tokenStorage } from './interceptors';

// Import interceptors to ensure they are registered
import './interceptors';
