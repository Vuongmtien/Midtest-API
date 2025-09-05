import User from "../models/user.js";

export async function verifyApiKey(req, res, next) {
  try {
    let apiKey = req.query.apiKey;
    if (!apiKey) {
      return res.status(401).json({ message: "Missing apiKey in query" });
    }

    apiKey = decodeURIComponent(String(apiKey).trim().replace(/^<|>$/g, ""));

    const match = apiKey.match(/^mern-\$([0-9a-fA-F]{24})\$-\$(.+)\$-(.+)$/);
    if (!match) {
      return res.status(401).json({ message: "Invalid apiKey format" });
    }

    const [, userId, emailFromKey, tokenFromKey] = match;

    console.log("[AK parse]", { userId, emailFromKey, tokenFromKey });

    const user = await User.findById(userId);
    console.log("[AK user]", user && { id: user._id, email: user.email, dbToken: user.apiKeyToken });

    if (!user) {
      return res.status(401).json({ message: "apiKey not valid" });
    }

    if ((user.email || "").toLowerCase() !== (emailFromKey || "").toLowerCase()) {
      return res.status(401).json({ message: "apiKey not valid" });
    }

    if (!user.apiKeyToken || user.apiKeyToken !== tokenFromKey) {
      return res.status(401).json({ message: "apiKey not valid" });
    }

    req.authUser = { id: String(user._id), email: user.email };
    next();
  } catch (err) {
    console.error("verifyApiKey error:", err);
    res.status(500).json({ message: "Server error in verifyApiKey" });
  }
}
