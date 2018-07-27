from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q, A
from pprint import pprint
import os, base64, re, logging
import certifi
import datetime

class Esearch():
    '''A class to implement elastic search through python'''

    def __init__(self,
                 search_url='https://126gyb9o3f:kj1wd4axy7@lucid-871717653.us-east-1.bonsaisearch.net/'):

        bonsai = search_url
        auth = re.search('https\:\/\/(.*)\@', bonsai).group(1).split(':')
        host = bonsai.replace('https://%s:%s@' % (auth[0], auth[1]), '')
        es_header = [{
          'host': host, 'port': 443, 'use_ssl': True,
          'http_auth': (auth[0],auth[1]),
           'ca_certs':certifi.where(),
            'timeout':40000
        }]
        self.client = Elasticsearch(es_header)

    def all_docs(self):
        s = Search().using(self.client).query()
        s.execute()
        hit_ids = []
        for hit in s:
            hit_ids.append(hit['tid'])

    def search_keyword(self, keyword,doc_filter=None, size=10):
        '''
        Create the search object and get the number of hits.
        '''

        s = Search(index='docs').using(self.client)
        print "doc_filter: ", doc_filter
        q1 = Q("multi_match", query=keyword, fields=["title", "keywords", "content"], type="best_fields", cutoff_frequency=0.0007,
            operator="and", fuzziness="AUTO")
        q2 = Q("multi_match", query=keyword, fields=["title", "keywords", "content"], type="phrase")
        q3 = Q("bool", must=[q1], should=[q2])
        s = s.query(q3)

        s = s.suggest("didYouMean", keyword, phrase={'field': 'did_you_mean'})

        s = s.highlight_options(order="score", fragment_size=80, no_match_size=0)
        s = s.highlight('content', number_of_fragments=3)

        a1 = A('terms', field='author.keyword', size=500)
        a2 = A('terms', field='bench.keyword', size=500)
        a3 = A('terms', field='divtype.keyword', size=500)
        a4 = A('terms', field='source.keyword', size=500)
        s.aggs.bucket('distinct_author', a1)
        s.aggs.bucket('distinct_bench', a2)
        s.aggs.bucket('distinct_divtype', a3)
        s.aggs.bucket('distinct_source', a4)

        if 'author' in doc_filter:
            for i,item in enumerate(doc_filter['author']):
                if i==0:
                    filt = Q("match",author=item)
                else:
                    filt = filt|Q("match",author=item)
            s = s.filter(filt)

        if 'bench' in doc_filter:
            for i,item in enumerate(doc_filter['bench']):
                if i==0:
                    filt = Q("match",bench=item)
                else:
                    filt = filt|Q("match",bench=item)
            s = s.filter(filt)

        if 'divtype' in doc_filter:
            for i,item in enumerate(doc_filter['divtype']):
                if i==0:
                    filt = Q("match",divtype=item)
                else:
                    filt = filt|Q("match",divtype=item)
            s = s.filter(filt)

        if 'source' in doc_filter:
            for i,item in enumerate(doc_filter['source']):
                if i==0:
                    filt = Q("match",source=item)
                else:
                    filt = filt|Q("match",source=item)
            s = s.filter(filt)
        print s.to_dict()
        # ---------------------------------------------------------------------------------------------------
        n_hits = s.count()
        print "hits = ", n_hits
        hits_start = 0
        return s, n_hits

    def get_doc(self, key):
        '''
        Function to search for a single document given its tid
        '''
        s = Search(index='docs').using(self.client).query("match", tid=str(key))
        print s.to_dict()
        result = s.execute()
        if not result:
            return None
        else:
            return result[0]


def test_search():
    s_try = Esearch()
    _, n_hits, hit_list = s_try.search_keyword("India")
    print("Found {} hits".format(n_hits))
    print("key list:\n", hit_list)
    pprint(s_try.get_doc(hit_list[0][0]))



if __name__ == "__main__":
    test_search()
