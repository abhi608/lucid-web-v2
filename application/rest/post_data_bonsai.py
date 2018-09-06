import os
import ast
import json
import requests

url = 'https://nXpfMGj4Ki:sdKhGwvCknNxaUcWT@lucid-871717653.us-east-1.bonsaisearch.net/documents/v1/'
headers = {'content-type': 'application/json'}
root = '' # path of the docs directory goes here
docs_not_pushed = []

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

				cur_data = {
					"numcites": 0,
					"covertids": [],
					"covertitles": [],
					"author": "",
					"title": "",
					"url": "",
					"keywords": [],
					"bench": "",
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
				cur_url = url
				cur_data = json.dumps(cur_data)
				r = requests.post(url=cur_url, data=cur_data, headers=headers)
				# print(r.status_code)
				try:
					assert r.status_code == 201
				except:
					docs_not_pushed.append({"filename": filename, "error": r.text, "status_code": r.status_code})

if len(docs_not_pushed) > 0:
	print("Docs not pushed:", docs_not_pushed)
