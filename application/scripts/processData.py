import os
import re
import json
import datetime

path_to_jsonfiles = "./data"
keys_to_del = ["relatedqs", "firstname", "lastname", "publishdate", "docsource", "showurl"]

def extractBench(content):
    result = re.search('<div class=\"doc_bench\">Bench: (.*)</div>', content)
    try:
        return result.group(1).split(",")
    except:
        return []

def convertDate(date):
    date = date.split("-")
    dt = datetime.datetime(int(date[0]), int(date[1]), int(date[2]), 0, 0)
    epoch = datetime.datetime.utcfromtimestamp(0)
    return int((dt - epoch).total_seconds() * 1000.0)

def generateSummary(content):
    return ""

def generateKeywords(content):
    return ["list", "of", "string"]
    

for file in os.listdir(path_to_jsonfiles):
    full_filename = "%s/%s" % (path_to_jsonfiles, file)
    with open(full_filename,'r') as fi:
        doc = json.load(fi)
        tid = doc["tid"]
        new_doc = {}
        new_doc = doc
        new_doc["author"] = ""
        if "firstname" in doc and doc["firstname"] != None:
            new_doc["author"] = new_doc["author"] + doc["firstname"]
        if "secondname" in doc and doc["secondname"] != None:
            new_doc["author"] = new_doc["author"] + doc["secondname"]
        if "lastname" in doc and doc["lastname"] != None:
            new_doc["author"] = new_doc["author"] + doc["lastname"]
        new_doc["bench"] = extractBench(doc["doc"])
        new_doc["benchcount"] = len(new_doc["bench"]) 
        new_doc["source"] = doc["docsource"]
        new_doc["date"] = convertDate(doc["publishdate"])
        new_doc["summary"] = generateSummary(doc["doc"])
        new_doc["keywords"] = generateKeywords(doc["doc"])
        for key in keys_to_del:
            if key in new_doc:
                del new_doc[key]
        with open("./processed/" + str(tid) + ".json", 'w') as file:
            file.write(json.dumps(new_doc))