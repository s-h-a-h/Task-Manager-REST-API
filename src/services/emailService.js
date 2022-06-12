const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const welcomeEmailToUser = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sh.raza2122@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const cancelationEmailToUser = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sh.raza2122@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    welcomeEmailToUser,
    cancelationEmailToUser
}