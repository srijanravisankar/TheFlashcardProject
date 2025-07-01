from fastapi import APIRouter

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/")
def get_cards():
    print("Getting Flashcards")

