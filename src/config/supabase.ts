import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL과 KEY를 환경변수에 설정해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);