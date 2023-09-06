import Board from "../models/board.js";
import backgrounds from '../backgrounds/collectionBackgrounds.js'
import HttpError from "../helpers/httpError.js";
import mongoose from "mongoose";


const getAllBoards = async (req, res, next) => {
  try {
    const { id } = req.user;
    const filter = { ownerId: id };
    const result = await Board.find(filter, {
      title: 1,
      icon: 1,
      ownerId: 1,
      _id: 1,
    }).populate("ownerId", "id");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addBoard = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, icon, background } = req.body;
    
    // if (
    //   !icon ||
    //   !icon.trim()
    // ) {
    //   return res.status(400).json({ message: "Icon is required" });
    // }

    const board = await Board.findOne({ title });
    if (board) {
      res.status(409).json({ message: 'A board with the same title already exists' });
      return;
  }

    let selectedBackground = null;

    if (background && background.trim() !== "null") {
      selectedBackground = backgrounds.find(bg => bg._id === background);
      console.log("selectedBackground:", selectedBackground);
      if (!selectedBackground) {
        return res.status(404).json({ message: "Selected background not found" });
      }
    }

    const result = await Board.create({
      ...req.body,
      ownerId: `${id}`,
      background: selectedBackground
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const result = await Board.findById(boardId);

    if (!result) {
      throw HttpError(404, "Board not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, icon, background } = req.body;

    const currentBoard = await Board.findById(boardId);

    if (!currentBoard) {
      throw HttpError(404, "Board not found");
    }

    const updatedFields = {};

    if (title !== undefined && title.trim() !== currentBoard.title) {
      updatedFields.title = title;
    }
    if (icon !== undefined && icon !== currentBoard.icon) {
      updatedFields.icon = icon;
    }

    if (background !== undefined && background !== currentBoard.background._id) {
      const foundBackground = backgrounds.find((bg) => bg._id === background);
      if (foundBackground) {
        updatedFields.background = foundBackground;
      } else {
        return res.status(400).json({ message: "Invalid background ID" });
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No fields to update" });
    }

    const result = await Board.findByIdAndUpdate(boardId, updatedFields, {
      new: true,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
   
    const result = await Board.findByIdAndDelete(boardId);
    if (!result) {
      throw HttpError(404, "Board not found");
    }
    res.json({
      message: "Board deleted",
    });
  } catch (error) {
    next(error);
  }
};

const addColumn = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const { title } = req.body;

    const board = await Board.findById(boardId);

    const existingColumn = board.columns.find(
      (column) => column.title === title
    );
    if (existingColumn) {
      return res
        .status(409)
        .json({ message: `A column with the title \"${title}"\ already exists` });
    }

    board.columns.push({ title, boardId: boardId });
    await board.save();

    res.status(201).json(board.columns[board.columns.length - 1]);
  } catch (error) {
    next(error);
  }
};

const updateColumn = async (req, res, next) => {
  try {
    const { boardId, columnId } = req.params;

    const { title } = req.body;

    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(404).json({ message: "Board not found" });
    }
  
    const columnIndex = board.columns.findIndex(
      (column) => column._id.toString() === columnId
    );
    if (columnIndex === -1) {
      return res.status(404).json({ message: "Column not found" });
    }

    if (title === board.columns[columnIndex].title) {
      return res.status(400).json({ message: "New title must be different" });
    }

    board.columns[columnIndex].title = title;
    await board.save();

    res.json(board.columns[columnIndex]);
  } catch (error) {
    next(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const { boardId, columnId } = req.params;
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(404).json({ message: "Board not found" });
    }

    const columnIndex = board.columns.findIndex(
      (column) => column._id.toString() === columnId
    );
    if (columnIndex === -1) {
      return res.status(404).json({ message: "Column not found" });
    }
    const {title, tasks, _id} = board.columns.splice(columnIndex, 1)[0];
    await board.save();

    res.status(200).json({title, boardId, tasks, _id});

  } catch (error) {
    next(error);
  }
};

const getBackgroundPreviews = (req, res) => {
  try {
    const previewData = backgrounds.map((background) => ({
      _id: background._id,
      previewURL: background.previewURL,
    }));

    if (previewData.length === 0) {
      return res.status(404).json({ error: 'Backgrounds not found' });
    }

    res.status(200).json(previewData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllBoards,
  getBoard,
  addBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  getBackgroundPreviews
};
