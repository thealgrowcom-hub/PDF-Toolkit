import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhscohfxfhhujysjcsbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc2NvaGZ4ZmhodWp5c2pjc2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzExNzcsImV4cCI6MjA4ODIwNzE3N30.GWvvF4R5MdX4VM65bNC4YrON7cMM8fUthbtNZ8GaXQo';

export const supabase = createClient(supabaseUrl, supabaseKey);
