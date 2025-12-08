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
  async register(email: string, password: string, firstName?: string, lastName?: string, affiliateCode?: string): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, affiliateCode }),
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
      role?: 'USER' | 'ADMIN';
      plan?: 'FREE' | 'BASIC' | 'PRO'; // Add plan to top-level user object
      subscriptionStatus?: string;
      currentPeriodEnd?: string;
    }
  }>> {
    return this.request<{
      user: {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        role?: 'USER' | 'ADMIN';
        plan?: 'FREE' | 'BASIC' | 'PRO';
        subscriptionStatus?: string;
        currentPeriodEnd?: string;
      }
    }>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Subscription endpoints
  async getSubscriptionStatus(token: string): Promise<ApiResponse<{
    hasSubscription: boolean;
    plan: 'free' | 'basic' | 'pro';
    status?: string;
    currentPeriodEnd?: string;
  }>> {
    // Backend doesn't have /subscription/status - we get this from /auth/me
    const meResponse = await this.getMe(token);
    if (!meResponse.success || !meResponse.data?.user) {
      return { success: false, error: 'Failed to get user data' };
    }

    const user = meResponse.data.user;
    
    // Use the plan field directly from the user object (which comes from the backend logic)
    const plan = (user.plan?.toLowerCase() || 'free') as 'free' | 'basic' | 'pro';
    const status = user.subscriptionStatus;
    const currentPeriodEnd = user.currentPeriodEnd;

    return {
      success: true,
      data: {
        hasSubscription: plan !== 'free',
        plan,
        status,
        currentPeriodEnd
      },
    };
  }

  async createCheckoutSession(token: string, plan: 'basic' | 'pro' | 'unlimited', affiliateCode?: string) {
    // Map plan names to Stripe price IDs
    const priceIds: Record<string, string> = {
      basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || 'price_1SQdkDCDxzHnrj8R0nSwZApT',
      pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_1SRQyxCDxzHnrj8RmTIm9ye6',
      unlimited: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_1SRQyxCDxzHnrj8RmTIm9ye6',
    };

    const endpoint = '/billing/create-checkout-session';
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`[API] Calling checkout endpoint: ${url}`);

    return this.request<{ url: string }>(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ priceId: priceIds[plan], affiliateCode }),
    }).then(res => {
      if (!res.success) {
        console.error('[API] createCheckoutSession failed:', res.error);
        alert(`Checkout Error: ${res.error || 'Unknown error'}\nURL: ${url}`);
      }
      return res;
    });
  }

  async getCustomerPortalUrl(token: string) {
    return this.request<{ url: string }>('/billing/create-portal-session', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Affiliate endpoints
  async getAffiliates(token: string) {
    return this.request<Array<{
      id: string;
      name: string;
      code: string;
      referralLink: string;
      visits: number;
      signups: number;
      conversions: number;
      payoutRate: number;
      amountPaid: number;
      referredUsersCount: number;
      unpaidBalance: number;
      createdAt: string;
    }>>('/admin/affiliates', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createAffiliate(token: string, name: string, code?: string, payoutRate?: number) {
    return this.request<{
      id: string;
      name: string;
      code: string;
      referralLink: string;
    }>('/admin/affiliates', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, code, payoutRate }),
    });
  }

  async markAffiliatePaid(token: string, affiliateId: string) {
    return this.request<{
      id: string;
      amountPaid: number;
    }>(`/admin/affiliates/${affiliateId}/mark-paid`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });
  }

  // Usage endpoints
  async getUsageStats(token: string) {
    return this.request('/usage/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getSolveHistory(token: string, page: number = 1, limit: number = 50) {
    // Backend doesn't have history endpoint yet - skip onboarding and return empty for now
    return {
      success: true,
      data: [],
    };
  }

  // Onboarding endpoints - Backend doesn't have these, so skip onboarding flow
  async getOnboardingStatus(token: string): Promise<ApiResponse<{
    onboardingCompleted: boolean;
    onboardingStep: string;
    isMobileDevice: boolean;
  }>> {
    // Skip onboarding - mark as completed so users go straight to dashboard
    return {
      success: true,
      data: {
        onboardingCompleted: true,
        onboardingStep: 'completed',
        isMobileDevice: false,
      },
    };
  }

  async updateOnboardingStep(token: string, step: string): Promise<ApiResponse<{
    onboardingStep: string;
    onboardingCompleted: boolean;
  }>> {
    return {
      success: true,
      data: {
        onboardingStep: step,
        onboardingCompleted: true,
      },
    };
  }

  async setDeviceType(token: string, isMobile: boolean): Promise<ApiResponse<{
    isMobileDevice: boolean;
  }>> {
    return {
      success: true,
      data: {
        isMobileDevice: isMobile,
      },
    };
  }

  async resetOnboarding(token: string): Promise<ApiResponse<{
    onboardingStep: string;
    onboardingCompleted: boolean;
  }>> {
    return {
      success: true,
      data: {
        onboardingStep: 'completed',
        onboardingCompleted: true,
      },
    };
  }

  // Admin endpoints
  async getAdminFinancials(token: string, startDate: string, endDate: string) {
    return this.request<{
      totalCost: number;
      providers: Record<'gemini' | 'openai' | 'claude', {
        cost: number;
        percentage: number;
        models: Record<string, { inputTokens: number; outputTokens: number; cost: number }>;
      }>;
    }>(`/admin/financials?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAdminMetrics(token: string, startDate: string, endDate: string) {
    return this.request<{
      totalSolves: number;
      totalSnips: number;
    }>(`/admin/metrics?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async searchUserUsage(token: string, email: string, startDate: string, endDate: string) {
    return this.request<{
      user: { 
        id: string; 
        email: string; 
        createdAt: string;
        subscriptionHistory: Array<{
          plan: string;
          status: string;
          startDate: string;
          endDate: string | null;
          durationMonths: string;
        }>;
      };
      totalCost: number;
      estimatedRevenue: number;
      costToRevenuePercentage: number;
      providers: {
        gemini: { cost: number; percentage: number };
        openai: { cost: number; percentage: number };
        claude: { cost: number; percentage: number };
      };
    }>(`/admin/user-search?email=${encodeURIComponent(email)}&startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAdminUsers(token: string, page: number = 1, limit: number = 50) {
    return this.request<{
      users: Array<{
        id: string;
        email: string;
        role: string;
        createdAt: string;
        plan: string;
        planSince: string;
        lifetimeCost: number;
        lifetimeSolves: number;
        usageThisMonthPercent: number;
        averageMonthlyUsagePercent: number;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/admin/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAdminLogs(token: string, page: number = 1, limit: number = 50) {
    return this.request<{
      logs: Array<{
        id: string;
        createdAt: string;
        user: { id: string; email: string };
        mode: string;
        sourceUrl?: string;
        ipAddress?: string;
        interactions?: any[];
        input: { text: string; images: Array<{ id: string; source: string; hasImage: boolean }> };
        outputs: Array<{
          id: string;
          provider: string;
          shortAnswer: string;
          confidence: number | null;
          structuredAnswer: any;
          metadata: any;
        }>;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/admin/logs?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async resetStats(token: string, scope: 'all' | 'today' = 'all') {
    return this.request<{
      deletedAdminStats: number;
      deletedUsage: number;
    }>('/admin/reset-stats', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scope }),
    });
  }
}

export const api = new ApiClient();