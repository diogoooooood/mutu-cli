#!/usr/bin/env node

const program = require('commander');
const init = require('./lib/init.js');
const package = require('./package.json');

program.version(package.version);

program.usage('init [project-name]');

program.command('init [project-name]')
    .description('generate a new project')
    .alias('i')
    .action(function(name) {
        init(name);
    });

program.parse(process.argv);
