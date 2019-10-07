type Submission = {};

type Submitter = {
  email: string;
  name: string;
};

type Content = {
  type: string;
  value: string;
};

type Mail = {
  subject: string;
  personalizations: {
    to: {
      email: string;
    };
  };
  from: Submitter;
  reply_to: Submitter;
  content: Content;
};

const SEND_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send';

async function sendMail(mail: Mail) {
  const headers = new Headers({
    Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
  });
  const req = new Request(SEND_ENDPOINT, {
    headers,
    method: 'POST',
    body: JSON.stringify(mail),
  });
  fetch(req);
}

function submitter(submission: Submission): Submitter {
  // throw error if missing required data
  return {
    email: submission.email,
    name: submission.name,
  };
}

function content(submission: Submission): Content {
  // throw error if missing required data
  return {
    type: 'text/plain',
    value: submission.message,
  };
}

function createMail(submission: Submission): Mail {
  return {
    subject: 'Contact form submission',
    personalizations: {
      to: {
        email: `${process.env.CONTACT_EMAIL}`,
      },
    },
    from: submitter(submission),
    reply_to: submitter(submission), // eslint-disable-line @typescript-eslint/camelcase
    content: content(submission),
  };
}

async function handleSubmission() {
  const mail = createMail();
  await sendMail(mail);
}
