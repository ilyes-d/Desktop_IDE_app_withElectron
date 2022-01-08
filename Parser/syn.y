%{
#include<stdio.h>
#include <string.h>
#include "fonction.h"
extern int ligne;
extern int col;
int I=0,R=0;
char sauvType[20];
int yylex();
int yyparse();
void yyerror(char *s);
%}
%union{
int entier;
char* str;
double rel;
}
%start s
%token <str>w_program <str>idf <str>w_pdec <str>w_pinst <str>w_begin 
<str>pvg<str>w_pint <str>w_pfloat <str>w_define <str>mc_et  <str>w_end
 <str>w_FOR <str>w_DO <str>w_WHILE <str>w_ENDFOR <str>w_IF <str>w_ELSE
 <str>aff <str>egale <str>ponc <str>orsym <str>w_ENDIF
 <str>par_ov <str>par_fr <str>petitque <str>grandque
 <str>notEgal <str>plus <str>division <str>sust <str>multi
 <rel>reel  <entier>cst     

%type <str>idf_inst
%%
s:w_program idf w_pdec dec_part w_pinst w_begin inst_part w_end 
       { printf ("\n programme syntaxiquement juste \n");YYACCEPT;}
;
dec_part: DEC dec_part 
         | 
;
DEC: DEC_VAR
    | DEC_CONST
;
//declaration d'un variable
DEC_VAR: liste_var ponc type pvg
;
liste_var:idf  orsym  liste_var 
          {if(insererType($1,sauvType)!=0)
  printf("erreur semantique: double declaration  de '%s' a la ligne %d ,et la colonne %d\n",$1,ligne,col);               
                else 
                inserer($1,"",sauvType);
								}
                
          |idf
          { if(insererType($1,sauvType)!=0)
                                    printf("erreur semantique: double declaration  de '%s' a la ligne %d ,et la colonne %d\n",$1,ligne,col);
                else 
                inserer($1,"",sauvType);
								}							
;


//declaration d'une constante
DEC_CONST:w_define type idf egale cst pvg
         { if(insererType($3,strcat(sauvType,""))!=0)
            printf("erreur semantique : double declaration  de %s a la ligne %d ,colonne %d\n",$3,ligne,col);
              else 
              inserer($3,"",sauvType);
              insererNature($3,"constante");
           }
;          
          
//les types
type:w_pint {strcpy(sauvType,$1);}
    |w_pfloat {strcpy(sauvType,$1);} 
;
;
//partie instruction
inst_part: INSTRUCTION inst_part 
|
;
INSTRUCTION:idf_inst aff expr  pvg
             {if(strcmp($1,"Pfloat")==0)
              {
                if(I==1)
                 printf("erreur semantique, Idf type non compatible a la ligne %d , colonne %d avec le type  %s\n",ligne,col,$1);
              }
              else if(strcmp($1,"Pint")==0){
                if(R==1)
                 printf("erreur semantique, Idf type non compatible a la ligne %d ,colonne %d avec le type %s\n",ligne,col,$1);
              }
             }
           |INST_FOR 
           |INST_COND
; 
//const
idf_inst:idf
  {$$=getType($1);
  if(idfDeclare($1)==0)
      {printf("erreur semantique, Idf -%s- non declare a la ligne %d ,colonne %d\n",$1,ligne,col); inserer($1,"","");}
      else if(isConst($1) )
           {printf("erreur semantique, Idf -%s- est un CONST n'accpete pas de affectation a la ligne %d ,colonne %d\n",$1,ligne,col);}
 
}
;
//instruction condition 
INST_COND:w_DO inst_part w_IF par_ov CONDITION par_fr w_ELSE inst_part w_ENDIF  
         |w_DO inst_part w_IF par_ov CONDITION par_fr w_ENDIF 
;
CONDITION:expressionC|expL;
//instruction boucle
INST_FOR:w_FOR idf aff cst w_WHILE cst w_DO inst_part w_ENDFOR  
;


//expresson de comparaison
expressionC:expr grandque expr
	       |expr petitque expr
	       |expr grandque egale expr
	       |expr  petitque egale expr  
	       |expr egale egale expr
	       |expr notEgal egale expr
           |par_ov expressionC par_fr
;  
//expresson arthmithique 
expr   : expr plus prod // associativite a gauche
       | expr sust prod // operations les moins prioritaires
       | prod
;  
prod   : prod multi factor // associativite a gauche
       | prod division cst{if($3 == 0){ 
                               printf("erreur symantique div 0 dans la ligne %d et la colonne %d\n",ligne,col);
                                 
                              }}
       |prod division  idf_inst                     
       | factor
;  
factor :idf_inst{
                     if(strcmp($1,"Reel")==0)
                       R=1;
                     else I=1;
           }
       |cst {I=1;}
       |reel { R=1;}
       | par_ov expr par_fr 
;
//exprission logique
expL:notEgal par_ov expressionC par_fr
    |expressionC mc_et expressionC
    |expressionC orsym expressionC 
;

%%
 
int main()
{  
  yyparse();
  afficher();
  return 0;
}
void yyerror(char* msg){
    printf("%s ligne %d et colonne %d l'entite  \n",msg,ligne,col);}

