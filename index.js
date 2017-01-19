#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const rm = require("rimraf");
const download = require('download-git-repo');
const package = require('./package.json');

program.version(package.version);

program.usage('init [project-name]');

program.command('init [project-name]')
    .description('generate a new project')
    .action(function(name) {
        if(!name) return console.log('--- no input project name ---');

        // 目标路径
        const dest = path.resolve('./', name);
        console.log(dest);

        // 脚手架仓库地址
        const repo = 'rabbitmu/mutu-cli-template';

        // 判断目标路径是否已经存在
        fs.exists(dest, function(isExist) {
            if(isExist) return console.log('--- ' + name + ' is an existing directory ---');

            fs.mkdir(dest, function(error) {
                if(error) return console.log(error);

                download(repo, dest, { clone: true }, function(error) {
                    if(error) {
                        rm(dest, function(error) { if(error) console.log(error); });
                        return console.log(error);
                    }
                    console.log('--- download success ---');
                });
            });
        });
    });

program.parse(process.argv);
