import { createClient } from '@supabase/supabase-js'

const supabaseUrl = String(process.env.SUPABASE_URL)
const supabaseKey = String(process.env.SUPABASE_KEY)

export const supabase = createClient(supabaseUrl, supabaseKey)