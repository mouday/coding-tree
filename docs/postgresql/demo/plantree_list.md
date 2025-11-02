# plantree_list

```shell
{PLANNEDSTMT
   :commandType 1
   :queryId 0
   :hasReturning false
   :hasModifyingCTE false
   :canSetTag true
   :transientPlan false
   :dependsOnRole false
   :parallelModeNeeded false
   :jitFlags 0
   :planTree
      {HASHJOIN
      :join.plan.disabled_nodes 0
      :join.plan.startup_cost 42.099999999999994
      :join.plan.total_cost 80.72375
      :join.plan.plan_rows 1
      :join.plan.plan_width 120
      :join.plan.parallel_aware false
      :join.plan.parallel_safe true
      :join.plan.async_capable false
      :join.plan.plan_node_id 0
      :join.plan.targetlist (
         {TARGETENTRY
         :expr
            {VAR
            :varno -1
            :varattno 1
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
            :varno -2
            :varattno 1
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
            :varno -2
            :varattno 2
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
      :join.plan.qual <>
      :join.plan.lefttree
         {HASHJOIN
         :join.plan.disabled_nodes 0
         :join.plan.startup_cost 21.3
         :join.plan.total_cost 59.75999999999999
         :join.plan.plan_rows 41
         :join.plan.plan_width 66
         :join.plan.parallel_aware false
         :join.plan.parallel_safe true
         :join.plan.async_capable false
         :join.plan.plan_node_id 1
         :join.plan.targetlist (
            {TARGETENTRY
            :expr
               {VAR
               :varno -1
               :varattno 1
               :vartype 1043
               :vartypmod 24
               :varcollid 100
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 1
               :varattnosyn 2
               :location 15
               }
            :resno 1
            :resname <>
            :ressortgroupref 0
            :resorigtbl 0
            :resorigcol 0
            :resjunk false
            }
            {TARGETENTRY
            :expr
               {VAR
               :varno -2
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
            :resno 2
            :resname <>
            :ressortgroupref 0
            :resorigtbl 0
            :resorigcol 0
            :resjunk false
            }
            {TARGETENTRY
            :expr
               {VAR
               :varno -2
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
            :resno 3
            :resname <>
            :ressortgroupref 0
            :resorigtbl 0
            :resorigcol 0
            :resjunk false
            }
         )
         :join.plan.qual <>
         :join.plan.lefttree
            {SEQSCAN
            :scan.plan.disabled_nodes 0
            :scan.plan.startup_cost 0
            :scan.plan.total_cost 30.400000000000002
            :scan.plan.plan_rows 2040
            :scan.plan.plan_width 12
            :scan.plan.parallel_aware false
            :scan.plan.parallel_safe true
            :scan.plan.async_capable false
            :scan.plan.plan_node_id 2
            :scan.plan.targetlist (
               {TARGETENTRY
               :expr
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
                  :location -1
                  }
               :resno 1
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
               {TARGETENTRY
               :expr
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
                  :location -1
                  }
               :resno 2
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
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
                  :location -1
                  }
               :resno 3
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
            )
            :scan.plan.qual <>
            :scan.plan.lefttree <>
            :scan.plan.righttree <>
            :scan.plan.initPlan <>
            :scan.plan.extParam (b)
            :scan.plan.allParam (b)
            :scan.scanrelid 2
            }
         :join.plan.righttree
            {HASH
            :plan.disabled_nodes 0
            :plan.startup_cost 21.25
            :plan.total_cost 21.25
            :plan.plan_rows 4
            :plan.plan_width 62
            :plan.parallel_aware false
            :plan.parallel_safe true
            :plan.async_capable false
            :plan.plan_node_id 3
            :plan.targetlist (
               {TARGETENTRY
               :expr
                  {VAR
                  :varno -2
                  :varattno 1
                  :vartype 1043
                  :vartypmod 24
                  :varcollid 100
                  :varnullingrels (b)
                  :varlevelsup 0
                  :varnosyn 1
                  :varattnosyn 2
                  :location -1
                  }
               :resno 1
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
               {TARGETENTRY
               :expr
                  {VAR
                  :varno -2
                  :varattno 2
                  :vartype 23
                  :vartypmod -1
                  :varcollid 0
                  :varnullingrels (b)
                  :varlevelsup 0
                  :varnosyn 1
                  :varattnosyn 1
                  :location -1
                  }
               :resno 2
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
            )
            :plan.qual <>
            :plan.lefttree
               {SEQSCAN
               :scan.plan.disabled_nodes 0
               :scan.plan.startup_cost 0
               :scan.plan.total_cost 21.25
               :scan.plan.plan_rows 4
               :scan.plan.plan_width 62
               :scan.plan.parallel_aware false
               :scan.plan.parallel_safe true
               :scan.plan.async_capable false
               :scan.plan.plan_node_id 4
               :scan.plan.targetlist (
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
                  :resno 1
                  :resname <>
                  :ressortgroupref 0
                  :resorigtbl 0
                  :resorigcol 0
                  :resjunk false
                  }
                  {TARGETENTRY
                  :expr
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
                  :resno 2
                  :resname <>
                  :ressortgroupref 0
                  :resorigtbl 0
                  :resorigcol 0
                  :resjunk false
                  }
               )
               :scan.plan.qual (
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
               )
               :scan.plan.lefttree <>
               :scan.plan.righttree <>
               :scan.plan.initPlan <>
               :scan.plan.extParam (b)
               :scan.plan.allParam (b)
               :scan.scanrelid 1
               }
            :plan.righttree <>
            :plan.initPlan <>
            :plan.extParam (b)
            :plan.allParam (b)
            :hashkeys (
               {VAR
               :varno -2
               :varattno 2
               :vartype 23
               :vartypmod -1
               :varcollid 0
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 1
               :varattnosyn 1
               :location 99
               }
            )
            :skewTable 24647
            :skewColumn 2
            :skewInherit false
            :rows_total 0
            }
         :join.plan.initPlan <>
         :join.plan.extParam (b)
         :join.plan.allParam (b)
         :join.jointype 0
         :join.inner_unique false
         :join.joinqual <>
         :hashclauses (
            {OPEXPR
            :opno 96
            :opfuncid 65
            :opresulttype 16
            :opretset false
            :opcollid 0
            :inputcollid 0
            :args (
               {VAR
               :varno -2
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
               {VAR
               :varno -1
               :varattno 2
               :vartype 23
               :vartypmod -1
               :varcollid 0
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 1
               :varattnosyn 1
               :location 99
               }
            )
            :location -1
            }
         )
         :hashoperators (o 96)
         :hashcollations (o 0)
         :hashkeys (
            {VAR
            :varno -2
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
         }
      :join.plan.righttree
         {HASH
         :plan.disabled_nodes 0
         :plan.startup_cost 20.75
         :plan.total_cost 20.75
         :plan.plan_rows 4
         :plan.plan_width 62
         :plan.parallel_aware false
         :plan.parallel_safe true
         :plan.async_capable false
         :plan.plan_node_id 5
         :plan.targetlist (
            {TARGETENTRY
            :expr
               {VAR
               :varno -2
               :varattno 1
               :vartype 1043
               :vartypmod 24
               :varcollid 100
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 3
               :varattnosyn 2
               :location -1
               }
            :resno 1
            :resname <>
            :ressortgroupref 0
            :resorigtbl 0
            :resorigcol 0
            :resjunk false
            }
            {TARGETENTRY
            :expr
               {VAR
               :varno -2
               :varattno 2
               :vartype 23
               :vartypmod -1
               :varcollid 0
               :varnullingrels (b)
               :varlevelsup 0
               :varnosyn 3
               :varattnosyn 1
               :location -1
               }
            :resno 2
            :resname <>
            :ressortgroupref 0
            :resorigtbl 0
            :resorigcol 0
            :resjunk false
            }
         )
         :plan.qual <>
         :plan.lefttree
            {SEQSCAN
            :scan.plan.disabled_nodes 0
            :scan.plan.startup_cost 0
            :scan.plan.total_cost 20.75
            :scan.plan.plan_rows 4
            :scan.plan.plan_width 62
            :scan.plan.parallel_aware false
            :scan.plan.parallel_safe true
            :scan.plan.async_capable false
            :scan.plan.plan_node_id 6
            :scan.plan.targetlist (
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
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
               {TARGETENTRY
               :expr
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
               :resno 2
               :resname <>
               :ressortgroupref 0
               :resorigtbl 0
               :resorigcol 0
               :resjunk false
               }
            )
            :scan.plan.qual (
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
            :scan.plan.lefttree <>
            :scan.plan.righttree <>
            :scan.plan.initPlan <>
            :scan.plan.extParam (b)
            :scan.plan.allParam (b)
            :scan.scanrelid 3
            }
         :plan.righttree <>
         :plan.initPlan <>
         :plan.extParam (b)
         :plan.allParam (b)
         :hashkeys (
            {VAR
            :varno -2
            :varattno 2
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 3
            :varattnosyn 1
            :location 117
            }
         )
         :skewTable 24647
         :skewColumn 1
         :skewInherit false
         :rows_total 0
         }
      :join.plan.initPlan <>
      :join.plan.extParam (b)
      :join.plan.allParam (b)
      :join.jointype 0
      :join.inner_unique false
      :join.joinqual <>
      :hashclauses (
         {OPEXPR
         :opno 96
         :opfuncid 65
         :opresulttype 16
         :opretset false
         :opcollid 0
         :inputcollid 0
         :args (
            {VAR
            :varno -2
            :varattno 3
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 2
            :varattnosyn 1
            :location 124
            }
            {VAR
            :varno -1
            :varattno 2
            :vartype 23
            :vartypmod -1
            :varcollid 0
            :varnullingrels (b)
            :varlevelsup 0
            :varnosyn 3
            :varattnosyn 1
            :location 117
            }
         )
         :location -1
         }
      )
      :hashoperators (o 96)
      :hashcollations (o 0)
      :hashkeys (
         {VAR
         :varno -2
         :varattno 3
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
      }
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
   :permInfos (
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
   :resultRelations <>
   :appendRelations <>
   :subplans <>
   :rewindPlanIDs (b)
   :rowMarks <>
   :relationOids (o 24641 24647 24644)
   :invalItems <>
   :paramExecTypes <>
   :utilityStmt <>
   :stmt_location 0
   :stmt_len 169
   }
```