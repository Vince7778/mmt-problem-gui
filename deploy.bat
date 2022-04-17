npm run build
cd dist
git init
git checkout -b main
git add -A
git commit -m "deploy"

git push -f git@github.com:Vince7778/mmt-problem-gui.git main:gh-pages

cd -