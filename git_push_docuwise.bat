@echo off
echo ============================
echo Starting Git Push - DocuWise
echo ============================

REM Navigate to repo root (optional - ensure this is correct)
cd /d "D:\NIKHIL\01. Start Up\01. IDMS Infotech\03. Products\idp\Coding\DocuWise_POC"

REM Show current Git status
echo.
git status

REM Add both folders
echo.
echo Adding frontend and backend...
git add frontend
git add backend

REM Commit with timestamped message
echo.
set datetime=%date% %time%
git commit -m "Auto-push DocuWise changes - %datetime%"

REM Push changes
echo.
echo Pushing to origin...
git push

REM Confirm completion
echo.
echo ============================
echo Done! Changes pushed to GitHub.
echo ============================

pause
