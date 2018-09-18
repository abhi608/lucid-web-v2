from flask import request, render_template, jsonify, url_for, redirect, g
from flask import send_from_directory
from .models import User
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from scripts.loogal import Loogal
from forms import search as search_forms
import time
import json
import os
import requests

aggregations = None
tid, n_hits, query, doc_list = '', 0, '', []
is_end = False
search_size = 10
loogal = Loogal(search_size)
active_filter = {}
hit_dict_list = {}
headers = {'X-API-TOKEN': 'AIzaSyBGktXQ3IPpwymVSAko08kxbIY4UcGQorw'}
session = requests.Session()

def autoFillFields(hit):
    if not hit:
        print "test"
        hit_dict = {}
    else:
        hit_dict = hit.to_dict()
    
    hit_dict["highlights"] = []

    # print "hit: ", hit.meta.highlight

    if len(hit_dict) > 1:
        if "highlight" in hit.meta:
            if "doc" in hit.meta.highlight:
                hit_dict["highlights"] = [str(val) for val in hit.meta.highlight.doc]

    print "inside autoFillFields: ", hit_dict["highlights"]
    if "author" not in hit_dict or not hit_dict["author"]:
        hit_dict["author"] = "<em>Author not available</em>"
    if "bench" not in hit_dict or not hit_dict["bench"]:
        hit_dict["bench"] = "<em>Bench not available</em>"
    # if "cited_links" not in hit_dict or not hit_dict["cited_links"]:
    #     hit_dict["cited_links"] = ["No cited link available"]
    # if "cited_titles" not in hit_dict or not hit_dict["cited_titles"]:
    #     hit_dict["cited_titles"] = ["No cited title available"]
    # if "content" not in hit_dict or hit_dict["content"] == "":
    #     hit_dict["content"] = "<em>Content not available</em>"
    if "divtype" not in hit_dict or hit_dict["divtype"] == "":
        hit_dict["divtype"] = "<em>Type not available</em>"
    if "doc" not in hit_dict or hit_dict["doc"] == "":
        hit_dict["doc"] = "<em>Content not available</em>"
    if "keywords" not in hit_dict or not hit_dict["keywords"]:
        hit_dict["keywords"] = ["No keyword"]
    if "source" not in hit_dict or hit_dict["source"] == "":
        hit_dict["source"] = "<em>Source not available</em>"
    if "summary" not in hit_dict or hit_dict["summary"] == "":
        hit_dict["summary"] = "<em>Summary not available</em>"
    if "title" not in hit_dict or hit_dict["title"] == "":
        hit_dict["title"] = "<em>Title not available</em>"
    return hit_dict

def parseHitList(hit_list):
    key_passed = ['tid', 'title', 'divtype', 'bench', 'source', 'highlights']
    doc_list = []
    global hit_dict_list
    # print "aggr: ", hit_list.aggregations
    for hit in hit_list:
        hit_dict = autoFillFields(hit)
        doc_dict = {key: hit_dict[key] for key in key_passed}
        # doc_dict['highlights'] = "This is where the highlight will go. Lorem Ipsum totem doloris"
        doc_list.append(doc_dict)
        hit_dict_list[str(hit_dict['tid'])] = hit_dict
    return doc_list


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/.well-known/acme-challenge/<path:filename>')
def ssl_cert(filename):
    root_dir = os.path.dirname(os.getcwd())
    print os.path.join(root_dir, 'static', '.well-known','acme-challenge')
    return send_from_directory(os.path.join(root_dir, '.well-known','acme-challenge'), filename)


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')

@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/getFilterData", methods=["GET"])
def filter_load():
    global aggregations
    distinct_author = [term.key for term in aggregations.distinct_author.buckets]
    distinct_bench = [term.key for term in aggregations.distinct_bench.buckets]
    distinct_benchcount = [term.key for term in aggregations.distinct_benchcount.buckets]
    distinct_divtype = [term.key for term in aggregations.distinct_divtype.buckets]
    distinct_source = [term.key for term in aggregations.distinct_source.buckets]
    # print distinct_author, distinct_bench, distinct_divtype, distinct_source
    filter_data = {
        'author': distinct_author,
        'bench': distinct_bench,
        'benchcount': distinct_benchcount,
        'divtype': distinct_divtype,
        'source': distinct_source
    }
    return jsonify(filter_data=filter_data)


@app.route("/api/fetchdoc", methods=["GET"])
def doc_load():
    global hit_dict_list
    global tid
    global session
    if request.args.get("tid"):
        tid = str(request.args.get("tid"))
    
    cur_query = None
    if request.args.get("query"):
        cur_query = str(request.args.get("query"))
    print tid, cur_query
    try:
        assert tid != -1
    except:
        raise ValueError()

    response_doc = None

    try:
        response_doc = hit_dict_list[tid]
    except:
        response_doc = loogal.fetch_document(tid)
        response_doc = autoFillFields(response_doc)
    # resp = loogal.fetch_document(tid).to_dict()
    # print resp
    # print "keys for hit_dict_list: ", hit_dict_list.keys()
    # response_doc = hit_dict_list[tid]
    headers = {
        'content-type': 'application/json',
    }

    doc_content = json.dumps(response_doc['doc'])
    queryjson = json.dumps(query)
    print("cur_query: ", cur_query)

    if cur_query:
        data = '{"doc":'+ doc_content + ',"query":'+cur_query+'}'

        start = time.time()
        response_doc['query_summary'] = "Query based summary loading..."
        # try:
        #     response = session.post(
        #         'http://35.188.194.243:80/query_summarize?key=AIzaSyBGktXQ3IPpwymVSAko08kxbIY4UcGQorw', headers=headers, data=data, timeout = 10)
        #     print "summary_time = "+ str(time.time()-start)
        #     response_doc['query_summary'] = json.loads(response.text)['summary']
        # except Exception as e:
        #     response_doc['query_summary'] = "Query based summary not available"
    else:
        response_doc['query_summary'] = None

    response_doc['request_completed'] = True
    

    # print response_doc
    return jsonify(response_doc = response_doc)

@app.route("/api/search", methods=["GET"])
def search():
    global loogal
    global is_end
    global hit_dict_list
    global query
    global active_filter
    global aggregations
    active_filter = {}
    hit_dict_list = {}
    id = -1
    global search_size
    is_end = False
    is_filter = False
    domain = None
    if request.args.get('search_phrase'):
        print request.args.get('search_phrase')
        query = request.args.get('search_phrase')
    if request.args.get('domain'):
        print request.args.get('domain')
        domain = request.args.get('domain')
    if request.args.get('author'):
        print "Author:", request.args.get('author')
        active_filter['author'] = request.args.get('author').split(',')
    if request.args.get('bench'):
        print "Bench:", request.args.get('bench')
        active_filter['bench'] = request.args.get('bench').split(',')
    if request.args.get('benchcount'):
        print "BenchCount:", request.args.get('benchcount')
        active_filter['benchcount'] = request.args.get('benchcount').split(',')
    if request.args.get('divtype'):
        print "DivType:", request.args.get('divtype')
        active_filter['divtype'] = request.args.get('divtype').split(',')
    if request.args.get('source'):
        print "Source:", request.args.get('source')
        active_filter['source'] = request.args.get('source').split(',')
    if request.args.get('is_filter'):
        print "is_filter:", request.args.get('is_filter')
        is_filter = request.args.get('is_filter')
        

    print "Active", active_filter
    start = time.time()
    print "querying time"
    print "domain: ", domain
    s, n_hits = loogal.find_keyword(query, active_filter, domain)
    print time.time() - start
    start = time.time()
    # code to get the first set of search results
    if is_filter:
        s, hits_end, hit_list, _ = loogal.get_next_set_of_results()
    else:
        s, hits_end, hit_list, aggregations = loogal.get_next_set_of_results()
    print "getting results time: ", time.time()-start
    # print "hit_list keys:", hit_list
    doc_list = parseHitList(hit_list)
    # print hit_dict['author'], hit_dict['bench']
    print "Computed DocList"
    print "KEYS: ", hit_dict_list.keys()
    if len(doc_list) < search_size:
        is_end = True
    search_results = {
        "n_hits": n_hits,
        "query": query,
        "doc_list": doc_list
    }
    print "REACHED END"
    return jsonify(search_results=search_results,
                   search_size=search_size,
                   active_filter=active_filter,
                   query=query,
                   is_end=is_end)


@app.route("/api/get_more", methods=["GET"])
def get_more():
    global is_end
    global loogal
    # global aggregations
    print loogal.start
    print loogal.query
    global hit_dict_list
    s, hits_end, hit_list, _ = loogal.get_next_set_of_results()

    doc_list = parseHitList(hit_list)

    print "Computed DocList"

    if len(doc_list) < search_size:
        is_end = True

    return jsonify(doc_list=doc_list, is_end=is_end)


# @app.route('/api/get_cites', methods=['GET'])
# def get_cites():
#     global loogal
#     global hit_dict_list
#     cite_available = True
#     tid = str(request.args.get('tid')) 
#     print ("get_cites",tid)
#     print  hit_dict_list.keys()
#     response_doc = None
 
#     if tid in hit_dict_list:
#         response_doc = hit_dict_list[tid] 
#     else:
#         case = loogal.fetch_document(tid)
#         if not case:
#             raise Exception("tid not found in databse!")
#         response_doc = autoFillFields(case)
             
#     print("response_doc: ", response_doc['cited_links'])

#     if "No cited link available" in response_doc['cited_links']:
#         print("NO CITED LINK AVAILABLE")
#         cite_available = False
#         return jsonify(doc_list=[],cite_available=cite_available)

#     # print response_doc['cited_links']
#     cite_list = [t[5:-1] for t in response_doc['cited_links']]
#     print("Cite_list: ", cite_list)
#     doc_list = []
#     for i, cite_tid in enumerate(cite_list):
#         if str(cite_tid).isdigit():
#             if str(cite_tid) not in hit_dict_list:
#                 case = loogal.fetch_document(cite_tid)
#                 if case:
#                     doc = autoFillFields(case)
#                     hit_dict_list[str(cite_tid)] = doc
#                     doc_list.append(doc)
#             else:
#                 doc_list.append(hit_dict_list[cite_tid])
        

#     if not doc_list:
#         cite_available = False

#     print("doc_list: ", doc_list)

#     return jsonify(doc_list=doc_list, cite_available=cite_available)

@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403
