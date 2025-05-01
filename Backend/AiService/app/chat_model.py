import re
import requests
from app.config import HF_TOKEN, HF_MODEL_URL

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def extract_sentences(text: str, max_sentences: int = 3) -> str:
    sentences = re.split(r'(?<=[.!?]) +', text)
    clean = []
    for s in sentences:
        s = s.strip()
        if s and s[-1] in ".!?":
            clean.append(s)
        if len(clean) >= max_sentences:
            break
    return ' '.join(clean)


def query_huggingface(prompt: str) -> str:
    instruction = (
        "Отвечай кратко — 2–3 предложениями. В конце предложи пользователю продолжить, если он захочет."
    )
    full_prompt = f"[INST] {instruction} {prompt.strip()} [/INST]"

    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_new_tokens": 120,
            "temperature": 0.7,
            "top_p": 0.95,
            "do_sample": True
        }
    }

    response = requests.post(HF_MODEL_URL, headers=headers, json=payload)

    print(f"Response status: {response.status_code}")
    print(f"Response content: {response.text}")

    try:
        response.raise_for_status()
        result = response.json()
        raw_text = result[0]['generated_text'].split("[/INST]")[-1].strip()
        trimmed = extract_sentences(raw_text, max_sentences=3)
        return trimmed + " Хочешь узнать подробнее?"
    except requests.exceptions.HTTPError as err:
        return f"HTTP error occurred: {err}"
    except Exception as e:
        print(f"Error: {e}")
        return "Произошла ошибка при генерации ответа."
