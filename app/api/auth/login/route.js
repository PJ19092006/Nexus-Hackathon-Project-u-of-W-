import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return Response.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
}
