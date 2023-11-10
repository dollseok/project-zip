from typing import Optional
from pydantic import BaseModel


class GptRequest(BaseModel):
    question: Optional[str] = None
