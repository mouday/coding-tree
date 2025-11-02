# parsetree_list

```shell
{RAWSTMT
   :stmt {SELECTSTMT
      :distinctClause <>
      :intoClause <>
      :targetList (
         {RESTARGET
         :name <>
         :indirection <>
         :val
            {COLUMNREF
            :fields ("t" "name")
            :location 7
            }
         :location 7
         }
         {RESTARGET
         :name <>
         :indirection <>
         :val
            {COLUMNREF
            :fields ("c" "name")
            :location 15
            }
         :location 15
         }
         {RESTARGET
         :name <>
         :indirection <>
         :val
            {COLUMNREF
            :fields ("stu_num")
            :location 23
            }
         :location 23
         }
      )
      :fromClause (
         {RANGEVAR
         :catalogname <>
         :schemaname <>
         :relname tb_course
         :inh true
         :relpersistence p
         :alias
            {ALIAS
            :aliasname c
            :colnames <>
            }
         :location 36
         }
         {RANGEVAR
         :catalogname <>
         :schemaname <>
         :relname tb_teacher_course
         :inh true
         :relpersistence p
         :alias
            {ALIAS
            :aliasname tc
            :colnames <>
            }
         :location 52
         }
         {RANGEVAR
         :catalogname <>
         :schemaname <>
         :relname tb_teacher
         :inh true
         :relpersistence p
         :alias
            {ALIAS
            :aliasname t
            :colnames <>
            }
         :location 77
         }
      )
      :whereClause
         {BOOLEXPR
         :boolop and
         :args (
            {A_EXPR
            :name ("=")
            :lexpr
               {COLUMNREF
               :fields ("c" "no")
               :location 99
               }
            :rexpr
               {COLUMNREF
               :fields ("tc" "cno")
               :location 106
               }
            :location 104
            }
            {A_EXPR
            :name ("=")
            :lexpr
               {COLUMNREF
               :fields ("t" "no")
               :location 117
               }
            :rexpr
               {COLUMNREF
               :fields ("tc" "tno")
               :location 124
               }
            :location 122
            }
            {A_EXPR
            :name ("=")
            :lexpr
               {COLUMNREF
               :fields ("c" "name")
               :location 135
               }
            :rexpr
               {A_CONST
               :val "math"
               :location 144
               }
            :location 142
            }
            {A_EXPR
            :name ("=")
            :lexpr
               {COLUMNREF
               :fields ("t" "name")
               :location 155
               }
            :rexpr
               {A_CONST
               :val "Tom"
               :location 164
               }
            :location 162
            }
         )
         :location 113
         }
      :groupClause <>
      :groupDistinct false
      :havingClause <>
      :windowClause <>
      :valuesLists <>
      :sortClause <>
      :limitOffset <>
      :limitCount <>
      :limitOption 0
      :lockingClause <>
      :withClause <>
      :op 0
      :all false
      :larg <>
      :rarg <>
      :stmt_location 0
      :stmt_len 0
      }
   :stmt_location 0
   :stmt_len 169
   }
```