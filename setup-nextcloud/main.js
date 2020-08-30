const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    try {
        const cron             = core.getInput("cron")
        const version          = core.getInput("version")
        const adminUser        = core.getInput("admin-user")
        const adminPassword    = core.getInput("admin-password")
        const databaseType     = core.getInput("database-type")
        const databaseName     = core.getInput("database-name")
        const databaseUser     = core.getInput("database-user")
        const databasePassword = core.getInput("database-password")

        let branch = "stable${version}"
        if (version === 'pre-release') {
            branch = 'master'
        }

        // Checkout the main server repo
        await exec.exec("git", ["clone", "https://github.com/nextcloud/server.git", "--recursive", "--depth=1", "--branch=${branch}", "nextcloud"])

        // Open nextcloud server directory
        process.chdir('nextcloud')

        await exec.exec("./occ", [
            "maintenance:install",
            "--admin-user=${adminUser}",
            "--admin-pass=${adminPassword}",
            "--database=${databaseType}",
            "--database-name=${databaseName}",
            "--database-user=${databaseUser}",
            "--database-pass=${databasePassword}"
        ])

        if (cron) {
            await exec.exec("./occ", ["background:cron"])
        }

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
