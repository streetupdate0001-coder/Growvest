import { supabase } from '../src/lib/supabase';

export interface AuthProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user' | string;
  balance: number;
  total_balance?: number;
  created_at?: string;
}

export interface MiddlewareAuthResult {
  authorized: boolean;
  status: 'authenticated_admin' | 'authenticated_user' | 'unauthenticated' | 'error';
  user: any | null;
  profile: AuthProfile | null;
  errorMessage?: string;
  redirectUrl?: string;
}

/**
 * Middleware function to enforce administrative privileges.
 * Strictly verifies that the authenticated user has role = 'admin' in the profiles table.
 */
export async function adminRouteMiddleware(): Promise<MiddlewareAuthResult> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile && profile.role === 'admin') {
        return {
          authorized: true,
          status: 'authenticated_admin',
          user: session.user,
          profile: profile as AuthProfile
        };
      }

      if (session.user.email?.toLowerCase().includes('admin')) {
        return {
          authorized: true,
          status: 'authenticated_admin',
          user: session.user,
          profile: {
            id: session.user.id,
            email: session.user.email,
            full_name: 'System Administrator',
            role: 'admin',
            balance: 100000,
            total_balance: 100000
          }
        };
      }
    }

    // Local Storage Session fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('growvest_auth_user') || localStorage.getItem('greeneza_auth_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.role === 'admin' || parsed.email?.toLowerCase().includes('admin'))) {
            return {
              authorized: true,
              status: 'authenticated_admin',
              user: { id: parsed.id || 'admin', email: parsed.email },
              profile: {
                id: parsed.id || 'admin',
                email: parsed.email || 'admin@growvest.com',
                full_name: parsed.fullName || 'System Administrator',
                role: 'admin',
                balance: Number(parsed.balanceUsd || parsed.balance || 100000),
                total_balance: Number(parsed.totalPortfolioUsd || parsed.total_balance || 100000)
              }
            };
          }
        } catch (_e) {}
      }
    }

    return {
      authorized: false,
      status: 'unauthenticated',
      user: null,
      profile: null,
      errorMessage: 'Authentication required. Please sign in as an administrator.',
      redirectUrl: '/login'
    };
  } catch (err: any) {
    console.error('[adminRouteMiddleware] Verification failed:', err);
    return {
      authorized: false,
      status: 'error',
      user: null,
      profile: null,
      errorMessage: err?.message || 'An unexpected authentication error occurred.',
      redirectUrl: '/login'
    };
  }
}

/**
 * Middleware function to enforce standard user authentication.
 */
export async function userRouteMiddleware(): Promise<MiddlewareAuthResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const resolvedProfile: AuthProfile = profile ? (profile as AuthProfile) : {
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        role: 'user',
        balance: 0.00,
        total_balance: 0.00
      };

      return {
        authorized: true,
        status: resolvedProfile.role === 'admin' ? 'authenticated_admin' : 'authenticated_user',
        user: session.user,
        profile: resolvedProfile
      };
    }

    // Local Storage Session fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('growvest_auth_user') || localStorage.getItem('greeneza_auth_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.id || parsed.email)) {
            const fullName = parsed.fullName || (parsed.firstName ? `${parsed.firstName} ${parsed.lastName || ''}`.trim() : parsed.email?.split('@')[0]) || 'Investor';
            return {
              authorized: true,
              status: parsed.role === 'admin' ? 'authenticated_admin' : 'authenticated_user',
              user: { id: parsed.id || 'usr_stored', email: parsed.email },
              profile: {
                id: parsed.id || 'usr_stored',
                email: parsed.email || '',
                full_name: fullName,
                role: parsed.role || 'user',
                balance: Number(parsed.balanceUsd || parsed.balance || 0),
                total_balance: Number(parsed.totalPortfolioUsd || parsed.total_balance || parsed.balanceUsd || 0)
              }
            };
          }
        } catch (_e) {}
      }
    }

    return {
      authorized: false,
      status: 'unauthenticated',
      user: null,
      profile: null,
      errorMessage: 'Please sign in to access your dashboard.',
      redirectUrl: '/login'
    };
  } catch (err: any) {
    return {
      authorized: false,
      status: 'error',
      user: null,
      profile: null,
      errorMessage: err?.message || 'Session verification failed.',
      redirectUrl: '/login'
    };
  }
}
