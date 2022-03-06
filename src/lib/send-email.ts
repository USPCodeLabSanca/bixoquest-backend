import nodemailer from 'nodemailer';

const {env} = process;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL,
    pass: env.PASSWORD,
  },
});

export default async function(to: string, subject: string, text: string, html: string) {
  await transporter.sendMail({
    from: '"BixoQuest ❤" <noreply.bixoquest@gmail.com>',
    to,
    subject,
    text,
    html,
  });
};
