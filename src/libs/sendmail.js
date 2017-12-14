const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const async = require('async');

/**
 * Use the Ubuntu Sendmail utility to send an email to someone
 * This also saves a copy of the sent email to /src/emails/sent
 * TODO add logging to sendmail to be sure mail is actually being sent
 *
 * @param sender: string:       email address (or name) of sender
 * @param subject: string:      subject line
 * @param recipients: string:   email addresses of recipients separated by a single space
 * @param message: string:      body of the message to send
 * @param callback
 */
exports.send = function (sender, subject, recipients, message, callback) {

    // construct email content
    let content =
        'To: ' + recipients + '\n' +
        'Subject: ' + subject + '\n' +
        'From: ' + sender + '\n' +
        '\n' +
        message;

    let filePath = path.join(__dirname, '..', 'emails', 'sent' , '/');
    let fileName = 'message_' + new Date().toISOString() + '.txt';

    // save a copy
    fs.writeFile(path.join(filePath, fileName), content, (err) => {
        if (err) throw err;
    });

    // set log level: -OLogLevel=9 NO WORKY
    // specify log file: -D ./your/logfile.txt NO WORKY

    // use the recently saved copy of the message as the input for the cli command
    let command = 'sendmail -t < ' + filePath;
    findNewestFilename(filePath, (lastCreatedFile) => {
        command = command + lastCreatedFile;
        console.log('Sending email to recipients: ' + recipients);
        console.log(command);
        child_process.exec(command, (err) => {
            if (err) throw err;
            callback();
        });
    });
};

/**
 * Gets the filename of the most recently created file in a directory.
 *
 * @param dir: string:  directory to find the newest file in
 * @param callback
 * @returns string:     basename and extension of the newest file in dir
 */
function findNewestFilename(dir, callback) {

        let newest = '';    // filename to return

        let prevBD = 0;       // birthdate of previous file in loop

        let remain = 0;     // number of files left to check

        // return basename + extension of newest file
        fs.readdir(dir, (err, files) => {
            remain = files.length;
            async.each(files, (file, next) => {
                fs.stat(dir + file, (err, fileStats) => {
                    if (err) throw err;
                    if (fileStats.birthtime > prevBD)
                        newest = file;
                    prevBD = fileStats.birthtime;
                    if (--remain === 0)
                        callback(newest);
                });
                next();
            }, (err) => {
                if (err) throw err;
            });
        });
}

// findNewestFilename(path.join(__dirname, '..', 'emails', 'sent', '/'), (file) => {
//     console.log(file);
// });