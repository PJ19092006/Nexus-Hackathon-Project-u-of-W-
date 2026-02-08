import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "No username provided" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne(
    { username },
    { password: 0 }, // exclude password
  );

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({ user });
}
