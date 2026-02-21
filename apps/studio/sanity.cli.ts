import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: 'jqtpyzxf',
        dataset: 'production',
    },
    deployment: {
        autoUpdates: true,
    },
})
