call npm run build
cd dist
call git init
call git checkout -b main
call git add -A
call git commit -m "deploy"

call git push -f git@github.com:Vince7778/mmt-problem-gui.git main:gh-pages

cd ../