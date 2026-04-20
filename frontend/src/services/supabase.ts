import { createClient } from '@supabase/supabase-js'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABSE_ANON_KEY!

export const supabase = createClient('https://mdspkjuctxvkrkcfxwev.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc3BranVjdHh2a3JrY2Z4d2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDI5MTYsImV4cCI6MjA4OTUxODkxNn0.X1mMVayIZXnGITfEwMYU5QemDdEOwRtNnJEcsdSJUKQ')