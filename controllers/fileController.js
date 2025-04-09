const Article = require("../models/article");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createClient } = require("@supabase/supabase-js");

// Handle Post create on POST.
exports.create = asyncHandler(async (req, res, next) => {
  console.log(process.env.SUPABASE_URL);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  const fileData = await supabase.storage
    .from("odin")
    .upload(req.file.originalname, req.file.buffer, {
      cacheControl: "3600",
      upsert: false,
    });

  const urlData = supabase.storage
    .from("odin")
    .getPublicUrl(fileData.data.path);

  var parentData = {};
  if (req.body.parentId) parentData = { connect: { id: +req.body.parentId } };
  await prisma.file.create({
    data: {
      name: req.file.originalname,
      owner: { connect: { id: req.user.id } },
      parent: parentData,
      url: urlData.data.publicUrl,
    },
  });

  console.log(data);

  return res.json({ message: "File saved" });
});

exports.createFolder = asyncHandler(async (req, res, next) => {
  var parentData = {};
  if (req.body.parentId) parentData = { connect: { id: +req.body.parentId } };
  await prisma.file.create({
    data: {
      name: req.body.name,
      owner: { connect: { id: req.user.id } },
      isFolder: true,
      parent: parentData,
    },
  });
  return res.json({ message: "Folder saved" });
});

exports.delete = asyncHandler(async (req, res, next) => {
  const file = await prisma.file.delete({
    where: {
      id: +req.params.fileId,
    },
  });
  return res.send(file);
});

exports.list = asyncHandler(async (req, res, next) => {
  const files = await prisma.file.findMany({
    where: {
      ownerId: +req.user.id,
      parentId: +req.params.parentId,
    },
  });
  return res.send(files);
});

exports.info = asyncHandler(async (req, res, next) => {
  const file = await prisma.file.findUnique({
    where: {
      ownerId: +req.user.id,
      id: +req.params.fileId,
    },
  });
  return res.send(file);
});
