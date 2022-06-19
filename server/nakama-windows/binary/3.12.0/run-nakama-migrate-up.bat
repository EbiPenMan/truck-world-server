
@ECHO OFF

SET CURRENT_PATH=%~dp0

@REM PUSHD %CD%
@REM CD ..
@REM CD ..
@REM CD ..
@REM SET MNIST_DIR=%CD%
@REM POPD

@REM echo MNIST_DIR: %MNIST_DIR%
@REM SET DB_DATA_PATH=%MNIST_DIR%\data\db-data

@REM echo DB_DATA_PATH: %DB_DATA_PATH%

@REM cockroach.exe start-single-node --insecure --listen-addr=127.0.0.1 --store=path=%DB_DATA_PATH%,size=20GB



SET CONFIG_PATH=%CURRENT_PATH%config.yml

echo CONFIG_PATH: %CONFIG_PATH%

nakama.exe migrate up -database.address root@localhost:26257/nakama-truck-world


pause