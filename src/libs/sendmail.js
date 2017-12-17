const child_process = require('child_process');
const db = require('../db');

/**
 * Use the Ubuntu Sendmail utility to send an email to someone
 * This also saves a copy of the sent email to the database collection Emails
 * TODO add logging to sendmail to be sure mail is actually being sent
 *
 * @param senderAddress: string:        email address (or name) of sender
 * @param subject: string:              subject line
 * @param recipientAddress: string:     email addresses of recipient
 * @param message: string:              the content of the email (the message itself)
 * @param type: string:                 the reason for the email being sent ('verification' or 'scheduled-alert')
 * @param callback
 */
exports.send = function (senderAddress, subject, recipientAddress, message, type, callback) {

    // construct email content
    let email =
        'To: ' + recipientAddress + '\n' +
        'Subject: ' + subject + '\n' +
        'From: ' + senderAddress + '\n' +
        '\n' +
        message;

    // set log level: -OLogLevel=9                  NO WORKY
    // specify log file: -D ./your/logfile.txt      NO WORKY

    let command = 'echo "' + email + '" | sendmail -t -f ' + senderAddress;
    console.log('Sending email to recipient: ' + recipientAddress);
    console.log(command);
    child_process.exec(command, (err) => {
        if (err) throw err;
        callback();
    });

    // don't wait for async write to DB to complete
    db.saveEmail(recipientAddress, new Date().getTime(), email, type,() => { console.log('Email saved')});
};
