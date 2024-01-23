const axios = require('axios');
const args = process.argv.slice(2);
const [branch, version, webhook] = args;

if (!branch || !version || !webhook) {
    console.error('Usage: yarn notify :app :version :webhook');
    process.exit(0);
}

const app = branch === 'main' ? 'AppProd' : 'AppDev';
const message = `✅ Released ${app} \`${version}\``;

async function sendNotification() {
    try {
        await axios.post(webhook, {
            content: message,
        });
        console.log('Discord Message sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error.message);
    }
}

if (webhook) {
    sendNotification();
}
