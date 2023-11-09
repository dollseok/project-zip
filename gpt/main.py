from fastapi import FastAPI, APIRouter
import gpt.routers.gpt

app = FastAPI(host="0.0.0.0", port=8000)
route = APIRouter()

app.include_router(gpt.routers.gpt.app)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
