const constrictorGlobalProjectAndSuppliers = async (elemets, tenant) => {
    let globalProjects = [];
    for (const project of elemets) {
        let globalProject = {};
        globalProject.projectId = project.id;
        globalProject.entityId = tenant;
        globalProjects.push(globalProject);
    }
    return [globalProjects];
}

const sliceRowsToInsert = (rows, slice = 1000) => {
    const totalRounds = Math.ceil(rows.length / slice);
    const rowsWithSlice = [];
    for (let i = 0; i < totalRounds; i++) {
        const rowsSlice = rows.slice(i * slice, (i + 1) * slice);
        rowsWithSlice.push(rowsSlice);
    }
    return rowsWithSlice;
}

const filterSupplier = (suppliers, globalSuppliers) => {
    const suppliersToInsert = suppliers.filter(supplier => {
        return globalSuppliers.findIndex(globalSupplier => globalSupplier.companyId === supplier.companyId && globalSupplier.globalProjectId === supplier.projectId) === -1;
    });
    return suppliersToInsert;
}

const machSupplierWithProject = async (projects, suppliers) => {
    const suppliersWithProject = projects.map(project => {
        const suppliersForProject = suppliers.filter(supplier => supplier.projectId === project.projectId);
        return suppliersForProject.map(supplier => {
            return {
                projectId: project.id,
                companyId: supplier.companyId,
                tenantProjectId: project.projectId
            };
        });
    }
    );
    return suppliersWithProject.flat();
}

const filterTheProject = async (projectTenatn, globalProjects) => {
    const projects = projectTenatn.filter(project => {
        return globalProjects.findIndex(globalProject => globalProject.projectId === project.id) === -1;
    }
    );
    return projects;
}

const schemas = [
    {
        name: "University of Pennsylvania",
        shemaName: "university_of_pennsylvania"
    },
    {
        name: "Aramark Corporation",
        shemaName: "aramark_corporation"
    },
    {
        name: "Chop",
        shemaName: "chop"
    },
    {
        name: "Community College of Philadelphia",
        shemaName: "community_college_of_philadelphia"
    },
    {
        name: "Drexel University",
        shemaName: "drexel_university"
    },
    {
        name: "Economy League",
        shemaName: "economy_league"
    },
    {
        name: "Independence Blue Cross",
        shemaName: "independence_blue_cross"
    },
    {
        name: "Penn Medicine",
        shemaName: "penn_medicine"
    },
    {
        name: "Promptworks",
        shemaName: "promptworks"
    },
    {
        name: "Stimulus",
        shemaName: "stimulus"
    },
    {
        name: "Think Company",
        shemaName: "think_company"
    },
    {
        name: "Thomas Jefferson University Hospitals",
        shemaName: "thomas_jefferson_university_hospitals"
    },

];


module.exports = {
    schemas,
    constrictorGlobalProjectAndSuppliers,
    sliceRowsToInsert,
    filterSupplier,
    machSupplierWithProject,
    filterTheProject
};