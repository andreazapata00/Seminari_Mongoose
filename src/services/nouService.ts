import { Project, IProject } from '../models/nou.js';

// FUNCIONES CRUD
export const projectService = {
  create: async (data: IProject) => {
    return await new Project(data).save();
  },  
  
  getById: async (id: string) => {
    return await Project.findById(id).populate('owner').lean().exec();
  },
  
  update: async (id: string, data: Partial<IProject>) => { 
    return await Project.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  },
  
  delete: async (id: string) => {
    return await Project.findByIdAndDelete(id).exec();
  },
  
  listAll: async () => {
    return await Project.find().lean().exec();
  }
};