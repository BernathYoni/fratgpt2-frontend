// API client for connecting to backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fratgpt.co';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        return {
          success: false,
          error: errorData.error || errorData.message || 'Request failed',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<ApiResponse<any>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async googleAuth(credential: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async getMe(token: string): Promise<ApiResponse<{
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      subscription?: any;
      plan?: string;
      usage?: any;
    }
  }>> {
    return this.request<{
      user: {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        subscription?: any;
        plan?: string;
        usage?: any;
      }
    }>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Subscription endpoints
  async getSubscriptionStatus(token: string): Promise<ApiResponse<{
    subscription?: any;
    hasSubscription: boolean;
    plan: 'free' | 'basic' | 'pro';
  }>> {
    return this.request<{
      subscription?: any;
      hasSubscription: boolean;
      plan: 'free' | 'basic' | 'pro';
    }>('/subscription/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createCheckoutSession(token: string, plan: 'basic' | 'pro' | 'unlimited') {
    return this.request<{ url: string }>('/subscription/create-checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan }),
    });
  }

  async getCustomerPortalUrl(token: string) {
    return this.request<{ url: string }>('/subscription/portal', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Usage endpoints
  async getUsageStats(token: string) {
    return this.request('/usage/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getSolveHistory(token: string, page: number = 1, limit: number = 50) {
    return this.request(`/usage/history?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Onboarding endpoints
  async getOnboardingStatus(token: string): Promise<ApiResponse<{
    onboardingCompleted: boolean;
    onboardingStep: string;
    isMobileDevice: boolean;
  }>> {
    return this.request<{
      onboardingCompleted: boolean;
      onboardingStep: string;
      isMobileDevice: boolean;
    }>('/onboarding/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateOnboardingStep(token: string, step: string): Promise<ApiResponse<{
    onboardingStep: string;
    onboardingCompleted: boolean;
  }>> {
    return this.request<{
      onboardingStep: string;
      onboardingCompleted: boolean;
    }>('/onboarding/update-step', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ step }),
    });
  }

  async setDeviceType(token: string, isMobile: boolean): Promise<ApiResponse<{
    isMobileDevice: boolean;
  }>> {
    return this.request<{
      isMobileDevice: boolean;
    }>('/onboarding/set-device', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isMobile }),
    });
  }

  async resetOnboarding(token: string): Promise<ApiResponse<{
    onboardingStep: string;
    onboardingCompleted: boolean;
  }>> {
    return this.request<{
      onboardingStep: string;
      onboardingCompleted: boolean;
    }>('/onboarding/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const api = new ApiClient();
