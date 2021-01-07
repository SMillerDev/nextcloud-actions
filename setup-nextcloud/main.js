const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    try {
        const cron          = core.getInput("cron")
        const version       = core.getInput("version", {required: true})
        //User settings
        const adminUser     = core.getInput("admin-user")
        const adminPassword = core.getInput("admin-password")
        const adminEmail    = core.getInput("admin-email")
        //Database settings
        const dbType        = core.getInput("database-type", {required: true})
        const dbName        = core.getInput("database-name")
        const dbUser        = core.getInput("database-user")
        const dbPassword    = core.getInput("database-password")
        const dbHost        = core.getInput("database-host")
        const dbPort        = core.getInput("database-port")
        const dbTablePrefix = core.getInput("database-table-prefix")
        const dbTableSpace  = core.getInput("database-table-space")
        // File locations
        const dataDir       = core.getInput("data-dir")
        const serverDir     = core.getInput("server-dir")

        // Checkout the main server repo
        await exec.exec("git", ["clone", "https://github.com/nextcloud/server.git", "--recursive", "--depth=1", `--branch=${version}`, serverDir])

        // Open nextcloud server directory
        process.chdir(serverDir)

        let setupArgs = [
            "maintenance:install",
            `--admin-user=${adminUser}`,
            `--admin-pass=${adminPassword}`,
            `--admin-email=${adminEmail}`,
            `--database=${dbType}`,
        ]

        if (dataDir) {
            setupArgs = setupArgs.concat([`--data-dir=${dataDir}`])
        }

        if (dbType !== 'sqlite') {
            setupArgs = setupArgs.concat([
                `--database-name=${dbName}`,
                `--database-user=${dbUser}`,
                `--database-pass=${dbPassword}`,
            ])

            if (dbHost) {
                setupArgs = setupArgs.concat([`--database-host=${dbHost}`])
            }

            if (dbPort) {
                setupArgs = setupArgs.concat([`--database-port=${dbPort}`])
            }

            if (dbTablePrefix) {
                setupArgs = setupArgs.concat([`--database-table-prefix=${dbTablePrefix}`])
            }

            if (dbTableSpace) {
                setupArgs = setupArgs.concat([`--database-table-space=${dbTableSpace}`])
            }
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
