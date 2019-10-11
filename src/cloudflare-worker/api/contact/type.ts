export enum ContactSubmissionErrors {
  'INVALID_INPUT_FORMAT',
  'MISSING_NAME',
  'INVALID_NAME',
  'MISSING_EMAIL',
  'INVALID_EMAIL',
  'MISSING_SUBJECT',
  'INVALID_SUBJECT',
  'MISSING_MESSAGE',
  'INVALID_MESSAGE',
  'SENDGRID_REQ_FAILED',
}

export type ContactSubmissionErrorStrings = keyof typeof ContactSubmissionErrors;

export type Validator = (subject: unknown) => boolean;

export type SubmissionValidator = { [k: string]: Validator };

export type Submission = { [k: string]: unknown };

export type ValidatedSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
