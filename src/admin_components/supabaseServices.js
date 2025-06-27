// src/supabaseServices.js
import { supabase } from './supabaseClient'; // Assuming this correctly exports your supabase client

// --- Functions for the new purchase_masters table ---

const addPurchaseMaster = async (masterData) => {
  const { data, error } = await supabase
    .from('purchase_masters') // Correct: plural
    .insert([masterData])
    .select()
    .single();

  if (error) {
    console.error("Insert purchase_master error:", error.details || error.message);
    throw error; // Throw error to be caught by the calling component (PurchaseForm)
  }
  return data;
};

const getPurchaseMasters = async () => {
  const { data, error } = await supabase
    .from('purchase_masters') // Correct: plural
    // Select 'date' to match the database column name
    .select('invoice_no, date, distributor')
    .order('date', { ascending: false }); // Order by 'date'

  if (error) {
    console.error("Fetch purchase_masters error:", error.details || error.message);
    throw error;
  }
  return data;
};

// --- Functions for the new purchase_items table ---

const addPurchaseItems = async (itemsDataArray) => {
  const { data, error } = await supabase
    .from('purchase_items') // Correct: plural
    .insert(itemsDataArray)
    .select(); // Select inserted data for confirmation

  if (error) {
    console.error("Insert purchase_items error:", error.details || error.message);
    throw error; // Throw error to be caught by the calling component (PurchaseForm)
  }
  return data;
};

const getPurchaseItemsByInvoice = async (invoiceNo) => {
  const { data, error } = await supabase
    .from('purchase_items') // Correct: plural
    .select('*') // Select all item details
    .eq('invoice_no', invoiceNo) // Filter by the foreign key
    .order('product_name', { ascending: true }); // Order items within the invoice

  if (error) {
    console.error(`Fetch purchase_items for invoice ${invoiceNo} error:`, error.details || error.message);
    throw error;
  }
  return data;
};

// --- Existing functions (from your original supabaseServices.js, targeting 'purchase_details') ---
// I'm keeping these here, but they are not used by the new purchase flow.
// You can remove them if your 'purchase_details' table is no longer in use.
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

const addBulkPurchases = async (purchaseDataArray) => {
  const { data, error } = await supabase
    .from('purchase_details')
    .insert(purchaseDataArray)
    .select();

  if (error) {
    console.error("Bulk insert error:", error.details || error.message);
    return { data: null, error };
  }
  return { data, error: null };
};

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
    return null;
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

// Export all relevant functions
export default {
  // New functions for the normalized schema
  addPurchaseMaster,
  getPurchaseMasters,
  addPurchaseItems,
  getPurchaseItemsByInvoice,

  // Existing functions (from 'purchase_details' table) - keep if still needed for old data/features
  getAll,
  addPurchase,
  updatePurchase,
  deletePurchase,
  addBulkPurchases
};