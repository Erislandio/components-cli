#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const figlet = require("figlet");
const logs = require("./common/chalk");
const { create } = require("./options/options.js")
const spinner = require("./common/spinner");

program.version(require('../package.json').version);

function buildProgram() {
    program
        .option("-c, --create <name>", "Create a component React ex: --create SliderBar jsx")
        .option("--banner", "Show banner");
    program.parse(process.argv);
}

function runCommand() {
    if (program.create) {
        return create(program.create)
    }

    if (program.banner) {
        return banner();
    }
}

function banner() {
    return figlet("\n COMPONENT CLI \n ", function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(logs.success('Developed by: Erislandio Soares ;-)'))
        return console.log(logs.warning(data));
    });
}

(async function run() {
    buildProgram();
    runCommand();
})()