import { streamClient, chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const clerkId = req.user.clerkId;

    if (!clerkId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const token = chatClient.createToken(clerkId);

    res.status(200).json({
      token,
      userId: clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage, // ✅ FIXED
    });

  } catch (error) {
    console.error("error in chat controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}