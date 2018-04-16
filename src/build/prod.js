const fs          = require('fs');
const shell       = require('shelljs');
const path        = require('path');
const spawn       = require('child_process').spawn;
const exec        = require('child_process').exec;
const Build       = require('./index');

class ProdBuild extends Build {
    constructor(program) {
        super(program);
    }

    init() {

        (async () => {
            const lib = await this.copyBatch(this.config.lib['prod'], this.config.lib.dist);
            const publicDir = await this.copyDir(path.normalize(this.config.src + '/public'), this.config.build);
            const template = await this.formatIndex(path.normalize(this.config.src + '/public/index.html'));
        })();

        (async () => {
            const copyMain = await shell.cp('main.ts', 'main.js');
            const src = await this.compile();
            const bundle = await this.bundle();
        })();

    }

    bundle() {

        let cmd = 'java -jar node_modules/google-closure-compiler/compiler.jar '+
        '--flagfile closure.conf '+
        '--js_output_file ./build/bundle.js';

        console.log('Closure Compiler started');

        return exec(cmd, {}, () => {
            console.log('Closure Compiler finished');
        })

    }


}

module.exports = ProdBuild;