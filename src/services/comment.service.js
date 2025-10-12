const CommentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");

const createComment = async ({
  productId,
  userId,
  content,
  parentId = null,
}) => {
  const comment = await CommentModel.create({
    productId,
    userId,
    content,
    parentId,
  });

  let rightValue = 1;
  if (parentId) {
    const parentComment = await CommentModel.findById(parentId);
    if (!parentComment) {
      throw new NotFoundError("Parent comment does not exist");
    }

    rightValue = parentComment.right;

    // update right values for nested comments
    await CommentModel.updateMany(
      {
        productId,
        right: { $gte: rightValue },
      },
      {
        $inc: { right: 2 },
      }
    );

    // update left values for nested comments
    await CommentModel.updateMany(
      {
        productId,
        left: { $gt: rightValue },
      },
      { $inc: { left: 2 } }
    );
  } else {
    const commentWithMaxRight = await CommentModel.findOne(
      { productId },
      "right",
      { sort: { right: -1 } }
    );

    if (commentWithMaxRight) {
      rightValue = commentWithMaxRight.right + 1;
    }
  }

  comment.left = rightValue;
  comment.right = rightValue + 1;

  return await comment.save();
};

const CommentService = { createComment };

module.exports = CommentService;
