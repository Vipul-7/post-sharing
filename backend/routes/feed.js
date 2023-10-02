const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const feedController = require("../controllers/feed");
// const isAuth = require("../middleware/auth").isAuth;

// GET /feed/posts
router.get("/posts", feedController.getPosts);
// router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  // isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);
// router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  // isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// router.delete("/post/:postId", isAuth, feedController.deletePost);
router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
