const Tag = require('../models/tag');
const slugify = require('slugify');
const { errorHandler} = require('../helpers/dbErrorHandler');
const Blog = require('../models/blog');
const tag = require('../models/tag');

exports.create = (req, res) => {
    const {name} = req.body
    let slug = slugify(name).toLowerCase();

    let tag = new Tag({ name, slug });

    tag.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
        })
};

exports.list = (req,res) => {
    Tag.find({}).exec((err, tag) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
    // res.json(data);
    Blog.find({ tags: tag })
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name')
    .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // blogs: data
        res.json({ tag: tag, blogs: data });
        });
    })
};

exports.read =(req,res) => {
    const slug = req.params.slug.toLowerCase()

        Tag.findOne({slug}).exec((err, tag) => {
            if(err) {
                return res.status(400).json({
                    error: 'Tag not found'
                });
            }
            res.json(tag);
        })
}


exports.remove= (req,res) => {
    const slug =req.params.slug.toLowerCase();

    Tag.findOneAndRemove({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Tag deleted successfully'
        });
    })

}
