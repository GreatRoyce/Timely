const transporter = require("../config/mail");
const { env } = require("../config/env");

const sendPasswordResetEmail = async ({
  email,
  ownerName,
  resetToken,
}) => {
  const resetUrl =
    `${env.clientUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Timely" <${env.emailFrom}>`,
    to: email,
    subject: "Reset your Timely password",

    text: `
Hello ${ownerName},

We received a request to reset your Timely password.

Reset your password here:
${resetUrl}

This link expires in 15 minutes.

If you did not request this, you can safely ignore this email.

The Timely Team
    `,

    html: `
      <div>
        <h2>Reset your Timely password</h2>

        <p>Hello ${ownerName},</p>

        <p>
          We received a request to reset your Timely password.
        </p>

        <p>
          <a href="${resetUrl}">
            Reset your password
          </a>
        </p>

        <p>
          This link expires in 15 minutes.
        </p>

        <p>
          If you did not request this, you can safely ignore
          this email.
        </p>

        <p>
          The Timely Team
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
};