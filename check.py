import json
import time
import itertools

import requests

HEADER = {
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54'
}

if __name__ == '__main__':
    l = json.load(open('bili.json', encoding='utf8'))
    s = set()
    for item in itertools.chain.from_iterable(l):
        if item['mid'] in s:
            print(item['name'], item['mid'], 'already exists')
            continue
        s.add(item['mid'])
        data = requests.get(f'https://api.bilibili.com/x/space/wbi/acc/info?mid={item["mid"]}', headers=HEADER).json()
        name = data['data']['name']
        if name == item['name']:
            print('√', name)
        else:
            print('×', item['name'], 'should be', name)
