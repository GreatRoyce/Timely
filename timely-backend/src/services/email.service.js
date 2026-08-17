const transporter = require("../config/mail");
const { env } = require("../config/env");

// ==========================================
// Generic Email
// ==========================================

const sendEmail = async ({
  email,
  subject,
  text,
  html,
}) => {
  await transporter.sendMail({
    from: `"Timely" <${env.emailFrom}>`,
    to: email,
    subject,
    text,
    html,
  });
};

// ==========================================
// Password Reset Email
// ==========================================

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

// ==========================================
// Task Reminder Email
// ==========================================

const sendTaskReminderEmail = async ({
  email,
  ownerName,
  taskTitle,
  customerName,
  dueDate,
  dueTime,
  priority,
}) => {
  await transporter.sendMail({
    from: `"Timely" <${env.emailFrom}>`,
    to: email,
    subject: `Reminder: ${taskTitle}`,

    text: `
Hello ${ownerName},

This is a reminder about an upcoming task in Timely.

Task: ${taskTitle}
Customer: ${customerName}
Due date: ${dueDate}
Due time: ${dueTime}
Priority: ${priority}

Please make sure this task is handled on time.

The Timely Team
    `,

    html: `
      <div>
        <h2>Task Reminder</h2>

        <p>Hello ${ownerName},</p>

        <p>
          This is a reminder about an upcoming task in Timely.
        </p>

        <p>
          <strong>Task:</strong> ${taskTitle}
        </p>

        <p>
          <strong>Customer:</strong> ${customerName}
        </p>

        <p>
          <strong>Due date:</strong> ${dueDate}
        </p>

        <p>
          <strong>Due time:</strong> ${dueTime}
        </p>

        <p>
          <strong>Priority:</strong> ${priority}
        </p>

        <p>
          Please make sure this task is handled on time.
        </p>

        <p>
          The Timely Team
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendTaskReminderEmail,
};