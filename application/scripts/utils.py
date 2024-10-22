from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from pprint import pprint
import os, base64, re, logging
import certifi
import datetime

class Esearch():
    '''A class to implement elastic search through python'''

    def __init__(self,
                 search_url='https://126gyb9o3f:kj1wd4axy7@lucid-871717653.us-east-1.bonsaisearch.net/    '):

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

        s = Search(index='lucid').using(self.client)
        print doc_filter
        if 'divtype' in doc_filter:
            for i,types in enumerate(doc_filter['divtype']):
                if i==0:
                    filt = Q("match",divtype=types)
                else:
                    filt = filt|Q("match",divtype=types)
            s = s.filter(filt)
        n_hits = s.count()
        if 'docsource' in doc_filter:
            for i,types in enumerate(doc_filter['docsource']):
                if i==0:
                    filt = Q("match",docsource=types)
                else:
                    filt = filt|Q("match",docsource=types)
            s = s.filter(filt)

        flag = 0
        if 'end' in doc_filter:
            flag = 1
            end_year = datetime.datetime(int(doc_filter['end']),12,31)
        else:
            end_year = datetime.datetime.now()

        if 'start' in doc_filter:
            flag = 0
            start_year = datetime.datetime(int(doc_filter['start']),1,1)
            s= s.filter('range',publishdate={'gte':start_year,'lte':end_year})

        if flag:
            s = s.filter('range',publishdate={'lte':end_year})
        # the search object. -p indicates sort by order=desc on p
        # --------------------------------------query-------------------------------------------------------
        q1 = Q("multi_match", query=keyword, fields=["title", "keywords", "doc"], type="best_fields", cutoff_frequency=0.0007,
            operator="and", fuzziness="AUTO")
        q2 = Q("multi_match", query=keyword, fields=["title", "keywords", "doc"], type="phrase")
        q3 = Q("bool", must=[q1], should=[q2])
        s = s.query(q3)

        s = s.suggest("didYouMean", keyword, phrase={'field': 'did_you_mean'})

        s = s.highlight_options(order="score", pre_tags=["<mark>"], post_tags=["</mark>"], fragment_size=80, no_match_size=0)
        s = s.highlight('title', number_of_fragments=0)
        s = s.highlight('keywords', number_of_fragments=10)
        s = s.highlight('doc', number_of_fragments=10)
        # ---------------------------------------------------------------------------------------------------
        n_hits = s.count()
        print "hits = ", n_hits
        hits_start = 0
        return s, n_hits

    def get_doc(self, key):
        '''
        Function to search for a single document given its tid
        '''
        s = Search().using(self.client).query("match", tid=str(key))
        result = s.execute()
        return result


def test_search():
    s_try = Esearch()
    _, n_hits, hit_list = s_try.search_keyword("India")
    print("Found {} hits".format(n_hits))
    print("key list:\n", hit_list)
    pprint(s_try.get_doc(hit_list[0][0]))



if __name__ == "__main__":
    test_search()
