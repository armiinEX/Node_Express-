const articleModel = require('../../models/article');


exports.create = async (req, res) => {
    try {
        const {
            title,
            description,
            body,
            href,
            categoryID,
            publish,
        } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!categoryID) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const existingArticle = await articleModel.findOne({ href: req.body.href });
        if (existingArticle) {
            return res.status(400).json({ message: "This address is already registered." });
        }

        const article = await articleModel.create({
            title,
            description,
            body,
            href,
            categoryID,
            publish,
            creator: req.user._id,
            cover: req.file ? req.file.filename : null,
        });

        const mainarticle = await articleModel
            .findById(article._id)
            .populate("creator", "-password");

        return res.status(201).json({ message: "Article created successfuly ...", article: mainarticle });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getAll = async (req, res) => {
    const articles = await articleModel
        .find({}, "-__v")
        .populate('categoryId', "name")
        .populate('creator', "username");
    res.status(200).json(articles);
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await articleModel.findById(id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (article.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await articleModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Article deleted successfuly" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getOne = async (req, res) => {
    const { href } = req.params;
    const article = await articleModel
        .findOne({ href }, "-__v")
        .populate('categoryID', "href")
        .populate('creator', "username email");

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    return res.status(200).json(article);
};

exports.saveDraft = async (req, res) => {
    try {
        const { title, description, body, href, categoryID } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!categoryID) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const draft = await articleModel.create({
            title,
            description,
            body,
            href,
            categoryID,
            publish: false,
            creator: req.user._id,
            cover: req.file ? req.file.filename : null,
        });

        const mainDraft = await articleModel
            .findById(draft._id)
            .populate("creator", "-password");

        return res.status(201).json({ message: "Draft saved successfully ...", article: mainDraft });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};