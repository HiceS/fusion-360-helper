import * as vscode from 'vscode';
const execFile = require('child_process').execFile;
const exec = require('child_process').exec;

import {getOS} from './utilities';
import {OS} from './types';

import path = require('path');
import fs = require('fs');
import { F_OK } from 'constants';

import {fusionMenuItem} from './extension';

// Windows Path
// C:\Users\[name]\AppData\Local\Autodesk\webdeploy\production\6a0c9611291d45bb9226980209917c3d

// OSX Path
// /Users/[name]/Library/Application Support/Autodesk/webdeploy/production/1b7a11f5bfe54ff0933e8d22edb9271a12e4377a/Autodesk Fusion 360.app/Contents/Frameworks/Qt/Q

export function launchFusion360(){
    checkFusionOpen(true);
}

export async function checkFusionOpen(open = false){
    // if windows
    let running: boolean;

    if (getOS() === OS.windows){
        running = await isProcessRunning('Fusion360.exe');
    }
    else{
        running = await isProcessRunning('Fusion 360.app');
    }

    setFusionMenuText(running);

    if (running){
        //vscode.window.setStatusBarMessage("Fusion 360 is currently open");
        // maybe focus on the window in a windows way
        // probably close it now ?
    }else{
        //vscode.window.setStatusBarMessage("Fusion 360 is currently closed");
        // now we need to open it
        if (open){
            findFusion360Executable(getOS());
            setFusionMenuText(running);
        }
    }
}

async function findFusion360Executable(os: OS) {
    let fusPath: string = "";
    let exeName: string = "";

    if (os === OS.windows){
        if (process.env.APPDATA){
            fusPath = path.join(process.env.APPDATA, '..', 'Local', 'Autodesk', 'webdeploy', 'production');
            exeName = "Fusion360.exe";
        }
    }else {
        // OSX
        // /Users/[name]/Library/Application Support/Autodesk/webdeploy/production/
        // process.env.HOME + Library
        if (process.env.HOME){
            fusPath = path.join(process.env.HOME, 'Library', 'Application Support', 'Autodesk', 'webdeploy', 'production');
            exeName = `Autodesk Fusion 360.app`;
        }
    }

    if (fusPath === "" || exeName === ""){
        return;
    }

    // There is no decent way to check if this was successful
    fs.readdir(fusPath, (err, files) => {
        if (err){
            return;
        }
        let entirePath = "";

        // Looks through each folder in the fusPath
        files.forEach(folder => {
            // This would be the executable
            entirePath = path.join(fusPath, folder, exeName);
            // Attempts to access the file to see if it exists
            fs.access(entirePath, F_OK, err => {
                if (!err){
                    spawnExec(exeName, path.join(fusPath, folder));
                }
            });
        });
    });
}

/**
 * Spawns a executable in a given path using a async promise to await result if needed.
 * This might only work on Windows, you need to call `open [appname]` on OSX
 * @param fileName Executable name
 * @param path Path for the executable
 */
function spawnExec(fileName: string, fpath: string) : Promise<string>{
    let promise: Promise<string> = new Promise((resolve, reject) => {
        if (getOS() === OS.windows){
            execFile(fileName, [], { cwd: fpath }, function(err: string, data: any) {
                setFusionMenuText(false);
                if (err){
                    reject(err);
                }
                else {
                    resolve(data.toString());
                }
            });
        }else {
            let fullname = path.join(fpath, fileName);
            exec(`open ${fullname}`, (err: string, stdout: any, stderr: any) => {
                setFusionMenuText(false);
                
                if (stderr){
                    console.log(stderr.toString());
                }

                if(err){
                    console.log(err);
                }
            });
        }
    });
    return promise;
}

/**
 * Helpful macro I modified to check for active process and return true / false with a callback
 * @param query Name of process
 * @param cb Callback function
 */
const isRunning = (query: string, cb: (arg: boolean) => void ) => {
    const platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err: string, stdout: any, stderr: any) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
};

/**
 * Amazing function I found and modified to use promises to find current process names
 * @param processName Process Name
 */
export async function isProcessRunning(processName: string): Promise<boolean> {
    const cmd = (() => {
      switch (process.platform) {
        case 'win32': return `tasklist`;
        case 'darwin': return `ps aux | grep -v grep | grep -o -a -m 1 "${processName}"`; 
        case 'linux': return `ps -A`;
        default: return false;
      }
    })();
  
    return new Promise((resolve, reject) => {
      require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
        if (stderr) {
            reject(stderr.toLowerCase());
        }
  
        resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1);
      });
    });
}

function setFusionMenuText(open: boolean){
    if (open){
        fusionMenuItem.text = "$(debug-stop) Fusion 360 is running";
    }else {
        fusionMenuItem.text = "$(debug-start) Open Fusion 360";
    }
}