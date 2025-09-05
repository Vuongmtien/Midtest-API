import { Router } from "express";
import { verifyApiKey } from "../middleware/verifyApiKey.js";
import Post from "../models/post.js";

const router = Router();

router.post("/", verifyApiKey, async (req, res) => {
  try {
    const { userId, content } = req.body || {};
    if (!userId || !content) return res.status(400).json({ message: "userId and content are required" });
    if (String(userId) !== req.authUser.id) return res.status(403).json({ message: "userId does not match apiKey" });

    const post = await Post.create({ userId, content });
    res.status(201).json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", verifyApiKey, async (req, res) => {
  try {
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ message: "content is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.userId) !== req.authUser.id) {
      return res.status(403).json({ message: "Not allowed to update this post" });
    }

    post.content = content;
    await post.save();
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
