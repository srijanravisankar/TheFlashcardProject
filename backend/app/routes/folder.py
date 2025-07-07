from fastapi import status, APIRouter, Response, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from .. import schemas, models

from ..database import get_db

# Define the router 'folders'
router = APIRouter(
    prefix="/folders",
    tags=["Folders"]
)

# Create a folder and add it into the 'folder' table
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.FolderResponse)
def create_folder(folder: schemas.FolderCreate, session: Session = Depends(get_db)):
    # check for folder existence
    parent_folder = session.get(models.Folder, folder.parent_id)
    if folder.parent_id is not None and parent_folder is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{folder.parent_id}' was not found")
        
    new_folder = models.Folder(**folder.model_dump())

    session.add(new_folder)
    session.flush()
    
    # check for self-parenting
    if new_folder.id == new_folder.parent_id:
        raise HTTPException(status_code=400, detail="Folder cannot be its own parent.")
    
    session.commit()
    session.refresh(new_folder)
    
    return new_folder

# Get all the folders from the 'folder' table
@router.get("/", response_model=List[schemas.FolderResponse])
def get_folders(session: Session = Depends(get_db)):    
    stmt = select(models.Folder).where(models.Folder.parent_id == None)
    result = session.scalars(stmt)
    folders = result.all()
    
    return folders

# Get a folder from the 'folder' table given its id
@router.get("/{id}", response_model=schemas.FolderResponse)
def get_folder(id: int, session: Session = Depends(get_db)):
    stmt = select(models.Folder).where(models.Folder.id == id)
    result = session.scalars(stmt)
    folder = result.first()
    
    # check if folder exists
    if folder == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Folder with id '{id}' was not found")
    
    return folder
    
# Update a folder in the 'folder' table given its id
@router.put("/{id}", response_model=schemas.FolderResponse)
def update_folder(id: int, update_folder: schemas.FolderCreate, session: Session = Depends(get_db)):
    folder = session.get(models.Folder, id)
    
    # check if folder exists
    if folder == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Folder with id '{id}' was not found")
        
    # check for self-parenting
    if folder.id == update_folder.parent_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail="Folder cannot be its own parent")
    
    # check for circular parenting
    current = session.get(models.Folder, update_folder.parent_id)
    while current and current.id is not None:
        if folder.id == current.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail="Cannot set a folder's descendant as its parent")
        current = session.get(models.Folder, current.parent_id)
        
    update_data = update_folder.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(folder, key, value)
        
    session.commit()
    session.refresh(folder)
    
    return folder

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(id: int, session: Session = Depends(get_db)):
    folder = session.get(models.Folder, id)
    
    if folder == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Folder with id '{id}' was not found")
    
    session.delete(folder)
    session.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

