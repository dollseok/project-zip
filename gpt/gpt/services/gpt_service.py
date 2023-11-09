import openai
import os


def get_gpt_message():

    openai.api_key = os.environ["OPENAI_API_KEY"]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "가족과 함께 대화할 수 있는 주제 하나만 추천해줘. 주제만 말해줘. 한 문장으로 대답해줘. 여행 말고 다른 주제로 말해줘."},
            {"role": "assistant", "content": "한국어로 대답해줘"}
        ]
    )

    response = completion.choices[0].message.content
    return response
