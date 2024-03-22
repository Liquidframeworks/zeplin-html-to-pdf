const { spawn } = require("child_process");

module.exports = function (html, options = []) {
    return new Promise(((resolve, reject) => {

        var exec = require('child_process').exec, child;    
        child = exec('chmod +x lib/wkhtmltopdf',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });



        const bufs = [];
        const proc = spawn("/bin/sh", ["-o", "pipefail", "-c", `lib/wkhtmltopdf ${options.join(" ")} - - | cat`]);

        proc.on("error", error => {
            reject(error);
        }).on("exit", code => {
            if (code) {
                reject(new Error(`wkhtmltopdf process exited with code ${code}`));
            } else {
                resolve(Buffer.concat(bufs));
            }
        });

        proc.stdin.end(html);

        proc.stdout.on("data", data => {
            bufs.push(data);
        }).on("error", error => {
            reject(error);
        });
    }));
};