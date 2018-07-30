set dirpath="%cd%"
@echo dirpath
cd %dirpath%
cocos compile -p web -m release
start %dirpath%\publish\rhythm_master
start G:\1