import Joi from "joi";

const addTaskSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  deadline: Joi.string().required(),
  columnId: Joi.string().required(),
  boardId: Joi.string.required(),
  priority: Joi.string().valid('Не терміново', 'Терміново', 'Негайно').required()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  deadline: Joi.string().required(),
  columnId: Joi.string().required(),
  boardId: Joi.string.required(),
  priority: Joi.string().valid('Не терміново', 'Терміново', 'Негайно').required()
});

const moveTaskSchema = Joi.object({
  newColumnId: Joi.string().required()
});

const priorityTaskSchema = Joi.object({
  boardId: Joi.string.required(), 
  priority: Joi.string().valid('Не терміново', 'Терміново', 'Негайно').required()
});

export default  {
  authHeaderSchema,
  addTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  priorityTaskSchema
}