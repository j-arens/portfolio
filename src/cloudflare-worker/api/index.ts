import MutableResponse from '../http/MutableResponse';

export async function contact(
  req: Request,
  res: MutableResponse,
): Promise<MutableResponse> {
  const json = await req.json();
  console.log(json);
  return res.status(404);
}
