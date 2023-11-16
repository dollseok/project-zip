from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from gpt.services.gpt_service import get_gpt_message


app = APIRouter(
    prefix="/fastapi/gpt"
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


@app.get("/")
async def gpt_message():
    response = get_gpt_message()

    return response
