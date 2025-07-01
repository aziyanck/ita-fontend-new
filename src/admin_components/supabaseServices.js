// src/supabaseServices.js

import { supabase } from './supabaseClient';

// 1) Insert an invoice
export const insertInvoice = async (invoiceData) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoiceData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// 2) Insert a component
export const insertComponent = async (componentData) => {
  const { data, error } = await supabase
    .from('components')
    .insert([componentData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// 3) Insert a purchase item
export const insertPurchaseItem = async (purchaseData) => {
  const { data, error } = await supabase
    .from('purchase_items')
    .insert([purchaseData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getComponentDetails = async (componentId = null) => {
  let query = supabase.from('components').select('*');

  if (componentId) {
    query = query.eq('id', componentId).single();
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};


// 4) Update component quantity
export const updateComponentQty = async (compId, newQty) => {
  const { data, error } = await supabase
    .from('components')
    .update({ qty: newQty })
    .eq('id', compId)
    .select()
    .single();
  if (error) throw error;
  return data;
};



// Insert a new dealer
export const insertDealer = async (dealerName) => {
  const { data, error } = await supabase
    .from('dealers')
    .insert([{ name: dealerName }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get an existing dealer by name
export const getDealerByName = async (dealerName) => {
  const { data, error } = await supabase
    .from('dealers')
    .select('*')
    .eq('name', dealerName)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: no rows found
  return data; // Can be null if not found
};


// src/supabaseServices.js

export const getAllComponents = async () => {
  const { data, error } = await supabase
    .from('components')
    .select(`
      id,
      name,
      hsn,
      qty,
      brand,
      dealer:dealer_id (
        id,
        name
      )
    `)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};


export const getAllPurchases = async () => {
  const { data, error } = await supabase.from('purchase_items').select('*').order('id', { ascending: false });
  if (error) throw error;
  return data;
};
