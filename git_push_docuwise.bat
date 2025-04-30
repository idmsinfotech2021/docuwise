@echo off
echo --------------------------------------
echo Committing DocuWise backend + frontend
echo --------------------------------------

REM Navigate to project root (optional: adjust path)
cd /d D:\NIKHIL\01. Start Up\01. IDMS Infotech\03. Products\idp\Coding\DocuWise_POC

REM Force add frontend and backend to track even if previously ignored
git add frontend
git add backend

REM Optional: also track other changed files
git add .

REM Ask for a commit message
set /p commitMsg="Enter commit message: "
git commit -m "%commitMsg%"

REM Push to the current branch
git push

echo --------------------------------------
echo ✅ Code pushed successfully!
pause
