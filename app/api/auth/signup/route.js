import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  // the same user name exsist case
  const exists = await User.findOne({ username });
  if (exists) {
    return Response.json({ error: "Username already exists" }, { status: 409 });
  }

  // push the actual data
  const user = await User.create({
    username,
    password: await hashPassword(password),
  });

  return Response.json({
    success: true,
    user: { id: user._id, username: user.username },
  });
}
