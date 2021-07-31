const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a Post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Post text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ msg: 'Server error' });
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ msg: 'Server error' });
  }
});

// @route   GET api/posts/:pid
// @desc    Get post by Id
// @access  Private
router.get('/:pid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send({ msg: 'Server error' });
  }
});

// @route   DELETE api/posts/:pid
// @desc    Delete post by Id
// @access  Private
router.delete('/:pid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //Check user
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete this post' });
    }

    await post.remove();

    res.json({ msg: 'Post deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send({ msg: 'Server error' });
  }
});

// @route   PUT api/posts/like/:pid
// @desc    Like a post by Id
// @access  Private
router.put('/like/:pid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);

    // Check if post has already liked by the current user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ msg: 'Server error' });
  }
});

// @route   PUT api/posts/unlike/:pid
// @desc    Un-Like a post by Id
// @access  Private
router.put('/unlike/:pid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);

    // Check if post has already liked by the current user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    console.log(post.likes);
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ msg: 'Server error' });
  }
});

// @route   POST api/posts/comment/:pid
// @desc    Comment on a Post
// @access  Private
router.post(
  '/comment/:pid',
  [auth, [check('text', 'Comment is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const post = await Post.findById(req.params.pid);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      return res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ msg: 'Server error' });
    }
  }
);

// @route   DELETE api/posts/comment/:pid/:cid
// @desc    Delete comment on a post
// @access  Private
router.delete('/comment/:pid/:cid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);
    // Get comment from the above post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.cid
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(400).json({ msg: 'Comment not found' });
    }

    // User is the one who created that comment
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete this comment' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ msg: 'Server error' });
  }
});

module.exports = router;
