require('dotenv').config()
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
export default async (req, res) => {
    const { name, id, number } = JSON.parse(req.body)
    const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const strings = String(`Hey ${name} you have a new order ${id} assigned you Please visit acrlogistics.vercel.app`)
    client.messages
        .create({
            body: `${strings}`,
            messagingServiceSid: 'MGeeac64a12fd699dd8dc110c514561ed3',
            to: `+1${number}`,
        })
        .then(message => {
            console.log(message.sid)
        })
        .catch(err => {
            console.log(err)
        })
        res.status(200).send("hello world")

}