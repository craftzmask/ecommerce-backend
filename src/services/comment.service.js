const CommentModel = require("../models/comment.model");
const ProductRepo = require("../models/repositories/product.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { getSelectData } = require("../utils");

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

const getCommentsByParentId = async ({ productId, parentId = null }) => {
  if (!productId) {
    throw new BadRequestError("Product does not exist");
  }

  if (parentId) {
    const parentComment = await CommentModel.findById(parentId);
    if (!parentComment) {
      throw new NotFoundError("The parent comment does not exist");
    }

    return await CommentModel.find({
      productId,
      left: { $gt: parentComment.left },
      right: { $lte: parentComment.right },
    })
      .select(getSelectData(["left", "right", "content", "parentId"]))
      .sort({ left: -1 })
      .lean();
  }

  return await CommentModel.find({ productId, parentId })
    .select(getSelectData(["left", "right", "content", "parentId"]))
    .sort({ left: -1 })
    .lean();
};

const deleteComment = async ({ commentId, productId, userId }) => {
  const foundProduct = ProductRepo.findProduct({ productId });
  if (!foundProduct) {
    throw new NotFoundError("Product does not exist");
  }

  // Consider allow admin to delete comments as well here
  const comment = await CommentModel.findOne({
    _id: commentId,
    userId,
  });
  if (!comment) {
    throw new NotFoundError("Comment does not exist");
  }

  const leftValue = comment.left;
  const rightValue = comment.right;

  const width = rightValue - leftValue + 1;

  // Delete all children and the comment itself
  await CommentModel.deleteMany({
    productId,
    left: { $gte: leftValue, $lte: rightValue },
  });

  // Update left and right for other comments
  await CommentModel.updateMany(
    {
      productId,
      left: { $gt: rightValue },
    },
    {
      $inc: { left: -width },
    }
  );

  await CommentModel.updateMany(
    {
      productId,
      right: { $gt: rightValue },
    },
    {
      $inc: { right: -width },
    }
  );
};

const CommentService = { createComment, getCommentsByParentId, deleteComment };

module.exports = CommentService;
