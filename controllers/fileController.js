const Article = require("../models/article");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Handle Post create on POST.
exports.create = asyncHandler(async (req, res, next) => {
  await prisma.file.create({
    data: {
      name: req.file.originalname,
      owner: { connect: { id: req.user.id } },
      parent: undefined,
    },
  });
  return res.send("File saved");
});

exports.delete = asyncHandler(async (req, res, next) => {
  console.log(req.params.fileId);
  await prisma.file.delete({
    where: {
      id: +req.params.fileId,
    },
  });
  return res.send("File deleted");
});

exports.list = asyncHandler(async (req, res, next) => {
  const files = await prisma.file.findMany({
    where: {
      ownerId: +req.params.ownerId,
    },
  });

  return res.send(files);
});

exports.toggle_published = asyncHandler(async (req, res, next) => {
  // ToDO Check that articleId belongs to logged in user.
  let article = await Article.findById(req.params.articleId);
  article.isPublished = !article.isPublished;
  const savedArticle = await Article.findByIdAndUpdate(
    req.params.articleId,
    article,
    {}
  );
  return res.send(savedArticle);
});

// Handle comment create
exports.comment_create = [
  // Validate and sanitize fields.
  body("text", "Comment text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // ToDO Check that articleId belongs to logged in user.
    let article = await Article.findById(req.params.articleId);
    article.comments.push({
      text: req.body.text,
      article: req.params.articleId,
      author: req.user._id,
    });
    const savedArticle = await Article.findByIdAndUpdate(
      req.params.articleId,
      article,
      {}
    );

    if (!errors.isEmpty()) {
      // There are errors.
      // Podrias invocar next(errors) i en el middleware siguiente gestionar los errores (mirar ejemplo whatsapp)
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Data from form is valid.
      return res.send("Comment saved!");
    }
  }),
];

exports.comment_delete = [
  asyncHandler(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.body.commentID);
    return res.send(JSON.stringify("comment deleted"));
  }),
];

exports.comment_list = [
  asyncHandler(async (req, res, next) => {
    const articleComments = await Comment.find(
      { article: req.params.articleId },
      "author article date text"
    )
      .sort({ title: 1 })
      .populate("author")
      .exec();
    return res.send(articleComments);
  }),
];
