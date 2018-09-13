import requests
import json

base_url = "https://api.indiankanoon.org/doc/"
# tids = ["789969", "433847", "294137", "1392920", "72095", "1270258", "1645178", "237570", "983571", "1059693", "110162683", "1850110", "1410974", "161391573", "107341", "1656199", "600757", "1423589"]
tids = ["107341", "1410974", "1423589", "161391573", "1656199", "1850110", "600757"]
headers = {"Authorization" : "Token dc3f12c2b531f1f3f9ff7d16df9532a4f2ccbe68"}
max_depth = 6
start_level = 3



for tid in tids:
    documents_stored = []
    url = base_url + str(tid) + "/"
    resp = requests.post(url, data={}, headers=headers)
    resp = resp.json()
    filename = "./data/" + str(tid) + ".json"
    with open(filename, 'w') as file:
        file.write(json.dumps(resp))
    documents_stored.append({"resp": resp, "level": 0})
    print "-"*0, tid

    #now iterate through citedbyList and scrape the docs - basically BFS
    while documents_stored:
        cur_doc = documents_stored.pop(0)
        cur_resp = cur_doc['resp']
        cur_level = cur_doc['level']
        if 'citedbyList' in cur_resp:
            if not cur_resp['citedbyList']:
                print "x", cur_resp['tid']
            else:
                for docs in cur_resp['citedbyList']:
                    tmp_tid = docs['tid']
                    tmp_url = base_url + str(tmp_tid) + "/"
                    tmp_resp = requests.post(tmp_url, data={}, headers=headers)
                    tmp_resp = tmp_resp.json()
                    tmp_filename = "./data/" + str(tmp_tid) + ".json"
                    if cur_level > start_level:
                        with open(tmp_filename, 'w') as file:
                            file.write(json.dumps(tmp_resp))
                    if cur_level < max_depth:
                        documents_stored.append({"resp": tmp_resp, "level": cur_level+1})
                        print "-"*(cur_level + 1), tmp_tid, cur_resp['tid']
        else:
            documents_stored.insert(0, cur_doc)
            to_store = {"tid": tid, "documents_stored": documents_stored}
            with open("./store/" + str(tid) + ".txt", 'w') as file:
                file.write(json.dumps(to_store))
            break