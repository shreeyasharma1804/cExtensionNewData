const express = require('express')
const app = express()
const port = 3000
const notifier = require('node-notifier');

app.get('/Notification', (req, res) => {
    notifier.notify({
        title: 'Case Alert',
        message: 'New case in the bin',
        icon: 'icons8-email-48.png',
        sound: true,
        wait: false
    });
    res.send("Notification sent")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})