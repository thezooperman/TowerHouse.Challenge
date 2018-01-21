My effort to learn deployment via docker, also build super scalable python api

Setup Steps:
------------
1. Install rethinkdb - https://www.rethinkdb.com/
2. Start the rethinkdb server
3. The rethinkdb admin portal can be found at - http://localhost:8080/
4. Load the json or csv files into the rethinkdb - check the rethinkdb portal for data loading details(All the files are in the setup/data folder)
5. install pipenv (http://pipenv.readthedocs.io/en/latest/)
6. create project using pipenv
7. hit - pipenv run app.py to get started
8. open the index.html in a browser - *NOTE* - For some reson, EDGE browser does not behave properly, so skip that