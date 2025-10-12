const CommentService = require("../services/comment.service");
const { OK, CREATED } = require("../core/success.response");

const addComment = async (req, res) => {
  new CREATED({
    message: "Create comment successfully",
    metadata: await CommentService.createComment(req.body),
  }).send(res);
};

const getCommentsByParentId = async (req, res) => {
  new OK({
    message: "Get comments successfully",
    metadata: await CommentService.getCommentsByParentId({ ...req.query }),
  }).send(res);
};

const CommentController = { addComment, getCommentsByParentId };

module.exports = CommentController;
