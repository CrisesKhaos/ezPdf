import requests
from pypdf import PdfReader
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

HUGGINGFACE_API_KEY = os.environ.get('HUGGINGFACE_API_KEY')
print(HUGGINGFACE_API_KEY)

def getMessage(messagess, question):
   

    client = InferenceClient(api_key=HUGGINGFACE_API_KEY)

   
    messages = messagess
    messages.append({"role" : "user", "content": question})

    stream = client.chat.completions.create(
        model="meta-llama/Llama-3.2-1B-Instruct", 
        messages=messages, 
        temperature=0.5,
        max_tokens=1024,
        top_p=0.7,
        stream=True
    )


    x= ""
    for chunk in stream:
        x += chunk.choices[0].delta.content

    messages.append({"role" : "assistant", "content" : x})
  
    return x

