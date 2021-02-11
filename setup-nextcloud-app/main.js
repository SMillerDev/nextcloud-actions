const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    try {
        const app       = core.getInput("app", {required: true})
        const check     = core.getInput("check-code", {required: true})
        const force     = core.getInput("force", {required: false})
        const serverDir = '../server'

        await exec.exec("mkdir", ["-p",`${serverDir}/apps/${app}`])
        await exec.exec("cp", ["-R", "./", `${serverDir}/apps/${app}`])

        process.chdir(serverDir)

        if (force) {
            await exec.exec("./occ", ["-f", "app:enable", app])
        }else {
            await exec.exec("./occ", ["app:enable", app])
        }

        if (check) {
            await exec.exec("./occ", ["app:check-code", app])
        }

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
