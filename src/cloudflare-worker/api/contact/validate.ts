import { Result, ok, err } from '~common/result';
import {
  ContactSubmissionErrors,
  ContactSubmissionErrorStrings,
  SubmissionValidator,
  Submission,
} from './type';

const isType = (type: string) => (subject: unknown): boolean =>
  typeof subject === type;

const isString = isType('string');

const hasLength = (subject: unknown): boolean => {
  try {
    // @ts-ignore subject is unknown
    return subject.length > 0;
  } catch (_) {
    return false;
  }
};

const isEmail = (subject: unknown): boolean =>
  isString(subject) && (subject as string).includes('@');

export default function(
  submission: Submission,
): Result<null, ContactSubmissionErrors> {
  const expected: SubmissionValidator = {
    name: (value: unknown): boolean => isString(value) && hasLength(value),
    email: (value: unknown): boolean => isEmail(value),
    subject: (value: unknown): boolean => isString(value) && hasLength(value),
    message: (value: unknown): boolean => isString(value) && hasLength(value),
  };
  for (const key in expected) {
    if (!(key in submission)) {
      const errType = `MISSING_${key.toUpperCase()}` as ContactSubmissionErrorStrings;
      return err(ContactSubmissionErrors[errType]);
    }
    const validate = expected[key];
    if (!validate(submission[key])) {
      const errType = `INVALID_${key.toUpperCase()}` as ContactSubmissionErrorStrings;
      return err(ContactSubmissionErrors[errType]);
    }
  }
  return ok(null);
}
