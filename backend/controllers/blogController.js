import Blog from "../models/Blog.js";

// Create blog post (Admins only)
export const createBlogPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const blog = new Blog({
      title,
      content,
      category,
      author: req.user.id,
      coverImage,
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const blogs = await Blog.find(filter)
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog (with views increment)
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blog (Admins only)
export const updateBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    if (coverImage) blog.coverImage = coverImage;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like or Unlike blog
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;
    const index = blog.likes.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      blog.likes.push(userId);
      isLiked = true;
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes.length, isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ user: req.user.id, text });
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    res.status(201).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId, commentId } = req.params;

    if (!text) return res.status(400).json({ message: "Reply text is required" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ user: req.user.id, text });
    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    res.status(201).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments = blog.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
