from flask import Flask, request, jsonify
from transformers import BartTokenizer, BartForConditionalGeneration

app = Flask(__name__)

# Load pre-trained BART model
model_name = "facebook/bart-large-cnn"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    print("Received data:", data)  #print the received data
    input_text = data.get('text', '')

    input_tokens = tokenizer.encode(input_text, return_tensors="pt", truncation=True, max_length=1024)

    summary_ids = model.generate(input_tokens, num_beams=4, length_penalty=2.0, max_length=150, no_repeat_ngram_size=3)

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
