import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'nishuleuva786@gmail.com',
      pass: 'borm ieva zgiv uvfs'
    },
  });
  
  export const sendEmail = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: 'nishuleuva786@gmail.com',
        to,
        subject,
        html
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
  