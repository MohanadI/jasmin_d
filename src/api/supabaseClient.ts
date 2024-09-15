
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yqhnurkfkacffdjqestq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaG51cmtma2FjZmZkanFlc3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzNDU0MDksImV4cCI6MjA0MTkyMTQwOX0.zyDSVtl8lRwYHi2VTD7H2LmfdHMZ79y5orz0sLB6YVY"
export const supabase = createClient(supabaseUrl, supabaseKey)