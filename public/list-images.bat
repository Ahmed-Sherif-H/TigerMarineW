@echo off
setlocal enabledelayedexpansion

REM Change this to your images root folder
set ROOT=E:\Tiger Marine\tigermarine2\frontend\public\images

REM Output file
set OUTPUT=images_list.txt

echo Listing folders and images... > "%OUTPUT%"
echo ============================== >> "%OUTPUT%"

for /d %%F in ("%ROOT%\*") do (
    echo. >> "%OUTPUT%"
    echo %%~nxF >> "%OUTPUT%"

    REM Images directly inside the main folder
    for %%I in ("%%F\*.jpg" "%%F\*.png" "%%F\*.jpeg" "%%F\*.webp") do (
        if exist "%%I" (
            echo   %%~nxI >> "%OUTPUT%"
        )
    )

    REM Images inside the interior folder (if it exists)
    if exist "%%F\interior\" (
        echo   interior >> "%OUTPUT%"
        for %%J in ("%%F\interior\*.jpg" "%%F\interior\*.png" "%%F\interior\*.jpeg" "%%F\interior\*.webp") do (
            if exist "%%J" (
                echo     %%~nxJ >> "%OUTPUT%"
            )
        )
    )
)

echo Done! Output saved to %OUTPUT%
pause
