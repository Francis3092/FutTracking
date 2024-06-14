import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseKEY = process.env.REACT_APP_ANON_KEY;

const supabase = createClient(supabaseURL, supabaseKEY);

export default supabase;