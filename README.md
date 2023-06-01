# nexus-flask-demo

# How to launch
Please run the following command
```
pip install -r requirements.txt
python -m flask run
```

# How to upload to another branch
Please run the following command
```
git checkout main
git pull origin main

git checkout -b <your-branch>
# Did some change to code
git rebase main
git add .
git commit -m "${your-commit-msg}"
git push origin <your-branch>
```