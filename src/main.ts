import mongoose from 'mongoose';
import { UserModel } from './user.js';
import { OrganizationModel } from './organization.js';
import { projectService } from './services/nouService.js'; // Importamos el nuevo servicio

async function runDemo() {
  try {
    // 1. CONEXIÓN
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/ea_mongoose');
    console.log('🚀 Connected to MongoDB');

    // 2. LIMPIEZA (Idempotencia)
    console.log('🧹 Cleaning database...');
    await UserModel.deleteMany({});
    await OrganizationModel.deleteMany({});
    // No olvides limpiar la nueva colección también
    const { Project } = await import('./models/nou.js'); 
    await Project.deleteMany({});

    // 3. SEEDING DE BASE (Organización y Usuario)
    console.log('🌱 Seeding base data...');
    const org = await OrganizationModel.create({ name: 'Initech', country: 'USA' });
    const user = await UserModel.create({ 
      name: 'Bill', 
      email: 'bill@initech.com', 
      role: 'ADMIN', 
      organization: org._id 
    });

    console.log(`✅ Base data ready. User ID: ${user._id}`);

    // --- 4. PROBANDO EL CRUD DEL NUEVO SERVICIO (Requisito) ---
    console.log('\n🏗️ TESTING NEW PROJECT SERVICE (CRUD):');

    // 4.1 CREATE
    const newProject = await projectService.create({
      name: 'Mongoose Refactor',
      description: 'Implementar Service Layer',
      owner: user._id as any
    });
    console.log('1. [Create] Project created:', newProject.name);

    // 4.2 GET BY ID (con Populate)
    const foundProject = await projectService.getById(newProject._id.toString());
    console.log('2. [GetById + Populate] Owner details:', foundProject?.owner);

    // 4.3 UPDATE
    const updated = await projectService.update(newProject._id.toString(), { 
      description: 'Updated with Service Layer logic' 
    });
    console.log('3. [Update] Project description updated.');

    // 4.4 LIST ALL (.lean)
    const allProjects = await projectService.listAll();
    console.log('4. [ListAll] Current projects:');
    console.table(allProjects);

    // 4.5 DELETE
    await projectService.delete(newProject._id.toString());
    console.log('5. [Delete] Project removed successfully.');

    console.log('\n⭐ All requirements fulfilled!');

  } catch (err) {
    console.error('❌ Error during execution:', err);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected');
  }
}

runDemo();