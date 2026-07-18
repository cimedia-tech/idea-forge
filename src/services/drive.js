import { updateIdea } from './db';

// Mocking the Google Drive API call for now.
// Real implementation would POST to a backend or use Google API client directly.
export async function fileToGoogleDrive(idea) {
  console.log('Filing to Google Drive:', idea.title);
  
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock Drive Link
  const driveLink = `https://docs.google.com/document/d/mock-id-${idea.id}/edit`;
  
  // Update idea in IndexedDB
  await updateIdea(idea.id, {
    status: 'filed',
    driveLink
  });
  
  return driveLink;
}
