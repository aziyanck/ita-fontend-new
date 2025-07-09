import { supabase } from '../supabaseClient';


async function getOrCreateClient(name, phone) {
  const { data: existingClient, error } = await supabase
    .from('clients')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (existingClient) return existingClient.id;

  const { data: newClient, error: insertError } = await supabase
    .from('clients')
    .insert({ name, phone })
    .select()
    .single();

  if (insertError) throw insertError;

  return newClient.id;
}


const formatProjectForUI = (project) => ({
    id: project.id,
    project: project.project_name,
    clientName: project.client_name,
    contact: project.contact,
    location: project.location,
    date: project.project_date,
    invoiceNo: project.invoice_no,
    quotedValue: project.quoted_value,
    finalValue: project.final_value,
    matExpenses: project.material_expenses,
    labour: project.labour_cost,
    ta: project.ta_cost,
    profit: project.profit,  // ✅ NEW LINE: include profit from DB
    status: project.status,
});


export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients (
        name,
        phone
      )
    `);

  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    project: p.project_name,
    clientName: p.clients?.name,
    contact: p.clients?.phone,
    location: p.location,
    date: p.project_date,
    invoiceNo: p.invoice_no,
    quotedValue: p.quoted_value,
    finalValue: p.final_value,
    matExpenses: p.material_expenses,
    labour: p.labour_cost,
    ta: p.ta_cost,
    profit: p.profit,
    status: p.status
  }));
}


// === FUNCTION 1: CORRECTED ===
export async function addProjects(projects, status) {
  const formatted = [];

  for (const proj of projects) {
    const client_id = await getOrCreateClient(proj.clientName, proj.contact);

    const final = parseFloat(proj.finalValue) || 0;
    const mat = parseFloat(proj.matExpenses) || 0;
    const labour = parseFloat(proj.labour) || 0;
    const ta = parseFloat(proj.ta) || 0;
    const profit = final - (mat + labour + ta);

    formatted.push({
      project_name: proj.project,
      client_id,
      location: proj.location,
      project_date: proj.date || null,
      invoice_no: proj.invoiceNo,
      quoted_value: final,
      final_value: final,
      material_expenses: mat,
      labour_cost: labour,
      ta_cost: ta,
      profit,
      status,
    });
  }

  const { data, error } = await supabase.from('projects').insert(formatted).select(`
    *,
    clients (
      name,
      phone
    )
  `);

  if (error) throw error;

  return data.map(formatProjectForUI);
}


// === FUNCTION 2: CORRECTED ===
export async function updateProject(project) {
  const client_id = await getOrCreateClient(project.clientName, project.contact);

  const final = parseFloat(project.finalValue) || 0;
  const mat = parseFloat(project.matExpenses) || 0;
  const labour = parseFloat(project.labour) || 0;
  const ta = parseFloat(project.ta) || 0;
  const profit = final - (mat + labour + ta);

  const projectToUpdate = {
    project_name: project.project,
    client_id,
    location: project.location,
    project_date: project.date || null,
    invoice_no: project.invoiceNo,
    quoted_value: final,
    final_value: final,
    material_expenses: mat,
    labour_cost: labour,
    ta_cost: ta,
    profit,
    status: project.status,
  };

  const { data, error } = await supabase
    .from('projects')
    .update(projectToUpdate)
    .eq('id', project.id)
    .select(`
      *,
      clients (
        name,
        phone
      )
    `);

  if (error) throw error;

  return formatProjectForUI(data[0]);
}


export async function deleteProject(projectId) {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
    return true;
}






