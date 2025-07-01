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

export const getPurchasesSummary = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      invoice_no,
      date,
      purchase_items:purchase_items (
        qty,
        price,
        comp_id,
        component:comp_id (
          dealer:dealer_id (
            name
          )
        )
      )
    `)
    .eq('invoice_type', 'purchase')
    .order('date', { ascending: false });

  if (error) throw error;

  const summaries = data.map((invoice) => {
    let totalAmount = 0;
    let dealerName = 'N/A';

    if (invoice.purchase_items && invoice.purchase_items.length > 0) {
      totalAmount = invoice.purchase_items.reduce(
        (sum, item) => sum + (item.qty * item.price),
        0
      );
      const firstDealer = invoice.purchase_items[0].component?.dealer?.name;
      dealerName = firstDealer || 'N/A';
    }

    return {
      invoice_no: invoice.invoice_no,
      date: invoice.date,
      dealer: dealerName,
      total: totalAmount ?? 0,
    };
  });

  return summaries;
};