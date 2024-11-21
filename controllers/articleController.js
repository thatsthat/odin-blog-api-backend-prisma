const Article = require("../models/article");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Handle Post create on POST.
exports.create = [
  // Validate and sanitize fields.
  body("title", "Post title must not be empty.").trim().isLength({ min: 1 }),
  body("text", "Post text must not be empty.").isLength({ min: 1 }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    console.log(req.body.author);
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const article = new Article({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author, // es mas seguro utilizar JWT en el backend para esta variable
      isPublished: true,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Data from form is valid. Save item.
      await article.save();
      return res.send(article);
    }
  }),
];

exports.list = asyncHandler(async (req, res, next) => {
  const allArticles = await Article.find(
    { isPublished: true },
    "title text author date comments"
  )
    .sort({ title: 1 })
    .populate("author")
    .populate({ path: "comments", populate: { path: "author" } })
    .exec();

  const allPosts = allArticles;

  /* const allPosts = allArticles.map((article) => {
    article;
  }); */

  return res.send(allPosts);
});

exports.list_user = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const userArticles = await Article.find(
    { author: req.user._id },
    "title isPublished date author"
  )
    .sort({ title: 1 })
    .exec();
  return res.send(userArticles);
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

exports.delete = asyncHandler(async (req, res, next) => {
  // ToDO Check that articleId belongs to logged in user.
  await Article.findByIdAndDelete(req.params.articleId);
  return res.send(JSON.stringify("article deleted"));
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
