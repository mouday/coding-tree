# querytree_list

```shell
{QUERY
   :commandType 1
   :querySource 0
   :canSetTag true
   :utilityStmt <>
   :resultRelation 0
   :hasAggs false
   :hasWindowFuncs false
   :hasTargetSRFs false
   :hasSubLinks false
   :hasDistinctOn false
   :hasRecursive false
   :hasModifyingCTE false
   :hasForUpdate false
   :hasRowSecurity false
   :hasGroupRTE false
   :isReturn false
   :cteList <>
   :rtable (
      {RANGETBLENTRY
      :alias
         {ALIAS
         :aliasname c
         :colnames <>
         }
      :eref
         {ALIAS
         :aliasname c
         :colnames ("no" "name")
         }
      :rtekind 0
      :relid 24641
      :inh false
      :relkind r
      :rellockmode 1
      :perminfoindex 1
      :tablesample <>
      :lateral false
      :inFromCl true
      :securityQuals <>
      }
      {RANGETBLENTRY
      :alias
         {ALIAS
         :aliasname tc
         :colnames <>
         }
      :eref
         {ALIAS
         :aliasname tc
         :colnames ("tno" "cno" "stu_num")
         }
      :rtekind 0
      :relid 24647
      :inh false
      :relkind r
      :rellockmode 1
      :perminfoindex 2
      :tablesample <>
      :lateral false
      :inFromCl true
      :securityQuals <>
      }
      {RANGETBLENTRY
      :alias
         {ALIAS
         :aliasname t
         :colnames <>
         }
      :eref
         {ALIAS
         :aliasname t
         :colnames ("no" "name" "sex")
         }
      :rtekind 0
      :relid 24644
      :inh false
      :relkind r
      :rellockmode 1
      :perminfoindex 3
      :tablesample <>
      :lateral false
      :inFromCl true
      :securityQuals <>
      }
   )
   :rteperminfos (
      {RTEPERMISSIONINFO
      :relid 24641
      :inh true
      :requiredPerms 2
      :checkAsUser 0
      :selectedCols (b 8 9)
      :insertedCols (b)
      :updatedCols (b)
      }
      {RTEPERMISSIONINFO
      :relid 24647
      :inh true
      :requiredPerms 2
      :checkAsUser 0
      :selectedCols (b 8 9 10)
      :insertedCols (b)
      :updatedCols (b)
      }
      {RTEPERMISSIONINFO
      :relid 24644
      :inh true
      :requiredPerms 2
      :checkAsUser 0
      :selectedCols (b 8 9)
      :insertedCols (b)
      :updatedCols (b)
      }
   )
   :jointree
      {FROMEXPR
      :fromlist (
         {RANGETBLREF
         :rtindex 1
         }
         {RANGETBLREF
         :rtindex 2
         }
         {RANGETBLREF
         :rtindex 3
         }
      )
      :quals (
         {OPEXPR
         :opno 96
         :opfuncid 65
         :opresulttype 16
         :opretset false
         :opcollid 0
         :inputcollid 0
         :args (
            {VAR
            :varno 1
            :varattno 1
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 1
            :varattnosyn 1
            :location 99
            }
            {VAR
            :varno 2
            :varattno 2
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 2
            :varattnosyn 2
            :location 106
            }
         )
         :location 104
         }
         {OPEXPR
         :opno 96
         :opfuncid 65
         :opresulttype 16
         :opretset false
         :opcollid 0
         :inputcollid 0
         :args (
            {VAR
            :varno 3
            :varattno 1
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 3
            :varattnosyn 1
            :location 117
            }
            {VAR
            :varno 2
            :varattno 1
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 2
            :varattnosyn 1
            :location 124
            }
         )
         :location 122
         }
         {OPEXPR
         :opno 98
         :opfuncid 67
         :opresulttype 16
         :opretset false
         :opcollid 0
         :inputcollid 100
         :args (
            {RELABELTYPE
            :arg
               {VAR
               :varno 1
               :varattno 2
               :vartype 1043
               :vartypmod 24
               :varcollid 100
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 1
               :varattnosyn 2
               :location 135
               }
            :resulttype 25
            :resulttypmod -1
            :resultcollid 100
            :relabelformat 2
            :location -1
            }
            {CONST
            :consttype 25
            :consttypmod -1
            :constcollid 100
            :constlen -1
            :constbyval false
            :constisnull false
            :location 144
            :constvalue 8 [ 32 0 0 0 109 97 116 104 ]
            }
         )
         :location 142
         }
         {OPEXPR
         :opno 98
         :opfuncid 67
         :opresulttype 16
         :opretset false
         :opcollid 0
         :inputcollid 100
         :args (
            {RELABELTYPE
            :arg
               {VAR
               :varno 3
               :varattno 2
               :vartype 1043
               :vartypmod 24
               :varcollid 100
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 3
               :varattnosyn 2
               :location 155
               }
            :resulttype 25
            :resulttypmod -1
            :resultcollid 100
            :relabelformat 2
            :location -1
            }
            {CONST
            :consttype 25
            :consttypmod -1
            :constcollid 100
            :constlen -1
            :constbyval false
            :constisnull false
            :location 164
            :constvalue 7 [ 28 0 0 0 84 111 109 ]
            }
         )
         :location 162
         }
      )
      }
   :mergeActionList <>
   :mergeTargetRelation 0
   :mergeJoinCondition <>
   :targetList (
      {TARGETENTRY
      :expr
         {VAR
         :varno 3
         :varattno 2
         :vartype 1043
         :vartypmod 24
         :varcollid 100
         :varnullingrels (b)
         :varlevelsup 0
         :varnosyn 3
         :varattnosyn 2
         :location 7
         }
      :resno 1
      :resname name
      :ressortgroupref 0
      :resorigtbl 24644
      :resorigcol 2
      :resjunk false
      }
      {TARGETENTRY
      :expr
         {VAR
         :varno 1
         :varattno 2
         :vartype 1043
         :vartypmod 24
         :varcollid 100
         :varnullingrels (b)
         :varlevelsup 0
         :varnosyn 1
         :varattnosyn 2
         :location 15
         }
      :resno 2
      :resname name
      :ressortgroupref 0
      :resorigtbl 24641
      :resorigcol 2
      :resjunk false
      }
      {TARGETENTRY
      :expr
         {VAR
         :varno 2
         :varattno 3
         :vartype 23
         :vartypmod -1
         :varcollid 0
         :varnullingrels (b)
         :varlevelsup 0
         :varnosyn 2
         :varattnosyn 3
         :location 23
         }
      :resno 3
      :resname stu_num
      :ressortgroupref 0
      :resorigtbl 24647
      :resorigcol 3
      :resjunk false
      }
   )
   :override 0
   :onConflict <>
   :returningList <>
   :groupClause <>
   :groupDistinct false
   :groupingSets <>
   :havingQual <>
   :windowClause <>
   :distinctClause <>
   :sortClause <>
   :limitOffset <>
   :limitCount <>
   :limitOption 0
   :rowMarks <>
   :setOperations <>
   :constraintDeps <>
   :withCheckOptions <>
   :stmt_location 0
   :stmt_len 169
}
```