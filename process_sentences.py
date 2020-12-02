
from collections import OrderedDict 
import requests
import json


def process_sentences(url):

    payload={}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    text = response.text

    sentences = text.split(".")

    counts = {}
    for sentence in sentences:
        words = sentence.split(" ")
        sentence_length = len(words)
        if sentence_length in counts:
            counts[sentence_length] += 1
        else:
            counts[sentence_length] = 1

    ordered_counts = OrderedDict(sorted(counts.items()))
    # print(ordered_counts)
    ordered_counts = [(k, ordered_counts[k]) for k in ordered_counts]
    cnt = 0
    for item in ordered_counts:
        cnt += item[1]

    res = []
    for item in ordered_counts:
        res += [item[0]] * item[1]

    print(len(res), cnt)

    message = {
        "url": url,
        "counts": res
    }

    return json.dumps(message)

# f = open('corpus.txt', 'r')
# text = f.read()
# url = input()
url = "http://www.gutenberg.org/files/1342/1342-0.txt"
print(process_sentences(url))