import { supabase } from '../supabaseClient';

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
    status: project.status,
});

export async function getProjects() {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data.map(formatProjectForUI);
}

// === FUNCTION 1: CORRECTED ===
export async function addProjects(projects, status) {
    const projectsToInsert = projects.map(proj => ({
        project_name: proj.project,
        client_name: proj.clientName,
        contact: proj.contact, 
        location: proj.location, 
        project_date: proj.date || null, // Send null if date is empty
        invoice_no: proj.invoiceNo, 
        // Convert empty strings to 0 for all numeric fields
        quoted_value: parseFloat(proj.quotedValue) || 0, 
        final_value: parseFloat(proj.finalValue) || 0,
        material_expenses: parseFloat(proj.matExpenses) || 0, 
        labour_cost: parseFloat(proj.labour) || 0, 
        ta_cost: parseFloat(proj.ta) || 0,
        status: status,
    }));

    const { data, error } = await supabase.from('projects').insert(projectsToInsert).select();
    if (error) throw error;
    return data.map(formatProjectForUI);
}

// === FUNCTION 2: CORRECTED ===
export async function updateProject(project) {
     const projectToUpdate = {
        project_name: project.project,
        client_name: project.clientName,
        contact: project.contact, 
        location: project.location, 
        project_date: project.date || null, // Send null if date is empty
        invoice_no: project.invoiceNo, 
        // Convert empty strings to 0 for all numeric fields
        quoted_value: parseFloat(project.quotedValue) || 0, 
        final_value: parseFloat(project.finalValue) || 0,
        material_expenses: parseFloat(project.matExpenses) || 0, 
        labour_cost: parseFloat(project.labour) || 0, 
        ta_cost: parseFloat(project.ta) || 0,
        status: project.status,
    };
    const { data, error } = await supabase.from('projects').update(projectToUpdate).eq('id', project.id).select();
    if (error) throw error;
    return formatProjectForUI(data[0]);
}

export async function deleteProject(projectId) {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
    return true;
}