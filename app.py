from flask import Flask, jsonify, make_response
from flask_cors import CORS
from db_client import *
import requests, json

app = Flask(__name__)
# cache = Cache(config={'CACHE_TYPE':'simple'})
# cache.init_app(app)
CORS(app)


@app.route('/', methods=['GET'])
# @cache.cached(timeout=300, key_prefix="currency_index")
def get_index():
    """Handles GET requests for index page"""
    response_list = []
    btc_result = r.db(PROJECT_DB).table(PROJECT_TABLE_BTC). \
        order_by(index=r.desc(PRIMARY_KEY)).limit(1).pluck(
            'priceUSD', 'date', 'txVolumeUSD').run(db_connection)
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
# @cache.cached(timeout=300, key_prefix="currency_history")
def get_history(currency):
    """GET requests for historical price and volume info for selected currency"""
    _currency = return_currency_code(currency)
    _tab = r.db(PROJECT_DB).table(_currency).order_by(
        index=r.desc('date')).pluck('date', 'priceUSD', 'txVolumeUSD')
    query = _tab.run(db_connection)
    if query is not None:
        print('query returned %d rows for currency - %s' %
              (len(query.items), currency))
    else:
        print('query returned no rows for currency - %s', currency)
    return_val = [q for q in query.items]
    return jsonify(return_val)


@app.route('/api/getprice/<string:currency>', methods=['GET'])
def get_current_price(currency):
    """Gets the current price for selected currency from external source"""
    _currency = return_currency_code(currency)
    key = 'SQ53PLSDSYK58K0A'
    url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_' \
          'INTRADAY&symbol={}&market=USD&apikey={}'.format(_currency, key)
    response = {}
    with requests.get(url, stream=True) as r:
        print('Currency - %s, URL - %s, Request Status - %d, Reason - %s' %\
            (_currency, url, r.status_code, r.reason))
        data = r.json()
        my_data = data['Time Series (Digital Currency Intraday)']
        for k,v in my_data.items():
            vals = list(v.values())
            response = {'date': k, 'price': vals[0],'volume': vals[2]}
            break
    return jsonify(response)


def return_currency_code(currency):
    """Returns the correct currency code"""
    _currency = PROJECT_TABLE_BTC
    if currency is not None:
        if currency == 'DogeCoin':
            _currency = PROJECT_TABLE_DOGE
        elif currency == 'Ethereum':
            _currency = PROJECT_TABLE_ETHERIUM
        elif currency == 'Litecoin':
            _currency = PROJECT_TABLE_LITECOIN
    return _currency


@app.errorhandler(404)
def not_found(error=None):
    """Error handler"""
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(port=9090)
