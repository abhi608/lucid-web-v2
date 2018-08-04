# Run generate_offline to get json file for pageranks

import networkx as nx
import json
import random
import numpy as np
from app.scripts.utils import Mongo
from os import listdir
from networkx.readwrite import json_graph


class PageRank:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.ranks = None

    def load_data(self, directory):
        '''Loads data if already generated'''
        with open(directory + '/page_ranks.json') as rank_file:
            self.ranks = json.load(rank_file)
        with open(directory + '/citation_graph.json') as graph_file:
            self.graph = json_graph.node_link_graph(json.load(graph_file))

    def save_data(self, directory):
        '''Saves data as a json file'''
        with open(directory + '/page_ranks.json', 'w') as rank_file:
            json.dump(self.ranks, rank_file)
        with open(directory + '/citation_graph.json', 'w') as graph_file:
            json.dump(json_graph.node_link_data(self.graph), graph_file)

    def pagerank_list(self, cite_list):
        '''Generates pageranks from a list
        cite_list is a list of the form:
        [[key1, key1-1, key1-2,..], [key2, key2-1, key2-2,..],..]'''
        G = self.graph
        for doc in cite_list:
            key = doc[0]
            G.add_node(key)
            for citation in doc[1:]:
                G.add_edge(key, citation)
        self.graph = G

        self.generate_pagerank()
        print('Finish generating pageranks')

    def pagerank_db(self, db_url, db_name, coll_name):
        '''Generates pageranks directly from the mongodb database'''
        mg = Mongo(db_url, db_name, coll_name)

        print('Started creating cite_list')
        mg.get_all()
        cite_list = []

        while not mg.finished:
            mg.get_next()
            cite_ids = [mg.doc['tid']]
            cite_dict = mg.doc['citeList']
            for citation in cite_dict:
                cite_ids.append(citation['tid'])
            cite_list.append(cite_ids)

        cite_list = np.array(cite_list)
        print('Finished creating citeList')

        self.pagerank_list(cite_list)

    def pagerank_offline(self, directory):
        '''Generates pageranks from offline data'''
        print('Started creating citeList..')
        cite_list = []
        for filename in listdir(directory):
            with open(directory + '/' + filename) as fp:
                doc_list = json.load(fp)
                for doc in doc_list:
                    cite_ids = [doc['tid']]
                    cite_dict = doc['citeList']
                    for citation in cite_dict:
                        cite_ids.append(citation['tid'])
                    cite_list.append(cite_ids)

        cite_list = np.array(cite_list)
        print('Finished creating citeList')

        self.pagerank_list(cite_list)

    def add_documents(self, orig_directory, new_directory):
        '''
        Loads old data from orig_firectory, adds documents in new_directory
        '''
        self.load_data(orig_directory)
        self.pagerank_offline(new_directory)
        self.save_data(orig_directory)

    def add_documents(self, new_directory):
        '''Overloaded: adds documents in new_directory'''
        self.pagerank_offline(new_directory)
        self.save_data(orig_directory)

    def generate_pagerank(self):
        ''' precomputes pageranks from graph'''
        print('Started generating pageranks..')
        self.ranks = nx.pagerank(self.graph)

    def sort_pagerank(self, key_list):
        '''sort a list of document keys according to page ranks '''
        rank_list = np.array(
            [self.ranks[str(key).decode("utf-8")] for key in key_list])
        rank_list, key_list = zip(*sorted(zip(rank_list, key_list)))
        key_list = key_list[::-1]
        return key_list

    def print_graph(self):
        print('Nodes : ', self.graph.nodes())
        print('\nEdges : ', self.graph.edges())

    def related_nodes(self, key):
        print()


def test():
    pg = PageRank()
    pg.load_data('../files')

    node_list = np.array(random.sample(pg.graph.nodes(), 5))
    print('Unsorted: ', node_list)
    print('Sorted:   ', pg.sort_pagerank(node_list))


def test_db():
    MONGO_HOST = "mongodb://192.168.43.192:27017/"
    MONGO_DB = "pagerank"
    MONGO_COLL = "pageranks"

    pg = PageRank()
    pg.pagerank_db(MONGO_HOST, MONGO_DB, MONGO_COLL)
    node_list = np.array(random.sample(pg.graph.nodes(), 5))

    print('Unsorted: ', node_list)
    print('Sorted:   ', pg.sort_pagerank(node_list))


def generate_offline():
    pg = PageRank()
    pg.pagerank_offline('../data')
    pg.save_data('../files')
