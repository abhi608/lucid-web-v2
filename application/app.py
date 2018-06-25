from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from scripts.loogal import Loogal
from forms import search as search_forms
import time, json

tid, n_hits, query, doc_list = '', 0, '', []
is_end = False
search_size = 10 
loogal = Loogal(search_size)
active_filter = {}
hit_dict_list = {} 
doc_list = []
headers = {'X-API-TOKEN': 'AIzaSyBGktXQ3IPpwymVSAko08kxbIY4UcGQorw'}


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)

@app.route("/api/fetchdoc", methods=["GET"])
def doc_load():
    global hit_dict_list
    global tid
    if request.args.get("tid"):
        tid = str(request.args.get("tid"))
    print tid
    try:
        assert tid != -1
    except:
        raise ValueError()
    print "keys for hit_dict_list: ", hit_dict_list.keys()
    response_doc = hit_dict_list[tid]
    headers = {
        'content-type': 'application/json',
    }

    doc_content = json.dumps(response_doc['doc'])
    queryjson = json.dumps(query)

    data = '{"doc":'+ doc_content + ',"query":'+queryjson+'}'

    # start = time.time()
    # response = requests.post(
    #     'http://35.226.191.60:80/query_summarize?key=AIzaSyBGktXQ3IPpwymVSAko08kxbIY4UcGQorw', headers=headers, data=data)
    # print "summary_time = "+ str(time.time()-start)
    # response_doc['query_summary'] = json.loads(response.text)['summary']
    response_doc['query_summary'] = "Summary goes here"

    print response_doc.keys()
    return jsonify(response_doc = response_doc)

@app.route("/api/search", methods=["GET"])
def search():
    global loogal
    global doc_list
    global is_end
    doc_list = []
    global hit_dict_list
    global query
    global active_filter
    active_filter = {}
    hit_dict_list = {} 
    id = -1
    global search_size
    is_end = False
    if request.args.getlist('docDrop'):
        active_filter['divtype'] = request.args.getlist('docDrop')
    if request.args.getlist('sourceDrop'):
        active_filter['docsource']= request.args.getlist('sourceDrop')
    if request.args.get('startYear'):
        active_filter['start'] = request.args.get('startYear')
    if request.args.get('endYear'):
        active_filter['end'] = request.args.get('endYear')
    if request.args.get('search_phrase'):
        print request.args.get('search_phrase')
        query = request.args.get('search_phrase')
    if request.args.get('page'):
        print request.args.get('page')
        page = request.args.get('page')


    print "Active", active_filter
    start = time.time()
    print "querying time"
    s, n_hits = loogal.find_keyword(query, active_filter)
    print time.time()-start
    start = time.time()
    # code to get the first set of search results
    s, hits_end, hit_list = loogal.get_next_set_of_results()
    print "getting results time", time.time()-start
    # form_display = (n_hits,query,doc_list)
    
    key_passed = ['tid','title', 'divtype','bench', 'source']
    for hit in hit_list:
        hit_dict = hit.to_dict()
        if hit_dict["author"] == "":
            hit_dict["author"] = "Author not available"
        if hit_dict["bench"] == "":
            hit_dict["bench"] = "Bench not available"
        if not hit_dict["cited_links"]:
            hit_dict["cited_links"] = ["No cited link available"]
        if not hit_dict["cited_titles"]:
            hit_dict["cited_titles"] = ["No cited title available"]
        if hit_dict["content"] == "":
            hit_dict["content"] = "Content not available"
        if hit_dict["divtype"] == "":
            hit_dict["divtype"] = "Type not available"
        if hit_dict["doc"] == "":
            hit_dict["doc"] = "Content not available"
        if not hit_dict["keywords"]:
            hit_dict["keywords"] = ["No keyword"]
        if hit_dict["source"] == "":
            hit_dict["source"] = "Source not available"
        if hit_dict["summary"] == "":
            hit_dict["summary"] = "Summary not available"
        if hit_dict["title"] == "":
            hit_dict["title"] = "Title not available"
        doc_dict = {key: hit_dict[key] for key in key_passed}
        doc_dict['highlights'] = "This is where the highlight will go. Lorem Ipsum totem doloris"
        doc_list.append(doc_dict)
        hit_dict_list[str(hit_dict['tid'])]= hit_dict
        # print hit_dict['author'], hit_dict['bench']
    print "Computed DocList"
    print hit_dict_list.keys()
    if len(doc_list) < search_size:
	    is_end = True
    search_results = {
        "n_hits": n_hits,
        "query": query,
        "doc_list": doc_list
    }
    print "REACHED END"
    return jsonify(search_results = search_results,
                        search_size = search_size,
                        active_filter = active_filter,
                        query = query,
			            is_end = is_end)

@app.route("/api/get_more", methods=["GET"])
def get_more():
    global is_end
    global loogal
    print loogal.start
    print loogal.query
    global hit_dict_list
    s, hits_end, hit_list = loogal.get_next_set_of_results()
    doc_list = []

    key_passed = ['tid','title', 'divtype','bench', 'source']
    for hit in hit_list:
        hit_dict = hit.to_dict()
        if hit_dict["author"] == "":
            hit_dict["author"] = "Author not available"
        if hit_dict["bench"] == "":
            hit_dict["bench"] = "Bench not available"
        if not hit_dict["cited_links"]:
            hit_dict["cited_links"] = ["No cited link available"]
        if not hit_dict["cited_titles"]:
            hit_dict["cited_titles"] = ["No cited title available"]
        if hit_dict["content"] == "":
            hit_dict["content"] = "Content not available"
        if hit_dict["divtype"] == "":
            hit_dict["divtype"] = "Type not available"
        if hit_dict["doc"] == "":
            hit_dict["doc"] = "Content not available"
        if not hit_dict["keywords"]:
            hit_dict["keywords"] = ["No keyword"]
        if hit_dict["source"] == "":
            hit_dict["source"] = "Source not available"
        if hit_dict["summary"] == "":
            hit_dict["summary"] = "Summary not available"
        if hit_dict["title"] == "":
            hit_dict["title"] = "Title not available"
        doc_dict = {key: hit_dict[key] for key in key_passed}
        doc_dict['highlights'] = "This is where the highlight will go. Lorem Ipsum totem doloris"
        doc_list.append(doc_dict)
        hit_dict_list[str(hit_dict['tid'])]= hit_dict

    print "Computed DocList"

    if len(doc_list) < search_size:
        is_end = True 
 
    return jsonify(doc_list=doc_list, is_end=is_end)

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

