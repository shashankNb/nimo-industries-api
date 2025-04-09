import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'applyabroadhub@gmail.com', 
    pass: 'pibusltkislwlsct'           
  },
  secure: true,  
  tls: {
    rejectUnauthorized: false 
  }
});

export function sendMail({ to, subject, htmlContent, cc = '', bcc = '' }) {
    const mailOptions = {
      from: 'applyabroadhub@gmail.com',  
      to: to,  
      cc: cc,  
      bcc: bcc,  
      subject: subject,
      html: htmlContent
    };
  
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error); 
        } else {
          resolve(info.response);
        }
      });
    });
  }
