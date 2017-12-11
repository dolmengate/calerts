const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

class SendMail {

    /**
     * Use the Ubuntu Sendmail utility to send an email to someone
     * This also saves a copy of the sent email to /src/emails/sent
     *
     * @param sender: string:       email address (or name) of sender
     * @param subject: string:      subject line
     * @param recipients: string:   email addresses of recipients separated by a single space
     * @param message: string:      body of the message to send
     * @returns {boolean}           true if it didn't fail lol
     */
    static send(sender, subject, recipients, message) {

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
        fs.writeFileSync(path.join(filePath, fileName), content);

        // set log level: -OLogLevel=9 NO WORKY
        // specify log file: -D ./your/logfile.txt NO WORKY
        let command = 'sendmail -t < ' + filePath + this.findNewestFilename(filePath);

        console.log('Sending email to recipients: ' + recipients);
        console.log(command);
        child_process.execSync(command);
        console.log('Completed.');

        return true;
    };

    /**
     * Gets the filename of the most recently created file in a directory.
     *
     * @param dir: string:  directory to find the newest file in
     * @returns string:     basename and extension of the newest file in dir
     */
    static findNewestFilename(dir) {

        let newest = '';
        let prev = 0;

        // return basename + extension of newest file
        fs.readdirSync(dir).forEach((file) => {
            if (fs.fstatSync(1, dir + file).birthtime > prev) // 1 is file descriptor (read)
                newest = file;
        });
        return newest;
    }
}

module.exports = SendMail;

