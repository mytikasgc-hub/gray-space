import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${name}`)
  }
  return value
}

/** Service-role client for trusted server operations (Apple auth, etc.) */
export function getServiceSupabase(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/** Lazy singleton — avoids crashing imports when env is unset at build time */
let _serviceClient: SupabaseClient | null = null
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!_serviceClient) {
      _serviceClient = getServiceSupabase()
    }
    const value = Reflect.get(_serviceClient, prop, receiver)
    return typeof value === 'function' ? value.bind(_serviceClient) : value
  },
})

/**
 * Request-scoped client that forwards the caller's Bearer token
 * so RLS policies see auth.uid().
 */
export async function createServerClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')

  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
