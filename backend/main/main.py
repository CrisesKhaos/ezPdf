from fastapi import FastAPI, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from nlp import getMessage






app = FastAPI()

origins = [ 
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.post("/signUp/{email}/{password}")
async def signUp(email, password):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return {"message": "SignUp successful"}
    except Exception as e:
        return {"message": str(e)}


@app.post("/uploadPdf")
async def uploadPdf(file: UploadFile ):
    finalText = ""
    reader = PdfReader(file.file)
    print(file.filename)
    for page in reader.pages:
        finalText += page.extract_text()
    return {"text": finalText}


@app.post("/getAnswer")
async def getAnswer(request : Request):
    data = await request.json()
    messages = data['messages']
    question = data['question']
    answer = getMessage(messages, question)
    return {"answer": answer}