"""Create the IdeaForge Vault folder structure in Google Drive."""
import pickle
import sys
from pathlib import Path

import requests
from google.auth.transport.requests import Request

TOKEN_FILE = r"C:\Users\Augustus\.gemini\antigravity\gdrive_token.pickle"

def get_token():
    with open(TOKEN_FILE, 'rb') as f:
        creds = pickle.load(f)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_FILE, 'wb') as f:
            pickle.dump(creds, f)
    return creds.token

def find_folder(token, name, parent_id=None):
    q = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        q += f" and '{parent_id}' in parents"
    resp = requests.get(
        'https://www.googleapis.com/drive/v3/files',
        headers={'Authorization': f'Bearer {token}'},
        params={'q': q, 'fields': 'files(id,name)'}
    )
    files = resp.json().get('files', [])
    return files[0]['id'] if files else None

def create_folder(token, name, parent_id=None):
    existing = find_folder(token, name, parent_id)
    if existing:
        print(f"  [EXISTS] {name} ({existing})")
        return existing
    meta = {'name': name, 'mimeType': 'application/vnd.google-apps.folder'}
    if parent_id:
        meta['parents'] = [parent_id]
    resp = requests.post(
        'https://www.googleapis.com/drive/v3/files',
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        json=meta
    )
    fid = resp.json()['id']
    print(f"  [CREATED] {name} ({fid})")
    return fid

def main():
    print("Setting up IdeaForge Vault in Google Drive...\n")
    token = get_token()
    
    # Find Company Workspace root
    ws_id = find_folder(token, 'Company Workspace')
    if not ws_id:
        print("ERROR: 'Company Workspace' folder not found in Drive.")
        sys.exit(1)
    print(f"Found Company Workspace: {ws_id}")
    
    # Create vault structure
    vault_id = create_folder(token, '05_IdeaForge_Vault', ws_id)
    create_folder(token, '00_Inbox', vault_id)
    create_folder(token, '01_Under_Review', vault_id)
    create_folder(token, '02_Approved_For_Build', vault_id)
    create_folder(token, '03_Archived', vault_id)
    
    print("\n✅ IdeaForge Vault folder structure created!")

if __name__ == '__main__':
    main()
