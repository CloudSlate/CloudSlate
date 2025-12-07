import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'cloudslate',
  title: 'CloudSlate CMS',
  
  projectId: 'qtnlujvu', // Your Sanity project ID
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [
    structureTool(),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
})

