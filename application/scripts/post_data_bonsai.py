import os
import ast
import json
import requests

url = 'https://nXpfMGj4Ki:sdKhGwvCknNxaUcWT@lucid-871717653.us-east-1.bonsaisearch.net/documents/v1/'
headers = {'content-type': 'application/json'}
root = '../processed/' # path of the docs directory goes here
docs_not_pushed = []
done_list = []
if 'push_done.txt' in os.listdir('./'):
	with open('push_done.txt','r') as f:
		done_list = f.read().split('\n')

file_list = [x for x in os.listdir(root) if x.endswith('.json') and x not in done_list]

for filename in os.listdir(root):
	if filename.endswith(".json"):
            with open(root+filename) as f:
				print("File: ", filename)
				data = json.load(f)
				try:
					assert "tid" in data
				except:
					docs_not_pushed.append({"filename": filename, "error": "tid not present"})
					print("Skipping document " + filename + "because tid not present")

				tid = data["tid"]
				cur_data = {
					"numcites": 0,
					"covertids": [],
					"covertitles": [],
					"author": "",
					"title": "",
					"url": "",
					"keywords": [],
					"bench": [],
                    "benchcount": 0,
					"citeList": {
						"tid": None,
						"url": "",
						"title": ""
					},
					"covers": {
						"tid": None,
						"url": "",
						"title": ""
					},
					"source": "",
					"numcitedby": 0,
					"doc": "",
					"date": None,
					"divtype": "",
					"citedbyList": {
						"tid": None,
						"url": "",
						"title": ""
					},
					"tid": None,
					"summary": ""
				}
				# cur_data = {
				# 	"divtype": "",
				# 	"title": "",
				# 	"doc": "",
				# 	"author": "",
				# 	"covers": [],
				# 	"bench": "",
				# 	"content": "",
				# 	"source": "",
				# 	"keywords": "",
				# 	"cited_links": [],
				# 	"tid": -1,
				# 	"summary": ""
				# }
				for key in data:
					cur_data[key] = data[key]
				cur_url = url + str(tid) + "/_create"
				cur_data = json.dumps(cur_data)
				r = requests.put(url=cur_url, data=cur_data, headers=headers)
				# print(r.status_code)
				try:
					assert r.status_code == 201
					with open('push_done.txt','a')as f:
						f.write(filename+'\n')
							
						
				except:
					docs_not_pushed.append({"filename": filename, "error": r.text, "status_code": r.status_code})

if len(docs_not_pushed) > 0:
	print("Docs not pushed:", docs_not_pushed)
