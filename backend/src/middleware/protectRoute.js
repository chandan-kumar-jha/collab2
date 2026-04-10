import { requireAuth } from '@clerk/express';
import User from '../models/User.js';

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) {
        return res.status(401).json({
          message: "unauthorized - invalid user token",
        });
      }

      // 🔥 Always use UPSERT to avoid duplicates
      const email =
        req.auth().sessionClaims?.email_addresses?.[0]?.email_address ||
        `${clerkId}@test.com`;

      let user = await User.findOneAndUpdate(
        { clerkId }, // 🔑 unique identifier
        {
          clerkId,
          email,
          name: "Test User",
        },
        {
          upsert: true, // ✅ create if not exists
          new: true, // ✅ return updated/new doc
          setDefaultsOnInsert: true,
        }
      );

      req.user = user;

      next(); // ✅ continue to controller
    } catch (error) {
      console.error("❌ error in protected route middleware", error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },
];