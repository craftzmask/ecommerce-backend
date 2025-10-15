"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const CommentController = require("../../controllers/comment.controller");

router.use(authentication);

router.post("", asyncErrorHandler(CommentController.addComment));
router.get("", asyncErrorHandler(CommentController.getCommentsByParentId));
router.delete("", asyncErrorHandler(CommentController.deleteComment));

module.exports = router;
