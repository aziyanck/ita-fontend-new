// supabaseService.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://flflrlrtahoybbxdkkah.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // ✅ safer via .env

export const supabase = createClient(supabaseUrl, supabaseKey);

const getAll = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.log("Fetch error:", error);
    return [];
  }
  return data;
};

const addProduct = async (item, hsn, in_stock = null) => {
  const { data, error } = await supabase
    .from("products")
    .insert([{ item, hsn, in_stock }]) // ✅ make it an array
    .select(); // ✅ return inserted row

  if (error) {
    console.log("Insert error:", error);
    return null;
  }

  return data;
};

export default { getAll, addProduct };
