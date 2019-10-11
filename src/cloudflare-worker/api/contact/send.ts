import { ValidatedSubmission, ContactSubmissionErrors } from './type';
import { Result, err, ok } from '~common/result';

type MailReq = {
  subject: string;
  personalizations: {
    to: {
      email: string;
    };
  };
  from: {
    email: string;
    name: string;
  };
  reply_to: {
    email: string;
    name: string;
  };
  content: {
    type: 'text/plain';
    value: string;
  };
};

function createReqJson({
  name,
  email,
  subject,
  message,
}: ValidatedSubmission): MailReq {
  return {
    subject,
    personalizations: {
      to: {
        email: `${process.env.CONTACT_EMAIL}`,
      },
    },
    from: {
      email,
      name,
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    reply_to: {
      email,
      name,
    },
    content: {
      type: 'text/plain',
      value: message,
    },
  };
}

async function sendReq(
  mail: MailReq,
): Promise<Result<null, ContactSubmissionErrors>> {
  const headers = new Headers({
    Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
  });
  const req = new Request(`${process.env.SENDGRID_ENDPOINT}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(mail),
  });
  try {
    const res = await fetch(req);
    if (!res.ok) {
      // log
      return err(ContactSubmissionErrors.SENDGRID_REQ_FAILED);
    }
  } catch (err) {
    // log
    return err(ContactSubmissionErrors.SENDGRID_REQ_FAILED);
  }
  return ok(null);
}

export default async function(
  submission: ValidatedSubmission,
): Promise<Result<null, ContactSubmissionErrors>> {
  return sendReq(createReqJson(submission));
}
