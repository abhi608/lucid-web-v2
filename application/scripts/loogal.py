from utils import Esearch

class Loogal():
    def __init__(self, search_size):
        self.search_url = 'https://126gyb9o3f:kj1wd4axy7@lucid-871717653.us-east-1.bonsaisearch.net'
        self.last_searched = None
        self.search_size = search_size
        self.search = Esearch(search_url=self.search_url)
        self.start = 0

    def find_keyword(self, keyword, doc_filter=None, domain=None):
        s, n_hits = self.search.search_keyword(keyword, doc_filter, self.search_size, domain)
        self.query = keyword
        self.s = s
        self.n_hits = n_hits
        self.start = 0
        return s, n_hits

    def get_next_set_of_results(self):
        '''
        Get the next set of results, given the search object,
        size of the batch and starting point of the search
        '''

        hits_start = self.start
        hit_list = []
        hits_end = min(hits_start + self.search_size, self.n_hits)
        s_short = self.s[hits_start:hits_end]
        res = s_short.execute()
        hit_ids = []
        for hit in s_short:
            hit_ids.append(hit['tid'])
            hit_list.append(hit)
        self.start += self.search_size
        return self.s, hits_end, hit_list, res.aggregations


    def fetch_document(self, key, domain=None):
        ''' Fetch document from database given key '''
        print "Getting doc ", key
        document = self.search.get_doc(key, domain)
        # print "DoC: ", document
        return document


if __name__ == "__main__":
    loog = Loogal()
    keyword = input("Enter keyword to search: ")
    s, n_hits, hit_list = loog.find_keyword(keyword)
    print('Found {} hits'.format(n_hits))
    print('Key List: ', hit_list)
    print('first few results: ', loog.get_next_set_of_results(
        start=0)[2])
    # print('Single document: ', loog.fetch_document(196364))
