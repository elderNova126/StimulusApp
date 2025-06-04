1. Get tenants from DB global.tenant table
2. Get tenants which have reporting enabled
3. Upload latest report for each one (in parallel)
4. Update tenant with reportId and workspaceId and by report code and type