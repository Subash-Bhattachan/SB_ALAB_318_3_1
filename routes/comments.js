const express = require("express");
const router = express.Router();


const comments = require("../data/comments");
const error = require("../utilities/error");



// GET /comments/ :id
// http://localhost:3000/api/comments/1?api-key=perscholas
// http://localhost:3000/api/comments?userId=1&api-key=perscholas
router
  .route("/")
  .get((req, res, next) => {
    if (req.query.userId) {

      const userId = Number(req.query.userId);
    
      //const user = users.find((u) => u.id == userId);
      if (isNaN(userId)) return next(error(400, "Invalid userId. Number needed."))
    
        const userComments = comments.filter((comment) => comment.userId == userId);
        return res.json({
          //user: {id: user.id, name: user.name, username: user.username},
          //userId: userId,
          coments: userComments});
        }

// http://localhost:3000/api/comments?postId=1&api-key=perscholas
        if (req.query.postId) {

            const postId = Number(req.query.postId);
          
            if (isNaN(postId)) return next(error(400, "Invalid postId. Number needed."))
    
          
              const userComments = comments.filter((comment) => comment.postId == postId);
              return res.json({
                //user: {id: user.id, name: user.name, username: user.username},
                //postId: postId,
                coments: userComments});
              }

    const links = [
      {
        href: "comments/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ comments, links });
  })


// http://localhost:3000/api/comments?api-key=perscholas
.post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments[comments.length - 1].id + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      }

      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });


  //http://localhost:3000/api/comments?userId=1&api-key=perscholas
  router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((comment) => comment.id == req.params.id);

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
    if (comment) res.json({ comment, links });
    else next();

  })
  

  //http://localhost:3000/api/comments/3?api-key=perscholas
  .patch((req, res, next) => {
    const comment = comments.find((comment, i) => {
        if (comment.id == req.params.id) {
            for (const key in req.body) {
                comments[i][key] = req.body[key];
            }
            return true;

        }

    });
    if (comment) res.json(comment);
    else next();

  })


  //http://localhost:3000/api/comments/3?api-key=perscholas
  .delete((req, res, next) => {
    const comment = comments.find((comment, i) => {
        if (comment.id == req.params.id) {
            comments.splice(i, 1);
            return true;
        }
        
    });
    if (comment) res.json(comment);
    else next();
  });


module.exports = router;