const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const fabricJSPath = path.join(__dirname, 'node_modules', 'fabric');

const npmBuild = spawn('node', ['run', 'build', 'modules=ALL', 'exclude=accessors,gestures', 'requirejs'], {
  cwd: fabricJSPath
});

npmBuild.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

npmBuild.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

npmBuild.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
