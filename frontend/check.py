import json
import time

import requests

HEADER = {
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54'
}

if __name__ == '__main__':
    print('提示：在合作投稿可能会不匹配')
    l = json.load(open('bili.json', encoding='utf8'))
    for item in l:
        data = requests.get(f'https://api.bilibili.com/x/space/wbi/arc/search?mid={item["mid"]}', headers=HEADER).json()
        name = data['data']['list']['vlist'][0]['author']
        if name == item['name']:
            print('√', name)
        else:
            print('×', item['name'], 'should be', name)
        # time.sleep(2)
