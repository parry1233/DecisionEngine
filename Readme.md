# DO NOT work on this branch! 
This branch is for completed Code.

> ### Make sure you are under BusinessEngine Folder!

## **Install Packages**
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

## **Run Program**
1. ### How to run django server
    ```bash
    pipenv shell
    cd web_project
    python manage.py makemigrations # for migrations (if needed), if not, ignore this line
    python manage.py migrate # for migrations (if needed), if not, ignore this line
    python manage.py runserver
    ```

2. ## How to run react web
    ```bash
    cd frontend
    npm start
    ```

3. ## Port settings on linux server
    ```bash
    #replace <PORT> with the port you want to enable/disable public access
    sudo ufw allow <PORT> # open port for public
    sudo ufw deny <PORT> # close port from public
    ```
