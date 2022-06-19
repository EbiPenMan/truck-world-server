
@ECHO OFF

SET CURRENT_PATH=%~dp0

PUSHD %CD%
CD ..
CD ..
CD ..
SET MNIST_DIR=%CD%
POPD

echo MNIST_DIR: %MNIST_DIR%
SET DB_DATA_PATH=%MNIST_DIR%\data\db-data

echo DB_DATA_PATH: %DB_DATA_PATH%

cockroach.exe start-single-node --insecure --listen-addr=127.0.0.1 --store=path=%DB_DATA_PATH%,size=20GB

pause