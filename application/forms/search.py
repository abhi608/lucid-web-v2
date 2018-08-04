from flask_wtf import Form
from wtforms import TextField
from wtforms.validators import Required


class Search(Form):
    ''' User searches '''
    search_phrase = TextField(
        validators=[Required()], description='Search phrase')


class DisplayResults(Form):
    ''' User searches '''

    def __init__(self, n_hits, query, doc_list):
        self.n_hits = n_hits
        self.query = query
        self.doc_list = doc_list
