const path = require('path');
const fs = require('fs');
const co = require('co');
const prompt = require('co-prompt');
const jsonfile = require('jsonfile');
const rm = require("rimraf");
const download = require('download-git-repo');

// 重写package.json
const rewritePackage = function(dest, userSettings) {
    const target = path.join(dest, './', 'package.json');
    const remotePackage = jsonfile.readFileSync(target);
    const content = Object.assign({}, remotePackage, userSettings);
    jsonfile.writeFileSync(target, content, { spaces: 2 });
};

// 下载模板文件
const downloadTemplate = function(repo, dest, userSettings) {
    download(repo, dest, function(error) {
        if(error) {
            rm(dest, function(error) { if(error) console.log(error); });
            return console.log(error);
        }

        rewritePackage(dest, userSettings);
        console.log('--- download success ---');

        process.exit();
    });
};

module.exports = function(name) {
    co(function *() {
        if(!name) return console.log('--- no input project name ---');

        // 处理用户输入信息
        const projectName = yield prompt('Project name <vuex-app>: ');
        const mainEntry = yield prompt('Main <index.js>: ');
        const description = yield prompt('Description: ');
        const repositoryUrl = yield prompt('Repository url: ');
        const userSettings = {
            name: projectName || 'vuex-app',
            main: mainEntry || 'index.js',
            description,
            repository: {
                type: 'git',
                url: repositoryUrl
            }
        };

        // 目标路径
        const dest = path.resolve('./', name);

        // 脚手架仓库地址
        const repo = 'rabbitmu/mutu-cli-template';

        // 判断目标路径是否已经存在
        fs.exists(dest, function(isExist) {
            if(isExist) return console.log('--- ' + name + ' is an existing directory ---');

            fs.mkdir(dest, function(error) {
                if(error) return console.log(error);

                downloadTemplate(repo, dest, userSettings);
            });
        });
    });
};
