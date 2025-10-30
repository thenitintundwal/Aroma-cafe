// Shared API types for client and server

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Add your shared types here as needed
