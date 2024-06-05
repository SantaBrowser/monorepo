import { SES } from '@aws-sdk/client-ses';

const ses = new SES({
    region: 'ap-south-1',
});

function sendMail(to: string, subject: string, html: string) {
    ses.sendEmail(
        {
            Destination: { ToAddresses: [to] },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: html,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
            Source: 'Santabrowser <no-reply@santabrowser.com>',
        },
        console.log,
    );
}

export { ses, sendMail };
