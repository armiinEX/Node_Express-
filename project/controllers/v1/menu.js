const menuModel = require("../../models/menu");


exports.getAll = async (req, res) => {
    const menus = await menuModel.find({}).lean();

    menus.forEach(menu => {
        const subMenus = [];
        for (let i = 0; i < menus.length; i++) {
            const mainMenu = menus[i];
            
            // if (String(mainMenu.parent) === String(menu._id)) {
            if (mainMenu.parent?.equals(menu._id)) {
                subMenus.push(menus.splice(i, 1)[0]);
                i = i - 1;  
            } 
        }
        menu.subMenus = subMenus;
    });

    return res.status(200).json(menus);
};

exports.getAll2 = async (req, res) => {
    const menus = await menuModel.find({}).lean();

    // ایجاد یک Map برای دسترسی سریع به منوها بر اساس _id
    const menuMap = new Map();
    menus.forEach(menu => menuMap.set(String(menu._id), { ...menu, subMenus: [] }));

    // ساختاردهی به منوها
    const rootMenus = [];

    menus.forEach(menu => {
        if (menu.parent) {
            const parentMenu = menuMap.get(String(menu.parent));
            if (parentMenu) {
                parentMenu.subMenus.push(menuMap.get(String(menu._id)));
            }
        } else {
            rootMenus.push(menuMap.get(String(menu._id)));
        }
    });

    return res.status(200).json(rootMenus);
};

exports.create = async (req, res) => {
    const { title, href, parent } = req.body;

    // validate

    const menu = await menuModel.create({ title, href, parent });

    return res.status(201).json({ menu });
};

exports.getAllInPanel = async (req, res) => {
    const menus = await menuModel.find({}).populate("parent").lean();
    return res.status(200).json(menus);
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await menuModel.findByIdAndDelete(id);

        if (!menu) {
            return res.status(404).json({ message: "menu not found." });
        }

        return res.status(200).json({ message: "menu deleted successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred on the server." });
    }    
};
