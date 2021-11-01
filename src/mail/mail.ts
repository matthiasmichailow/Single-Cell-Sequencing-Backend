import formData from "form-data";
import Mailgun from "mailgun.js";
import Client from "mailgun.js/dist/lib/client";

export const connectMailgun = (): Client => {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

    const mailgun = new Mailgun(formData);
    // TODO insert credentials
    return mailgun.client({username: '', key: MAILGUN_API_KEY!});
}