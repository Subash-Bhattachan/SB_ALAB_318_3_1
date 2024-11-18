const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const users = require("../data/users");
const comments = require("../data/comments");
const error = require("../utilities/error");

//http://localhost:3000/api/posts?userId=1&api-key=perscholas
router
  .route("/")
  .get((req, res, next) => {
    if (req.query.userId) {

      const userId = Number(req.query.userId);
    
      // const user = users.find((u) => u.id == userId);
      // if (!user) return next (error(404, "User not found"))
    
        const userPosts = posts.filter((post) => post.userId == userId);
        return res.json({
          //user: {id: user.id, name: user.name, username: user.username},
          userId: userId,
          posts: userPosts});
        }

    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts, links });
  })



  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });



  router
  .route("/:id/comments")
  .get((req, res, next) => {
    const id = Number(req.params.id);  // Extract postId
    if (isNaN(id)) {
      return next(new Error("Invalid post ID. Number needed."));
    }

    if (req.query.userId) {
      const userId = Number(req.query.userId);
      
      if (isNaN(userId)) {
        return next(new Error("Invalid userId. Number needed."));
      }

      // Filter comments by userId and postId
      const userComments = comments.filter((comment) => comment.userId === userId && comment.postId === id);
      res.json({
        postId: id,
        userId: userId,
        comments: userComments
      });
    } else {
      // Filter comments by postId when no userId is specified
      const postComments = comments.filter((comment) => comment.postId === id);
      res.json({
        postId: id,
        comments: postComments
      });
    }
  });




module.exports = router;
