from flask import Flask, jsonify, make_response
from flask_cors import CORS
from db_client import *

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def get_index():
    """Handles GET requests"""
    response_list = []
    btc_result = r.db(PROJECT_DB).table(PROJECT_TABLE_BTC). \
        order_by(index=r.desc(PRIMARY_KEY)).limit(1).run(db_connection)
    btc_result.items[0]['currency'] = 'Bitcoin'
    eth_result = r.db(PROJECT_DB).table(PROJECT_TABLE_ETHERIUM). \
        order_by(index=r.desc(PRIMARY_KEY)).limit(1).run(db_connection)
    eth_result.items[0]['currency'] = 'Ethereum'
    ltc_result = r.db(PROJECT_DB).table(PROJECT_TABLE_LITECOIN). \
        order_by(index=r.desc(PRIMARY_KEY)).limit(1).run(db_connection)
    ltc_result.items[0]['currency'] = 'Litecoin'
    doge_result = r.db(PROJECT_DB).table(PROJECT_TABLE_DOGE). \
        order_by(index=r.desc(PRIMARY_KEY)).limit(1).run(db_connection)
    doge_result.items[0]['currency'] = 'DogeCoin'
    response_list.append(btc_result.items[0])
    response_list.append(eth_result.items[0])
    response_list.append(doge_result.items[0])
    response_list.append(ltc_result.items[0])
    return jsonify(response_list)


@app.route('/api/currency/<string:currency>', methods=['GET'])
def get_history(currency):
    """Handled detailed GET requests"""
    _currency = PROJECT_TABLE_BTC
    if currency is not None:
        if currency == 'DogeCoin':
            _currency = PROJECT_TABLE_DOGE
        elif currency == 'Ethereum':
            _currency = PROJECT_TABLE_ETHERIUM
        elif currency == 'Litecoin':
            _currency = PROJECT_TABLE_LITECOIN

    _tab = r.db(PROJECT_DB).table(_currency).order_by(index=r.desc('date'))
    query = _tab.run(db_connection)
    if query is not None:
        print('query returned %d rows for currency - %s' % (len(query.items), currency))
    else:
        print('query returned no rows for currency - %s', currency)
    return_val = [q for q in query]
    return jsonify(return_val)


@app.errorhandler(404)
def not_found(error=None):
    """Error handler"""
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(port=9090)
