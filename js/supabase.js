// Configuración y cliente global de Supabase
const SUPABASE_URL = 'https://ropescmhzqqelncsbdtg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P-1zA9LOp1A7zr-LEDGBxA_kbhmOFOb';

// Inicializar cliente accesible globalmente
const supabaseClient = (window.supabase && SUPABASE_URL) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;