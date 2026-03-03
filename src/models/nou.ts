import { Schema, model, Types } from 'mongoose';

// MODELO
// Definimos la interfaz para TypeScript
export interface IProject {
  name: string;
  description: string;
  owner: Types.ObjectId; // Enlace a la colección User
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true } // 'User' debe coincidir con el nombre del modelo en user.ts
});

export const Project = model<IProject>('Project', projectSchema);
