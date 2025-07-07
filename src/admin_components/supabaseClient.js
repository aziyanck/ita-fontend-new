
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flflrlrtahoybbxdkkah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmxybHJ0YWhveWJieGRra2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODQ0NzYsImV4cCI6MjA2NjA2MDQ3Nn0.bhgcTKL84-mruAiKuI9si_gCX9e3C6wvtzTz3sEb9zc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    cookieOptions: {
      maxAge: 43200, // 12 hours in seconds
    },
  },
});
