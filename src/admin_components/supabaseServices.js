// src/supabaseServices.js

import { supabase } from "./supabaseClient"

const BACKEND_URL = "https://jobqueue.onrender.com"

// 1) Insert an invoice
export const insertInvoice = async (invoiceData) => {
  const { data, error } = await supabase
    .from("invoices")
    .insert([invoiceData])
    .select()
    .single()
  if (error) throw error
  return data
}

// 2) Insert a component
export const insertComponent = async (componentData) => {
  const { data, error } = await supabase
    .from("components")
    .insert([componentData])
    .select()
    .single()
  if (error) throw error
  return data
}

// 3) Insert a purchase item
export const insertPurchaseItem = async (purchaseData) => {
  const { data, error } = await supabase
    .from("purchase_items")
    .insert([purchaseData])
    .select()
    .single()
  if (error) throw error
  return data
}

// 4) Insert a sell item
export const insertSellItem = async (sellItemData) => {
  const { data, error } = await supabase
    .from("sell_items")
    .insert([sellItemData])
    .select()
    .single()
  if (error) throw error
  return data
}

export const getComponentDetails = async (componentId = null) => {
  let query = supabase.from("components").select("*")

  if (componentId) {
    query = query.eq("id", componentId).single()
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// 5) Update component quantity
export const updateComponentQty = async (compId, newQty) => {
  const { data, error } = await supabase
    .from("components")
    .update({ qty: newQty })
    .eq("id", compId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Insert a new dealer
export const insertDealer = async (dealerName) => {
  const { data, error } = await supabase
    .from("dealers")
    .insert([{ name: dealerName }])
    .select()
    .single()
  if (error) throw error
  return data
}

// Get an existing dealer by name
export const getDealerByName = async (dealerName) => {
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("name", dealerName)
    .single()
  if (error && error.code !== "PGRST116") throw error // PGRST116: no rows found
  return data // Can be null if not found
}

// src/supabaseServices.js

export const getAllComponents = async () => {
  const { data, error } = await supabase
    .from("components")
    .select(
      `
    id,
    name,
    hsn,
    qty,
    brand,
    dealer:dealer_id (
      id,
      name
    ),
    category:category_id (
      id,
      name
    )
  `,
    )
    .order("name", { ascending: true })

  if (error) throw error
  return data
}

export const getPurchasesSummary = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      invoice_no,
      date,
      total_amount,
      dealer:dealer_id ( name )
    `,
    )
    .eq("invoice_type", "purchase")
    .order("date", { ascending: false })

  if (error) throw error

  return data.map((inv) => ({
    invoice_no: inv.invoice_no,
    date: inv.date,
    dealer: inv.dealer?.name || "N/A",
    total_amount: inv.total_amount,
  }))
}

//display inv details
export const getSalesInvoiceDetails = async (invoiceNo) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      invoice_no,
      date,
      total_amount,
      customer,
      url,
      sell_items (
        id,
        qty,
        price,
        component:comp_id (
          name,
          hsn,
          brand
        )
      )
    `,
    )
    .eq("invoice_no", invoiceNo)
    .eq("invoice_type", "sell")
    .single()

  if (error) throw error
  return data
}

export const getInvoiceDetails = async (invoiceNo) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      invoice_no,
      date,
      total_amount,
      purchase_items (
        id,
        qty,
        price,
        component:comp_id (
          name,
          hsn,
          brand,
          dealer:dealer_id ( name ) 
        )
      )
    `,
    )
    .eq("invoice_no", invoiceNo)
    .single()

  if (error) throw error
  return data
}

export const getLatestInvoiceNumber = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select("invoice_no")
    .eq("invoice_type", "sell")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return data ? data.invoice_no : null
}

export async function getSellsSummary() {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      invoice_no,
      total_amount,
      date,
      customer
    `,
    )
    .eq("invoice_type", "sell")

  if (error) throw error
  return data
}

// for projects
export async function getAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*, clients(name, phone)") // fetch related client data

  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }

  return data
}

export async function getProjectStatuses() {
  const { data, error } = await supabase.from("projects").select("status") // Only get the status field

  if (error) {
    console.error("Error fetching project statuses:", error)
    throw error
  }

  return data // Array of objects like [{ status: 'In Progress' }, ...]
}

export async function getProjectProfits(startDate, endDate) {
  const now = new Date()
  const start = startDate || `${now.getFullYear()}-01-01`
  const end = endDate || `${now.getFullYear()}-12-31`

  const { data, error } = await supabase
    .from("projects")
    .select("project_date, profit, status")
    .gte("project_date", start)
    .lte("project_date", end)

  if (error) {
    console.error("Error fetching project profits:", error)
    throw error
  }

  return data
}

export async function getMonthlyProfitSums() {
  const now = new Date()

  // Calculate start of current month
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString()
  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).toISOString()

  // Calculate start of previous month
  const prevMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  ).toISOString()
  const currentMonthStartForPrev = currentMonthStart // reuse as previous month end

  // --- Query current month profit sum (Completed only) ---
  let { data: currentData, error: currentError } = await supabase
    .from("projects")
    .select("profit")
    .eq("status", "Completed") // ✅ Only completed projects
    .gte("project_date", currentMonthStart)
    .lt("project_date", nextMonthStart)

  if (currentError) throw currentError

  const currentMonthProfit = currentData.reduce(
    (sum, proj) => sum + (proj.profit || 0),
    0,
  )

  // --- Query previous month profit sum (Completed only) ---
  let { data: prevData, error: prevError } = await supabase
    .from("projects")
    .select("profit")
    .eq("status", "Completed") // ✅ Only completed projects
    .gte("project_date", prevMonthStart)
    .lt("project_date", currentMonthStartForPrev)

  if (prevError) throw prevError

  const previousMonthProfit = prevData.reduce(
    (sum, proj) => sum + (proj.profit || 0),
    0,
  )

  return {
    currentMonth: currentMonthProfit,
    previousMonth: previousMonthProfit,
  }
}

export async function getCompletedProjectCounts() {
  const now = new Date()

  // Start and end for current month
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString()
  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).toISOString()

  // Start and end for previous month
  const prevMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  ).toISOString()
  const currentMonthStartForPrev = currentMonthStart

  // --- Query current month completed projects count ---
  const { count: currentCount, error: currentError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed")
    .gte("project_date", currentMonthStart)
    .lt("project_date", nextMonthStart)

  if (currentError) throw currentError

  // --- Query previous month completed projects count ---
  const { count: prevCount, error: prevError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed")
    .gte("project_date", prevMonthStart)
    .lt("project_date", currentMonthStartForPrev)

  if (prevError) throw prevError

  return {
    currentMonth: currentCount || 0,
    previousMonth: prevCount || 0,
  }
}

export async function getOngoingProjectsCount() {
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "Ongoing")

  if (error) throw error

  return count || 0
}

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const registerUser = async (email, password, name) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken) {
    throw new Error("Authentication required: No active session found.")
  }

  const response = await fetch(`${BACKEND_URL}/api/admin/register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, password, name, role: "employee" }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to register user via backend.")
  }
  return data
}

export const registerAdmin = async (email, password, name) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken) {
    throw new Error("Authentication required: No active session found.")
  }

  const response = await fetch(`${BACKEND_URL}/api/admin/register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, password, name, role: "admin" }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to register admin via backend.")
  }
  return data
}

export const getAllUsers = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken) {
    throw new Error("Authentication required: No active session found.")
  }

  const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  console.log("getAllUsers: Fetch Response:", response) // LOG

  const data = await response.json()

  console.log("getAllUsers: Response Data:", data) // LOG

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch users via backend.")
  }
  return data
}

export const deleteUser = async (userId) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken) {
    throw new Error("Authentication required: No active session found.")
  }

  const response = await fetch(`${BACKEND_URL}/api/admin/user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user via backend.")
  }
  return data
}

export async function getUpcomingProjectsCount() {
  const { count, error } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "Upcoming")

  if (error) {
    console.error("Error fetching upcoming projects count:", error)
    throw error
  }

  return count
}
export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    return user
  }
  return null
}

export async function getFinancialYearProfitSums() {
  const now = new Date()
  const year = now.getFullYear()

  // Determine start and end of current financial year
  const isBeforeApril = now.getMonth() < 3 // Jan(0)–Mar(2)
  const fyStartYear = isBeforeApril ? year - 1 : year
  const fyEndYear = fyStartYear + 1

  const thisFYStart = new Date(fyStartYear, 3, 1).toISOString() // April 1
  const nextFYStart = new Date(fyEndYear, 3, 1).toISOString() // Next April 1

  const prevFYStart = new Date(fyStartYear - 1, 3, 1).toISOString()
  const thisFYStartForPrev = thisFYStart

  // This financial year profit
  const { data: thisFYData, error: thisFYError } = await supabase
    .from("projects")
    .select("profit")
    .eq("status", "Completed")
    .gte("project_date", thisFYStart)
    .lt("project_date", nextFYStart)

  if (thisFYError) throw thisFYError

  const thisYearProfit = thisFYData.reduce(
    (sum, proj) => sum + (proj.profit || 0),
    0,
  )

  // Previous financial year profit
  const { data: prevFYData, error: prevFYError } = await supabase
    .from("projects")
    .select("profit")
    .eq("status", "Completed")
    .gte("project_date", prevFYStart)
    .lt("project_date", thisFYStartForPrev)

  if (prevFYError) throw prevFYError

  const lastYearProfit = prevFYData.reduce(
    (sum, proj) => sum + (proj.profit || 0),
    0,
  )

  return {
    thisFY: thisYearProfit,
    lastFY: lastYearProfit,
  }
}
//contact_form
export const getContactSubmissions = async () => {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false }) // Show newest first

  if (error) throw error
  return data
}

export async function getFinancialYearMonthlyProfits() {
  const now = new Date()
  const year = now.getFullYear()
  const isBeforeApril = now.getMonth() < 3
  const fyStartYear = isBeforeApril ? year - 1 : year
  const fyEndYear = fyStartYear + 1

  const start = new Date(fyStartYear, 3, 1) // April 1st
  const end = new Date(fyEndYear, 3, 1) // Next March 31

  const { data, error } = await supabase
    .from("projects")
    .select("project_date, profit")
    .eq("status", "Completed")
    .gte("project_date", start.toISOString())
    .lt("project_date", end.toISOString())

  if (error) throw error

  const monthlyProfits = {}

  data.forEach(({ project_date, profit }) => {
    const date = new Date(project_date)
    const month = date.toLocaleString("default", { month: "short" }) // e.g., Apr
    monthlyProfits[month] = (monthlyProfits[month] || 0) + (profit || 0)
  })

  const monthsOrder = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ]

  return monthsOrder.map((month) => ({
    month,
    profit: monthlyProfits[month] || 0,
  }))
}

export async function getMonthlyProfitsByFY(fyStartYear) {
  const fyEndYear = fyStartYear + 1

  const start = new Date(fyStartYear, 3, 1) // April 1
  const end = new Date(fyEndYear, 3, 1) // next year April 1

  const { data, error } = await supabase
    .from("projects")
    .select("project_date, profit")
    .eq("status", "Completed")
    .gte("project_date", start.toISOString())
    .lt("project_date", end.toISOString())

  if (error) throw error

  const monthlyProfits = {}
  data.forEach(({ project_date, profit }) => {
    const date = new Date(project_date)
    const month = date.toLocaleString("default", { month: "short" })
    monthlyProfits[month] = (monthlyProfits[month] || 0) + (profit || 0)
  })

  const monthsOrder = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ]

  return monthsOrder.map((month) => ({
    month,
    profit: monthlyProfits[month] || 0,
  }))
}

// supabaseServices.js
export const getAllClientsWithProjects = async () => {
  const { data, error } = await supabase.from("clients").select(`
      id,
      name,
      phone,
      projects (
        id,
        project_name,
        project_date,
        status,
        location,
        profit,
        invoice_no
      )
    `)

  if (error) throw error
  return data
}
