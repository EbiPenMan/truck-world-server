
@ECHO OFF

SET CURRENT_PATH=%~dp0

SET CONFIG_PATH=%CURRENT_PATH%config.yml

echo CONFIG_PATH: %CONFIG_PATH%

nakama.exe --config %CONFIG_PATH%


pause