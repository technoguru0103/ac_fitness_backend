const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // For Gmail
  port: 587, // Secure port
  secure: false, // Use SSL/TLS
  auth: {
    user: "technoguru0103@gmail.com", // Your email address
    pass: "sfhi mzdj jehz lnec", // Your email password or app-specific password
  },
});

// Generate a random token for verification
exports.generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Send a verification email
exports.sendVerificationEmail = async (userEmail, verificationToken) => {
  const verificationLink = `http://2.56.179.38:5000/api/auth/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: '"AC FITNESS" technoguru0103@gmail.com', // Sender's name and email
    to: userEmail, // Recipient's email
    subject: "Verify Your Email Address",
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not sign up, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// Example usage
// const userEmail = "user@example.com";
// const verificationToken = generateVerificationToken();
// sendVerificationEmail(userEmail, verificationToken);
