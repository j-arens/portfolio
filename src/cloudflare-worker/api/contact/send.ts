import { ValidatedSubmission, ContactSubmissionErrors } from './type';
import { Result, err, ok } from '~common/result';

type Receiver = {
  email: string;
};

type Content = {
  type: 'text/plain';
  value: string;
};

type Personalization = {
  to: Receiver[];
};

type MailReq = {
  subject: string;
  personalizations: Personalization[];
  from: {
    email: string;
    name: string;
  };
  reply_to: {
    email: string;
    name: string;
  };
  content: Content[];
};

function createReqJson({
  name,
  email,
  subject,
  message,
}: ValidatedSubmission): MailReq {
  return {
    subject,
    personalizations: [
      {
        to: [
          {
            email: `${process.env.CONTACT_EMAIL}`,
          },
        ],
      },
    ],
    from: {
      email,
      name,
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    reply_to: {
      email,
      name,
    },
    content: [
      {
        type: 'text/plain',
        value: message,
      },
    ],
  };
}

async function sendReq(
  mail: MailReq,
): Promise<Result<null, ContactSubmissionErrors>> {
  const headers = new Headers({
    authorization: `Bearer ${process.env.SENDGRID_KEY}`,
    'content-type': 'application/json',
  });
  const req = new Request(`${process.env.SENDGRID_ENDPOINT}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(mail),
  });
  try {
    const res = await fetch(req);
    if (!res.ok) {
      // @TODO: log
      const json = await res.json();
      console.log(res.status, res.statusText, json);
      return err(ContactSubmissionErrors.SENDGRID_REQ_FAILED);
    }
  } catch (e) {
    // @TODO: log
    console.log(e);
    return err(ContactSubmissionErrors.SENDGRID_REQ_FAILED);
  }
  return ok(null);
}

export default async function(
  submission: ValidatedSubmission,
): Promise<Result<null, ContactSubmissionErrors>> {
  return sendReq(createReqJson(submission));
}
