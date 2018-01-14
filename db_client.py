# db_client.py
import os
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

RDB_HOST = 'localhost'
RDB_PORT = 28015

PROJECT_DB = 'crypto'
PROJECT_TABLE_BTC = 'btc'
PROJECT_TABLE_DOGE = 'doge'
PROJECT_TABLE_ETHERIUM = 'eth'
PROJECT_TABLE_LITECOIN = 'ltc'
PRIMARY_KEY = 'date'

# Set up db connection client
db_connection = r.connect(RDB_HOST, RDB_PORT)


def dbSetup():
    """Function is for cross-checking database and table exists """
    try:
        r.db_create(PROJECT_DB).run(db_connection)
        print('Database setup completed.')
    except RqlRuntimeError:
        try:
            r.db(PROJECT_DB).table_create(PROJECT_TABLE_BTC).run(db_connection)
            print('Table - %s, creation completed' % PROJECT_TABLE_BTC)

            r.db(PROJECT_DB).table_create(PROJECT_TABLE_DOGE).run(db_connection)
            print('Table - %s, creation completed' % PROJECT_TABLE_DOGE)

            r.db(PROJECT_DB).table_create(PROJECT_TABLE_ETHERIUM).run(db_connection)
            print('Table - %s, creation completed' % PROJECT_TABLE_ETHERIUM)

            r.db(PROJECT_DB).table_create(PROJECT_TABLE_LITECOIN).run(db_connection)
            print('Table - %s, creation completed' % PROJECT_TABLE_LITECOIN)
        except:
            print('Table already exists.Nothing to do')

dbSetup()
