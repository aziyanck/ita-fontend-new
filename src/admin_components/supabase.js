import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://flflrlrtahoybbxdkkah.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmxybHJ0YWhveWJieGRra2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODQ0NzYsImV4cCI6MjA2NjA2MDQ3Nn0.bhgcTKL84-mruAiKuI9si_gCX9e3C6wvtzTz3sEb9zc";
const supabase = createClient(supabaseUrl, supabaseKey);

const getAll = async () => {
  const { data, error } = await supabase.from("products").select();
  if (error) {
    console.log("error happened", error);
    return;
  }
  if (data) {
    return data;
  }
};

const addProduct = async (item, hsn, in_stock = null) => {
  const { error } = await supabase
    .from("products")
    .insert({ item, hsn, in_stock });
  if (error) {
    console.log("errorhappend",error)
    return;
  }

};

export default { getAll, addProduct };
