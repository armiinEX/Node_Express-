const departmentModel = require('../../models/department');
const departmentSubModel = require('../../models/department-sub');
const ticketModel = require('../../models/ticket');


exports.create = async (req, res) => {
    const {
        departmentID,
        departmentSubID,
        priority,
        title,
        body,
        course,
    } = req.body;

    const ticket = await ticketModel.create({
        departmentID,
        departmentSubID,
        priority,
        title,
        body,
        course,
        user: req.user._id,
        answer: 0,
        isAnswer: 0,
    });

    const mainTicket = await ticketModel
        .findOne({ _id: ticket._id })
        .populate('departmentID')
        .populate('departmentSubID')
        .populate('user')
        .lean();

    return res.status(201).json(mainTicket);
};

exports.getAll = async (req, res) => {
    const tickets = await ticketModel
        .find({ answer: 0 })
        .populate('departmentID', "title")
        .populate('departmentSubID', "title")
        .populate('user', "username")
        .sort({ createdAt: -1 })
        .lean();

    return res.json(tickets);
};

exports.userTickets = async (req, res) => {
    const tickets = await ticketModel.find({ user: req.user._id })
    .sort({ _id: -1 })
    .populate('departmentID', "title")
    .populate('departmentSubID', "title")
    .populate('user', "username")
    .lean();

    return res.json(tickets);
};

exports.departments = async (req, res) => {
    const departments = await departmentModel.find({});

    return res.json(departments);
};

exports.departmentsSubs = async (req, res) => {
    const departmentSubs = await departmentSubModel
        .find({ parent: req.params.id })
        .lean();

    return res.json(departmentSubs);
};

exports.setAnswer = async (req, res) => {
    const { body, ticketID } = req.body;

    const ticket = await ticketModel.findOne({ _id: ticketID }).lean();

    const answer = await ticketModel.create({
        title: "پاسخ به تیکت شما",
        body,
        parent: ticketID,
        priority: ticket.priority,
        user: req.user._id,
        isAnswer: 1,
        answer: 0,
        departmentID: ticket.departmentID,
        departmentSubID: ticket.departmentSubID,
    });

    await ticketModel.findOneAndUpdate(
        { _id: ticketID },
        { answer: 1, }
    );

    return res.status(201).json(answer);

};

exports.getAnswer = async (req, res) => {
    const { id } = req.params;
    const ticket = await ticketModel.findOne({ _id: id }).lean();
    const ticketAnswer = await ticketModel.findOne({ parent: id }).lean();

    return res
        .json({
            ticket,
            ticketAnswer: ticketAnswer ? ticketAnswer : null,
        });
};

