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
    profit: project.profit,  // ✅ NEW LINE: include profit from DB
    status: project.status,
});


export async function getProjects() {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data.map(formatProjectForUI);
}

// === FUNCTION 1: CORRECTED ===
export async function addProjects(projects, status) {
    const projectsToInsert = projects.map(proj => {
    const final = parseFloat(proj.finalValue) || 0;
    const mat = parseFloat(proj.matExpenses) || 0;
    const labour = parseFloat(proj.labour) || 0;
    const ta = parseFloat(proj.ta) || 0;
    const profit = final - (mat + labour + ta);

    return {
        project_name: proj.project,
        client_name: proj.clientName,
        contact: proj.contact, 
        location: proj.location, 
        project_date: proj.date || null,
        invoice_no: proj.invoiceNo, 
        quoted_value: final, 
        final_value: final,
        material_expenses: mat, 
        labour_cost: labour, 
        ta_cost: ta,
        profit: profit,  // ✅ NEW LINE: Push calculated profit
        status: status,
    };
});


    const { data, error } = await supabase.from('projects').insert(projectsToInsert).select();
    if (error) throw error;
    return data.map(formatProjectForUI);
}

// === FUNCTION 2: CORRECTED ===
export async function updateProject(project) {
    const final = parseFloat(project.finalValue) || 0;
const mat = parseFloat(project.matExpenses) || 0;
const labour = parseFloat(project.labour) || 0;
const ta = parseFloat(project.ta) || 0;
const profit = final - (mat + labour + ta);

const projectToUpdate = {
    project_name: project.project,
    client_name: project.clientName,
    contact: project.contact, 
    location: project.location, 
    project_date: project.date || null,
    invoice_no: project.invoiceNo, 
    quoted_value: final, 
    final_value: final,
    material_expenses: mat, 
    labour_cost: labour, 
    ta_cost: ta,
    profit: profit,  // ✅ NEW LINE: Push calculated profit
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






