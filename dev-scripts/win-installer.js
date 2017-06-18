/**
 * Created by Rohail on 6/18/2017.
 */


const electronInstaller = require('electron-winstaller');

let resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './build/graph-forest-electron-win32-x64',
  outputDirectory: './build/installer64',
  authors: 'Rohail Najam.',
  name : 'Graph-forest',
  exe : 'graph-forest-electron.exe',
  setupIcon : './app/images/vdlogo.ico'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));