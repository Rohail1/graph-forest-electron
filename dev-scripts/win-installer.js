/**
 * Created by Rohail on 6/18/2017.
 */


const electronInstaller = require('electron-winstaller');

let resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './build/graph-forest-electron-win32-x64',
  outputDirectory: './build/setup',
  authors: 'Rohail Najam.',
  name : 'Graph-forest',
  setupIcon : './app/images/vdlogo.ico'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));