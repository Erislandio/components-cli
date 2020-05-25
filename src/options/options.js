const inquirer = require("inquirer");
const path = require("path");
const logs = require("../common/chalk");
const fs = require("fs");

function capitalizeLetter(string) {

    const regex = new RegExp(/-/gm);

    if (regex.test(string)) {
        return string.split('-').map((str) => {
            return str[0].toUpperCase() +
                str.slice(1);
        }).join('')
    }

    const value = string[0].toUpperCase() +
        string.slice(1);

    return value
}

module.exports = {
    create: async (name) => {

        console.log(logs.info('Looking for manifet.json, await ...'))
        const pathToManifest = await fs.existsSync(path.resolve('./manifest.json'))

        if (!pathToManifest) {
            return console.log(logs.error('Manifest was not found in the directory, try the command vtex init.'))
        }

        console.log(logs.success('Manifest.json found'))

        try {

            const upper = capitalizeLetter(name)

            inquirer.prompt([
                {
                    type: 'list',
                    choices: [".js", ".tsx", ".jsx"],
                    name: 'extension',
                    message: `Select a extension to component ${upper}`,
                    default: "js"
                }
            ]).then(async ({ extension }) => {

                const storeFolder = await fs.existsSync(path.resolve('./store1'));
                if (!storeFolder) {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            message: "Store folder not found, do you want to create a folder called store?",
                            default: "yes",
                            name: "create"
                        }
                    ]).then(async ({ create }) => {
                        if (create) {

                            createFolder('store1')
                            createFile('blocks.json')
                            createFile('routes.json')
                            createFile('interfaces.json')
                        }

                        return console.log(logs.error('Store folder not found, impossible to continue'))

                    })
                }

                const interfacesFile = await fs.existsSync(path.resolve('./store1/interfaces.json'));

                if (!interfacesFile) {
                    createFile('interfaces.json')
                }

                fs.readFile(path.resolve('./store1/interfaces.json'), 'utf8', function (err, data) {

                    if (err) {
                        return console.log(logs.error('Unable to read interfaces.json file at this time, please try again'))
                    }

                    console.log(logs.info('Generating new file'))

                    const newData = {
                        [name]: {
                            component: upper
                        }
                    }

                    const content = JSON.parse(data);

                    const findValue = Object.values(content).filter((item) => {
                        if (item.component === upper) {
                            return true
                        }
                    }).filter(Boolean)

                    if (findValue.length) {
                        return console.log(logs.error(`${upper} component has already been created!`))
                    }

                    const values = Object.assign(content, newData);

                    fs.writeFile(path.resolve(`./store1/interfaces.json`), JSON.stringify(values), function (err, data) {

                        if (err) {
                            return console.log(logs.error(`Unable to write interfaces.json file at this time, please try again`))
                        }

                        return console.log(logs.success(`Interface ${name} was successfully generated!`))

                    });

                })

            })

        } catch (error) {
            return console.log(logs.error(`Could not create the component ${program.create}`))
        }
    }
}

const createFolder = (name) => {
    console.log(logs.info('creating, await ...'));
    fs.mkdir(path.resolve(`./${name}`), function (err, data) {

        if (err) {
            return console.log(logs.error('Unable to create store folder at this time, please try again'))
        }

        return console.log(logs.success(`Folder ${name} was created successfully!`))

    });
}


const createFile = (name) => {
    console.log(logs.info(`creating ${name} file, await ...`));
    const content = JSON.stringify({})

    fs.writeFile(path.resolve(`./store1/${name}`), content, function (err, data) {

        if (err) {
            return console.log(logs.error(`Unable to create ${name} file at this time, please try again`))
        }

        return console.log(logs.success(`${name} file was created successfully!`))

    });
}
