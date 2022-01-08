flex lex.l
bison -d syn.y 
gcc lex.yy.c syn.tab.c -o out
.\out<Examples/Cinput1.txt


