const mongoose = require("mongoose");
// const User = require("./user");

// a name, description, category, price, number-in-stock and URL

const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CommentSchema = new Schema({
  text: { type: String, maxLength: 400 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  article: { type: Schema.Types.ObjectId, ref: "Article", required: true }, // reference to the belonging article
  date: { type: Date, default: Date.now },
  // Opcional comentario de comentario (campo extra con 'parent comment')
});

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, maxLength: 4000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean },
    date: { type: Date, default: Date.now },
    comments: [CommentSchema],
  },
  opts
);

ArticleSchema.virtual("dateFormatted").get(function () {
  console.log(this.date);
  return this.date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

ArticleSchema.virtual("markDownText").get(function () {
  return `# ${this.title}

\_${this.dateFormatted} by [${this.author.firstName} ${this.author.lastName}](/)_

${this.text}`;
});

// Export model
module.exports = mongoose.model("Article", ArticleSchema);
