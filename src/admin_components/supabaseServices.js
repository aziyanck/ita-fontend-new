// src/supabaseServices.js
import { supabase } from './supabaseClient';

const getAll = async () => {
  const { data, error } = await supabase
    .from('purchase_details')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }
  return data;
};

const addPurchase = async (purchaseData) => {
  const { data, error } = await supabase
    .from('purchase_details')
    .insert([purchaseData])
    .select();

  if (error) {
    console.error("Insert error:", error.details || error.message);
    return null;
  }
  return data;
};

// --- New function for bulk insertion ---
const addBulkPurchases = async (purchaseDataArray) => {
  const { data, error } = await supabase
    .from('purchase_details')
    .insert(purchaseDataArray)
    .select(); // Optionally select inserted data

  if (error) {
    console.error("Bulk insert error:", error.details || error.message);
    return { data: null, error };
  }
  return { data, error: null };
};
// --- End of new function ---

const updatePurchase = async (id, updatedData) => {
  const { data, error } = await supabase
    .from('purchase_details')
    .update(updatedData)
    .eq('id', id)
    .select();

  if (error) {
    console.error("Update error:", error);
    return null;
  }
  return data;
};

const deletePurchase = async (id) => {
  if (!id || typeof id !== 'string' || id.length < 10) {
    console.warn("Blocked delete: invalid ID →", id);
    return null; // Return null for invalid IDs to prevent unintended operations
  }
  const { data, error } = await supabase
    .from('purchase_details')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error("Delete error:", error);
    return null;
  }
  if (!data || data.length === 0) {
    console.warn("No rows deleted — check RLS or ID");
    return null;
  }
  return data;
};

// Export the new function along with existing ones
export default { getAll, addPurchase, updatePurchase, deletePurchase, addBulkPurchases };