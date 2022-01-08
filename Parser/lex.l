%{
#include<stdio.h>
#include<string.h>
#include"syn.tab.h"

int ligne=1;
int col=1;
extern YYSTYPE yylval;
%}
lettres [a-zA-Z]
chiffres [1-9][0-9]*|0
IDF {lettres}({lettres}|{chiffres}|_)*({lettres}|{chiffres})*
Pint 0|(([-][1-9])|[1-9])[0-9]*
Pfloat {chiffres}[.]{chiffres}
comment \/\*.+\*\/


%%
\= {return egale;col+=yyleng;}
Program {return w_program ;col=col+yyleng;}
PDEC {return w_pdec;col=col+yyleng;}
PINST {return w_pinst;col=col+yyleng;}
Begin {return w_begin;col=col+yyleng;}
End {return w_end;col=col+yyleng;}
Pint {yylval.str=strdup(yytext); return w_pint;col=col+yyleng;}
Pfloat {yylval.str=strdup(yytext); return w_pfloat;col+=yyleng;}
FOR  {return w_FOR ;col+=yyleng;}
WHILE {return w_WHILE ;col+=yyleng;}
DO {return w_DO ;col+=yyleng;}
ENDFOR; {return w_ENDFOR ;col+=yyleng;}
IF: {return w_IF ;col+=yyleng;}
ELSE {return w_ELSE ;col+=yyleng;}
ENDIF; {return w_ENDIF; col+=yyleng; }
@define {return w_define;col+=yyleng;}
; {return pvg;col+=1;}
[+] { return plus;} 
[/] {return division;}
[-] { return sust;} 
[*] { return multi;} 
":" {return ponc;col+=yyleng;}
"<" { return petitque;}
">" { return grandque;}
"//".* /* ignore comments */
"!" return notEgal;
"|" return  orsym;
"(" return par_ov;
")" return par_fr;
"&" return mc_et;
{Pint} {yylval.entier=atoi(yytext);return cst;col+=yyleng;}
{Pfloat} {yylval.entier=atof(yytext);return reel;col+=yyleng;}
{IDF} {if (yyleng<12) {inserer(yytext,"",sauvType);
                       yylval.str = strdup(yytext);
                       return idf;}
            else printf("erreur lexical : l'idf  %s  est trop long \n",yytext);}
{comment}		{ col+=yyleng;  }
"<--" {return aff;col+=yyleng;}

\n {ligne++;}
    /*this is a comment */
[ \t] {col+=yyleng;}

. {printf("cette lexic n'est pas reconnue a la ligne %d dans l'entite %s \n",ligne,yytext);}
%%
int yywrap(void)
{
    return 0;
}

