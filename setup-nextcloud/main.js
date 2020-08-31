const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    try {
        const cron             = core.getInput("cron")
        const version          = core.getInput("version", {required: true})
        const adminUser        = core.getInput("admin-user")
        const adminPassword    = core.getInput("admin-password")
        const databaseType     = core.getInput("database-type", {required: true})
        const databaseName     = core.getInput("database-name")
        const databaseUser     = core.getInput("database-user")
        const databasePassword = core.getInput("database-password")
        const serverDir        = '../server'

        let branch = `stable${version}`
        if (version === 'pre-release') {
            branch = 'master'
        }

        // Checkout the main server repo
        await exec.exec("git", ["clone", "https://github.com/nextcloud/server.git", "--recursive", "--depth=1", `--branch=${branch}`, serverDir])

        // Open nextcloud server directory
        process.chdir(serverDir)

        let setupArgs = [
            "maintenance:install",
            `--admin-user=${adminUser}`,
            `--admin-pass=${adminPassword}`,
            `--database=${databaseType}`
        ]
        if (databaseType !== 'sqlite') {
            setupArgs += [
                `--database-name=${databaseName}`,
                `--database-user=${databaseUser}`,
                `--database-pass=${databasePassword}`
            ]
        }

        // Setup install
        await exec.exec("./occ", setupArgs)

        if (cron) {
            await exec.exec("./occ", ["background:cron"])
        }

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
