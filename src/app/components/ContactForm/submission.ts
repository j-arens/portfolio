import { Result, ok, err } from '~common/result';
import { ContactSubmissionErrors } from '~cloudflare-worker/api/contact/type';
import { Values } from './';

const errCodeToMsg = {
  [ContactSubmissionErrors.MISSING_EMAIL]: 'email is required',
  [ContactSubmissionErrors.INVALID_EMAIL]:
    'email cannot be empty and must include an @ character',
  [ContactSubmissionErrors.MISSING_NAME]: 'name is required',
  [ContactSubmissionErrors.INVALID_NAME]: 'name is invalid',
  [ContactSubmissionErrors.MISSING_SUBJECT]: 'subject is required',
  [ContactSubmissionErrors.INVALID_SUBJECT]: 'subject is invalid',
  [ContactSubmissionErrors.MISSING_MESSAGE]: 'message is required',
  [ContactSubmissionErrors.INVALID_MESSAGE]: 'message is invalid',
  [ContactSubmissionErrors.INVALID_INPUT_FORMAT]:
    'submitted data was not in the expected format',
  [ContactSubmissionErrors.SENDGRID_REQ_FAILED]: 'failed to send mail',
};

export default async function(values: Values): Promise<Result<null, string>> {
  try {
    const res = await fetch(`${process.env.CONTACT_SUBMISSION_URL}`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    });
    const { code } = await res.json();
    if (!res.ok) {
      err(errCodeToMsg[code as ContactSubmissionErrors]);
    }
    return ok(null);
  } catch (e) {
    return err(
      `An unexpected error occured. Try sending me an email at ${process.env.CONTACT_EMAIL}`,
    );
  }
}
