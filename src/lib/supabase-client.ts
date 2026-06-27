import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  "https://mgqeswcsgdoopkvzekfm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncWVzd2NzZ2Rvb3Brdnpla2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTUyMzMsImV4cCI6MjA5Nzg3MTIzM30.2OGiFZehoOZRKHAPMMEHEearx96hkT82hQQUKol-dTU"
);
