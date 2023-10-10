const _ = require("lodash");
const express = require("express");
const getBlog = require("./getBlog");
const memoize = require("lodash.memoize");

const app = express();
const port = process.env.PORT || 3000;

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const cacheDuration = 60 * 1000; // Cache results for 1 minute (adjust as needed)
const memoizedGetBlog = memoize(getBlog, () => "cache-key", {
  maxAge: cacheDuration,
});

// Define the route to fetch blog stats
app.get("/api/blog-stats", async (req, res, next) => {
  try {
    const blogs = await memoizedGetBlog();

    console.log(blogs);

    // Calculate statistics using Lodash
    const totalBlogs = blogs.length;
    const longestBlog = _.maxBy(blogs, (blog) => blog.title.length);
    const blogsWithPrivacy = _.filter(blogs, (blog) =>
      _.includes(_.toLower(blog.title), "privacy")
    );
    const uniqueBlogTitles = _.uniqBy(blogs, "title").map((blog) => blog.title);

    res.json({
      totalBlogs: totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlog: uniqueBlogTitles.length,
      uniqueBlogTitles: uniqueBlogTitles,
    });
    next();
  } catch (error) {
    next();
  }
});

// Define the blog search route
app.get("/api/blog-search", async (req, res, next) => {
  try {
    const blogs = await memoizedGetBlog();

    const query = req.query.query.toLowerCase();

    // Filter blogs based on the query
    const filteredBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query)
    );

    res.json({Search_Result:filteredBlogs.length, filteredBlogs});

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
