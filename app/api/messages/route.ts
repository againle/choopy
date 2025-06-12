import { getData, addData, deleteData } from "../../lib/database";

export async function GET() {
  const users = await getData();
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const { message } = await request.json(); // Expect data in request body
  const newUser = await addData(message);
  return new Response(JSON.stringify(newUser), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  });
}

export async function DELETE(request: Request) {
  const { id } = await request.json(); // Assuming delete by id
  const state = await deleteData(id);
  if (state === '204') {
    return new Response(null, { status: 204 });
  } 
  if (state === '404') {
    return new Response("No data found", {status: 404});
  }
}
