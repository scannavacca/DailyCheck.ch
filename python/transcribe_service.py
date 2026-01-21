import tempfile
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, UploadFile
from faster_whisper import WhisperModel

app = FastAPI()
model = WhisperModel("small", device="cpu")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: Optional[str] = None):
    suffix = Path(file.filename or "").suffix or ".audio"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
        tmp.write(await file.read())
        tmp.flush()
        segments, _info = model.transcribe(tmp.name, language=language or None)
        text = " ".join([seg.text for seg in segments]).strip()
    return {"text": text}
