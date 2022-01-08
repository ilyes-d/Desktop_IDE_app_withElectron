#include<string.h>
#include<stdio.h>
#include<stdlib.h>

typedef struct TypeTS
  {
  	char NomEntite[20];
    char TypeEntite[20];
    char NatureEntite[20];
    struct TypeTS *svt;
  }TypeTS;

  TypeTS *ts=NULL,*q=NULL;


//allouer de l'espace memoire pour chaque var/cst rencontre
void allouer(char entite[],char Nature[],char Type[])
{
  TypeTS *temp;
  temp=(TypeTS*)malloc(sizeof(TypeTS));
  strcpy(temp->NomEntite,entite);
  strcpy(temp->TypeEntite,Type);
  strcpy(temp->NatureEntite,"variable");
  temp->svt=NULL;
  //mettre le chainge a jour dans la table des symbole
  //le cas de premier element
  if(ts==NULL)
    {
    ts=temp;//LA tete
    strcpy(ts->TypeEntite,"");//j'ai ajouter le nom du programe a la TS
    strcpy(ts->NatureEntite,"");
    q=temp;
    //si non
    }else{
          q->svt=temp;
          q=temp;
         }

}



//chercher un element dans la table des symbole
TypeTS* recherche(char entite[])
{
    //int i=0;
    TypeTS *temp;
    temp=ts;
    while(temp!=NULL)
      {
        if (strcmp(entite,temp->NomEntite)==0) return temp;//si l'element exist deja
        temp=temp->svt;
    }
  return NULL;
}


//insersion d'un elemet dans la table des symbole
void inserer(char entite[],char Nature[],char Type[])
{
  if ( recherche(entite)==NULL)//verification si il exist deja
      allouer(entite,Nature,Type);
}    


//affichage de la table des symbole
  void afficher ()
  {

  printf("\n/*******************Table des symboles **********************/\n");
  printf("__________________________________________________________\n");
  printf("\t|NomEntite  |  TypeEntite    | NatureEntite     \n");
  printf("__________________________________________________________\n");
  TypeTS *temp;
  temp=ts;
    while(temp!=NULL)
    { 
      
    printf("\t|%10s |%15s | %11s \n",temp->NomEntite,temp->TypeEntite,temp->NatureEntite);
     //passer a l'element suivant
     temp=temp->svt;
     }
  }
  
  //la fonction pour verifier si un element est deja declare
  int idfDeclare(char entite[])
  {
    TypeTS *temp;
    temp= recherche(entite);
    if(strcmp(temp->TypeEntite,"")==0) {return 0;}//element exist deja donc double declaration
    return 1;//element n'exist pas deja dans la table
  }

//la fonction qui nous permi de intialise la nature d'un element
void insererNature(char entite[], char nature[]){
     TypeTS *pos;
     pos=recherche(entite);
     //remplire le champ nature de l'element
     strcpy(pos->NatureEntite,nature);
  }

//la fonction pour rucuper le type d'un element
char* getType(char entite[])
 {
     TypeTS *pos;
     pos=recherche(entite);
     return pos->TypeEntite;
  }

//la fonction qui nous permi de intialise le TYPE d'un element
int insererType(char entite[], char type[]){
       TypeTS *pos;
       pos=recherche(entite);
  
    if(strcmp(pos->TypeEntite,"")==0)// 
    {
      strcpy(pos->TypeEntite,type); 
      return 0;
    }
    return -1;
 }

 //la fonction pour verifier  si l'element est une constante
 int isConst(char entite[]){
  char type[20];
  strcpy(type,getType(entite));
  if(strcmp(type,"reel")==0||strcmp(type,"cst")==0)
    return 1;
    return 0;
}

// fonction pour le sous de ligne
int addLigne(char text[],int ligne){

  for(int i=0;i<strlen(text);i++)
  {
   if(text[i]=='\n')
      ligne++;
  }
  return ligne;
}
