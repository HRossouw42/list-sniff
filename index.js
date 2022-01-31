#!/usr/bin/env node

const fs = require('fs'); //file system module
// const util = require('util'); // promisify
const chalk = require('chalk'); // colours for console log
const path = require('path'); // file path joining

const { lstat } = fs.promises; // destructure lstat from promises module
const log = console.log;

const targetDir = process.argv[2] || process.cwd(); //argv[2] are input arguments || current working directory

fs.readdir(
  targetDir,
  async (err, filenames) => {
    if (err) {
      // throw new Error(err);
      console.log(err);
    }

    // map promises array
    const statPromises = filenames.map((filename) => {
      return lstat(path.join(targetDir, filename)); // joins path and filename
    });

    // wait for all promises to resolve
    const allStats = await Promise.all(statPromises);

    // TODO: sort to insure directories are first

    // print out
    log(chalk.inverse('Bark! Finding files:'));
    for (let stats of allStats) {
      const index = allStats.indexOf(stats);

      if (stats.isFile()) {
        log(filenames[index]);
      } else {
        log(chalk.blue.bold(filenames[index]));
      }

      // console.log(filenames[index], stats.isFile());
    }
  }

  // serial processing for debug
  // Method 2
  // fs.readdir(
  //   process.cwd(),
  //   async (err, filenames) => {
  //     if (err) {
  //       // throw new Error(err);
  //       console.log(err);
  //     }

  //     console.log('Bork! Files found:');
  //     for (let filename of filenames) {
  //       try {
  //         const stats = await lstat(filename);

  //         console.log(filename, stats.isFile());
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }

  // Method 1
  // const lstat = (filename) => {
  //   return new Promise((resolve, reject) => {
  //     fs.lstat(filename, (err, stats) => {
  //       if (err) reject(err);

  //       resolve(stats);
  //     });
  //   });
  // };
);
