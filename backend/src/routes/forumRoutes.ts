import { Router } from "express";
import { ForumController } from "../controllers/forumController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/posts", ForumController.getPosts);
router.post("/posts", authMiddleware, ForumController.createPost);
router.get("/posts/:id", ForumController.getPostById);
router.get("/posts/:id/comments", ForumController.getComments);
router.post("/posts/:id/comments", authMiddleware, ForumController.createComment);

export default router;
