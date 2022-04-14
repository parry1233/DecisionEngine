This branch is for completed code
## DO NOT work on this branch! This branch is for completed Code.

## Install
1. For Backend (Server)
    
    (1.) Environment requires: python=3.9.9

    (2.) Initialization: `pip install` will automatically install packages in Pipfile
    ```bash
    pip install pipenv
    pipenv install
    ```
2. For Frontend (Web)

    (1.) Environment requires: node.js (npm)

    (2.) Install packages: `npm install` will automatically install packages in package.json
    ```bash
    cd frontend
    npm install
    ```

## How to run django server
```bash
pipenv shell
cd web_project
python manage.py makemigrations # for migrations (if needed), if not, ignore this line
python manage.py migrate # for migrations (if needed), if not, ignore this line
python manage.py runserver
```

## How to run react web
```bash
cd frontend
npm start
```
