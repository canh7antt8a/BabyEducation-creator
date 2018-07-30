set dirpath="%cd%"
@echo dirpath
cd %dirpath%
cocos compile -p web -m release
start %dirpath%\publish\html5
start G:\1