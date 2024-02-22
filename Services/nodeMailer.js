const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

exports.sendMail = (emailid,title,text,date,time) => {
  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kuralnithi1999@gmail.com",
        pass: process.env.apppaassword,
      },
    });

let addhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Reminder</title>
  <style>
    /* Add your custom styles here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
    }
    .task-details {
      margin-top: 20px;
    }
    .task-details p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Task Reminder</h1>
    <div class="task-details">
      <p><strong>Task Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${text}</p>
      <p><strong>Deadline:</strong> ${date} - ${time}</p>
      <!-- Add more task details as needed -->
    </div>
  </div>
  <a href="http://localhost:5173">click here to add more task <a>
</body>
</html>
`

    const message = {
      from: "kuralnithi1999@gmail.com",
      to: emailid,
      subject: "TASK REMAINDER",
      html: addhtml,
    };

    mailTransporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("error in sending mail>>>>>>>>", err);
      }

      console.log("mail sent successfully");

    });
  } catch (error) {
    console.log(error);
  }
};
exports.updateMail = (emailid,title,text,date,time) => {

  let updatehtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder</title>
    <style>
      /* Add your custom styles here */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #666;
      }
      .task-details {
        margin-top: 20px;
      }
      .task-details p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Task Reminder - Updated </h1>
      <div class="task-details">
        <p><strong>Task Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${text}</p>
        <p><strong>Deadline:</strong> ${date} - ${time}</p>
        <!-- Add more task details as needed -->
      </div>
      <p><strong>Deadline:</strong> <a href="http://localhost:5173">click here to add more task <a></p>

    </div>
  </body>
  </html>
  `


  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kuralnithi1999@gmail.com",
        pass: process.env.apppaassword,
      },
    });

    const message = {
      from: "kuralnithi1999@gmail.com",
      to: emailid,
      subject: "TASK REMAINDER",
      html:updatehtml,
    };

    mailTransporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("error in sending mail>>>>>>>>", err);
      }

      console.log("mail sent successfully");

      res.status(200).json({ message: "mail sent successfully to emailid" });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.deleteMail = (emailid) => {
  try {





    let deletehtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Reminder</title>
      <style>
        /* Add your custom styles here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        .task-details {
          margin-top: 20px;
        }
        .task-details p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Task Reminder - Updated </h1>
        <div class="task-details">
          <p><strong></strong> Task deleted successfully </p>
    
          <!-- Add more task details as needed -->
        </div>
      </div>
      <a href="http://localhost:5173">click here to add more task <a>
    </body>
    </html>
    `
  

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kuralnithi1999@gmail.com",
        pass: process.env.apppaassword,
      },
    });

    const message = {
      from: "kuralnithi1999@gmail.com",
      to: emailid,
      subject: "TASK REMAINDER",
      html: deletehtml,
    };

    mailTransporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("error in sending mail>>>>>>>>", err);
      }

      console.log("mail sent successfully ");

    });
  } catch (error) {
    console.log(error);
  }
};
