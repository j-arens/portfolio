import MutableResponse from '../../http/MutableResponse';
import validate from './validate';
import send from './send';
import { ContactSubmissionErrors } from './type';

export default async function(
  req: Request,
  res: MutableResponse,
): Promise<MutableResponse> {
  let json;
  try {
    json = await req.json();
  } catch (_) {
    return res
      .status(400)
      .json({ code: ContactSubmissionErrors.INVALID_INPUT_FORMAT });
  }

  const valid = validate(json);
  if (valid.isErr()) {
    return res.status(400).json({ code: valid.err });
  }

  const sent = await send(json);
  if (sent.isErr()) {
    return res.status(500).json({ code: sent.err });
  }

  return res.status(200);
}
