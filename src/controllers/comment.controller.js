const CommentService = require("../services/comment.service");
const { CREATED } = require("../core/success.response");

const addComment = async (req, res) => {
  new CREATED({
    message: "Create comment successfully",
    metadata: await CommentService.createComment(req.body),
  }).send(res);
};

const CommentController = { addComment };

module.exports = CommentController;
